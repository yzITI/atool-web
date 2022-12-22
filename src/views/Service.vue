<script setup>
import state from '../state.js'
import { I } from '../utils/string.js'
import srpc from '../utils/srpc.js'
import Permission from '../components/Permission.vue'
import Toggle from '../components/Toggle.vue'
import Editor from '../components/Editor.vue'
import NodeSelector from '../components/NodeSelector.vue'
import { CheckCircleIcon, XMarkIcon, PlusIcon, CodeBracketIcon, SquaresPlusIcon, CircleStackIcon } from '@heroicons/vue/24/outline'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter(), route = useRoute()

const nid = route.params.id

state.loading = true
if (!state.user) router.push('/')
else init()

let info = $ref({}), links = $ref({}), showCode = $ref(false), showData = $ref(false)

let timeStr = $computed(() => {
  if (!info.time) return ''
  return moment(info.time).format('YYYY-MM-DD HH:mm:ss')
})

function refreshLink () {
  if (state.user && state.nodes[nid] && state.nodes[nid].name !== info.name) state.nodes[nid].name = info.name
}

async function init () {
  state.loading = true
  const res = await srpc.S.get(state.user?.token || '', nid)
  if (!res) {
    await Swal.fire(I('[[Error|错误]]'), I('[[Service not found or permission denied|服务未找到或权限不足]]'), 'error')
    return router.push('/')
  }
  links = await srpc.U.getLinkFrom(state.user?.token || '', nid)
  state.loading = false
  info = { name: res.name, time: res.time, entry: res.entry, links: res.links, forms: {}, data: {} }
  for (const k in info.links) {
    if (k[k.length - 1] === 'F') info.forms[k] = JSON.parse(res[k] || '{}')
    if (k[k.length - 1] === 'D') info.data[k] = info.links[k]
  }
  refreshLink()
}

async function submit () {
  if (!state.user?.token) return
  const data = { name: info.name }
  if (info.entry) data.entry = info.entry
  for (const f in info.forms) data[f] = JSON.stringify(info.forms[f])
  state.loading = true
  const res = await srpc.S.put(state.user.token, nid, data)
  state.loading = false
  if (!res) return Swal.fire(I('[[Error|错误]]'), I('[[Fail to save|保存失败]]'), 'error')
  refreshLink()
  Swal.fire(I('[[Success|保存成功]]'), '', 'success')
}

let showSelector = $ref(false)

async function putLink (id, name, role = 'viewer') {
  const type = id[id.length - 1]
  if (info.links[id] && info.links[id].role === role) return
  state.loading = true
  const res = await srpc.S.putLinkTo(state.user?.token || '', nid, id, { role })
  state.loading = false
  if (!res) return Swal.fire(I('[[Permission Denied|权限不足]]'), '', 'error')
  info.links[id] = { name, role }
  if (type === 'F') info.forms[id] = {}
  if (type === 'D') info.data[id] = info.links[id]
}

async function delLink (id) {
  const type = id[id.length - 1]
  const { isConfirmed } = await Swal.fire({
    title: type === 'F' ? I('[[Delete Form?|删除表单？]]') : I('[[Delete Data?|删除数据？]]'),
    html: type === 'F' ? I('[[Code will be deleted as well|表单代码也将被删除]]') : I('[[Data will not be accessible in this service|服务将无法访问该数据]]'),
    icon: 'warning',
    showCancelButton: true
  })
  if (!isConfirmed) return
  state.loading = true
  const res = await srpc.S.delLinkTo(state.user?.token || '', nid, id)
  state.loading = false
  if (!res) return Swal.fire('Error', '', 'error')
  delete info.links[id]
  delete info.forms[id]
  delete info.data[id]
  if (info.entry === id) delete info.entry
}

function roleClass (role) {
  if (role === 'editor') return 'border-amber-500 text-amber-500'
  if (role === 'viewer') return 'border-green-600 text-green-600'
}

