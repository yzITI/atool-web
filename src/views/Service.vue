<script setup>
import state from '../state.js'
import { I } from '../utils/string.js'
import srpc from '../utils/srpc.js'
import Permission from '../components/Permission.vue'
import Toggle from '../components/Toggle.vue'
import Editor from '../components/Editor.vue'
import NodeSelector from '../components/NodeSelector.vue'
import { XMarkIcon, PlusIcon, CodeBracketIcon, SquaresPlusIcon, CircleStackIcon } from '@heroicons/vue/24/outline'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter(), route = useRoute()

const nid = route.params.id

state.loading = true
if (!state.user) router.push('/')
else init()

let info = $ref({}), links = $ref({}), coding = $ref(false)

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
  info = { name: res.name, time: res.time, entry: res.entry, links: res.links, forms: {} }
  for (const k in info.links) {
    if (k[k.length - 1] === 'F') info.forms[k] = JSON.parse(res[k] || '{}')
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

async function addLink (id, name) {
  const type = showSelector
  if (info.links[id]) return
  state.loading = true
  const res = await srpc.S.putLinkTo(state.user?.token || '', nid, id, { role: 'viewer' })
  state.loading = false
  if (!res) return Swal.fire(I('[[Permissio Denied|权限不足]]'), '', 'error')
  info.links[id] = { name, role: 'viewer' }
  if (type === 'F') info.forms[id] = {}
}

async function delLink (id) {
  const { isConfirmed } = await Swal.fire({
    title: I('[[Delete Form?|删除表单？]]'),
    html: I('[[Code will be deleted as well|表单代码也将被删除]]'),
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
  if (info.entry === id) delete info.entry
}

let simple = $ref(true)
async function copyURL () {
  const url = window.location.origin + '/#/run/' + nid + (simple ? '?simple=1' : '')
  await navigator.clipboard.writeText(url)
  Swal.fire(I('[[Link Copied|链接已复制]]'), '', 'success')
}
</script>

<template>
  <Transition name="fade">
    <div class="fixed z-20 top-0 left-0 w-screen h-screen bg-black opacity-50" v-if="coding" @click="coding = false" />
  </Transition>
  <div class="all-transition fixed z-20 p-2 w-11/12 md:w-2/3 bg-white h-screen" :class="coding ? 'right-0' : '-right-full'">
    <div class="text-sm text-gray-500 mb-2">{{ I('[[Backend Code|后端代码]]') }}</div>
    <Editor v-if="coding" v-model="info.forms[coding].code" class="h-full" />
  </div>
  <NodeSelector v-model="showSelector" @select="addLink" />
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
              <CodeBracketIcon class="w-5 mx-2 rounded cursor-pointer" :class="info.forms[id].code ? 'text-green-500' : 'text-gray-500'" @click="coding = id" />
              <XMarkIcon class="w-5 mx-2 rounded cursor-pointer text-red-500" @click="delLink(id)"/>
            </div>
          </div>
          <button class="flex items-center px-3 py-1 bg-green-600 rounded text-white font-bold my-2" @click="showSelector = 'F'">
            <PlusIcon class="w-6 mr-1"/>
            {{ I('[[Add Form|添加表单]]') }}
          </button>
        </div>
        <div class="p-3 m-2 bg-white shadow rounded">
          <h3 class="text-lg font-bold border-b flex items-center">
            <CircleStackIcon class="w-6 mr-1" />
            {{ I('[[Service Data|服务数据]]') }}
          </h3>
          <div v-for="f, id in info.data" class="all-transition border-b border-gray-200 hover:bg-gray-100 bg-white p-2 text-gray-700 flex items-center justify-between">
            <div class="flex items-center">
              {{ info.links[id].name }}
              <code class="px-1 mx-1 bg-gray-100 text-gray-500 rounded select-all" style="font-size: 0.65rem;">{{ id }}</code>
            </div>
            <div class="flex items-center">
              <XMarkIcon class="w-5 mx-2 rounded cursor-pointer text-red-500" @click="delLink(id)"/>
            </div>
          </div>
          <button class="flex items-center px-3 py-1 bg-green-600 rounded text-white font-bold my-2" @click="showSelector = 'D'">
            <PlusIcon class="w-6 mr-1"/>
            {{ I('[[Add Data|添加数据]]') }}
          </button>
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