function changeDataRole (id, e) {
  const v = e.target.value
  if (v !== info.links[id].role) putLink(id, info.links[id].name, v)
}

function toggleFormData (id) {
  if (!showData) return
  const f = info.forms[showData]
  if (!f.data) f.data = []
  if (!f.data.includes(id)) f.data.push(id)
  else f.data = f.data.filter(x => x !== id)
}

let simple = $ref(true)
async function copyURL () {
  const url = window.location.origin + '/#/run/' + nid + (simple ? '?simple=1' : '')
  await navigator.clipboard.writeText(url)
  Swal.fire(I('[[Link Copied|链接已复制]]'), '', 'success')
}

const newTitle = {
  F: '[[New Form|新建表单]]',
  D: '[[New Data|新建数据]]'
}
const random = () => Math.random().toString(36).substr(2, 8) + Math.random().toString(36).substr(2, 7)

async function createNode (on) {
  const id = await random() + on, name = nid.substring(0, 4) + '.' + I(newTitle[on])
  state.loading = true
  const res = await srpc[on].put(state.user.token, id, { name })
  state.loading = false
  if (res) {
    state.nodes[id] = { name, role: 'owner' }
    return window.open(`/#/${on}/${id}?edit=1`)
  }
  Swal.fire('Error', '', 'error')
}
</script>

<template>
  <Transition name="fade">
    <div class="fixed z-20 top-0 left-0 w-screen h-screen flex items-center justify-center" v-if="showCode || showData">
      <div class="h-full w-full bg-black opacity-50 absolute" @click="showCode = showData = false" />
      <div v-if="showData" class="w-96 h-1/2 bg-white z-20 shadow rounded p-4 overflow-y-auto" :set="f = info.forms[showData]">
        <h3 class="text-lg font-bold">{{ I('[[Select Data for the Form|配置表单代码可访问的数据]]') }}</h3>
        <div class="flex flex-col items-start p-1 w-full">
          <div class="flex items-center border-b border-gray-200 w-full first:border-t all-transition p-1 cursor-pointer" v-for="(d, id) in info.data" :class="f.data?.includes(id) && 'bg-blue-50'" @click="toggleFormData(id)">
            <CheckCircleIcon class="w-4 mr-1 text-blue-500" :class="f.data?.includes(id) || 'opacity-0'" />
            {{ info.links[id].name }}
            <code class="px-1 mx-1 text-gray-500 rounded select-all" style="font-size: 0.65rem;">{{ id }}</code>
            <div class="border rounded px-1 cursor-pointer text-sm" :class="roleClass(d.role)">{{ d.role }}</div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
  <div class="all-transition fixed z-20 p-2 w-11/12 md:w-2/3 bg-white h-screen" :class="showCode ? 'right-0' : '-right-full'">
    <div class="text-sm text-gray-500 mb-2">{{ I('[[Backend Code|后端代码]]') }}</div>
    <Editor v-if="showCode" v-model="info.forms[showCode].code" class="h-full" />
  </div>
  <NodeSelector v-model="showSelector" @select="putLink" />
  <!-- main UI -->
  <div class="w-full min-h-full p-4" v-if="info.time">
    <h3 class="font-bold flex items-center justify-between my-1">
      <input class="bg-transparent text-xl" v-model="info.name">
      <button @click="submit" class="bg-blue-500 rounded shadow all-transition hover:shadow-md px-3 py-1 text-sm text-white">{{ I('[[Save|保存]]') }}</button>
    </h3>
    <div class="flex flex-col md:flex-row w-full md:items-start">
      <div class="grow">
        <div class="p-3 m-2 bg-white shadow rounded">
          <h3 class="text-lg font-bold border-b flex items-center">
            <SquaresPlusIcon class="w-6 mr-1" />
            {{ I('[[Service Forms|服务表单]]') }}
          </h3>
          <div v-for="f, id in info.forms" class="all-transition border-b border-gray-200 hover:bg-gray-100 bg-white p-2 text-gray-700 flex items-center justify-between">
            <div class="flex items-center">
              {{ info.links[id].name }}
              <code class="px-1 mx-1 bg-gray-100 text-gray-500 rounded select-all" style="font-size: 0.65rem;">{{ id }}</code>
            </div>
            <div class="flex items-center">
              <CodeBracketIcon class="w-5 mx-2 rounded cursor-pointer" :class="info.forms[id].code ? 'text-green-500' : 'text-gray-500'" @click="showCode = id" />
              <CircleStackIcon class="w-5 mx-2 rounded cursor-pointer" :class="info.forms[id].data?.length ? 'text-amber-500' : 'text-gray-500'" @click="showData = id" />
              <XMarkIcon class="w-5 mx-2 rounded cursor-pointer text-red-500" @click="delLink(id)"/>
            </div>
          </div>
          <div class="flex items-center">
            <button class="flex items-center px-3 py-1 bg-green-600 rounded text-white font-bold my-2" @click="showSelector = 'F'">
              <PlusIcon class="w-6 mr-1"/>
              {{ I('[[Add Form|添加表单]]') }}
            </button>
            <button class="flex items-center px-3 py-1 ml-2 bg-yellow-600 rounded text-white font-bold my-2" @click="createNode('F')">{{ I('[[Create Form|创建表单]]') }}</button>
          </div>
        </div>
        <div class="p-3 m-2 bg-white shadow rounded">
          <h3 class="text-lg font-bold border-b flex items-center">
            <CircleStackIcon class="w-6 mr-1" />
            {{ I('[[Service Data|服务数据]]') }}
          </h3>
          <div v-for="d, id in info.data" class="all-transition border-b border-gray-200 hover:bg-gray-100 bg-white p-2 text-gray-700 flex items-center justify-between">
            <div class="flex items-center">
              {{ info.links[id].name }}
              <code class="px-1 mx-1 bg-gray-100 text-gray-500 rounded select-all" style="font-size: 0.65rem;">{{ id }}</code>
            </div>
            <div class="flex items-center">
              <select class="border rounded px-1 cursor-pointer" :value="d.role" @change="changeDataRole(id, $event)" :class="roleClass(d.role)">
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
              <XMarkIcon class="w-5 mx-2 rounded cursor-pointer text-red-500" @click="delLink(id)"/>
            </div>
          </div>
          <div class="flex items-center">
            <button class="flex items-center px-3 py-1 bg-green-600 rounded text-white font-bold my-2" @click="showSelector = 'D'">
              <PlusIcon class="w-6 mr-1"/>
              {{ I('[[Add Data|添加数据]]') }}
            </button>
            <button class="flex items-center px-3 py-1 ml-2 bg-yellow-600 rounded text-white font-bold my-2" @click="createNode('D')">{{ I('[[Create Data|创建数据]]') }}</button>
          </div>
        </div>
      </div>
      <div class="md:w-96 xl:w-1/3">
        <div class="p-3 m-2 bg-white shadow rounded">
          <h3 class="text-lg font-bold">{{ I('[[Information|服务信息]]') }}</h3>
          <hr>
          <div class="flex items-center py-2 px-1 flex-wrap">
            <button class="px-3 py-2 rounded shadow all-transition hover:shadow-md bg-blue-500 text-white font-bold text-sm" @click="copyURL">{{ I('[[Copy viewer\'s link|复制访问者链接]]') }}</button>
            <Toggle v-model="simple" class="scale-75">{{ I('[[Simple View|简明视图]]') }}</Toggle>
          </div>
          <label class="block my-2">
            <span class="font-bold block">{{ I('[[Entry Form|入口表单]]') }}</span>
            <select class="border rounded px-2 py-1 w-full" v-model="info.entry">
              <option v-for="(f, id) in info.forms" :value="id">{{ info.links[id].name }}</option>
            </select>
          </label>
        </div>
        <Permission v-if="links" :links="links" :nid="nid" />
      </div>
    </div>
  </div>
</template>
