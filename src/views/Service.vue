<script setup>
import { watch } from 'vue'
import state from '../state.js'
import { I } from '../utils/string.js'
import Toggle from '../components/Toggle.vue'
import srpc from '../utils/srpc.js'
import Editor from '../components/Editor.vue'
import { DocumentTextIcon, Bars3Icon, PencilSquareIcon, XMarkIcon, PlusIcon, CodeBracketIcon, CheckIcon } from '@heroicons/vue/24/outline'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter(), route = useRoute()

const nid = route.params.id
let isAdmin = $computed(() => state.nodes[nid]?.role === 'owner')

init()

let info = $ref({}), links = $ref({}), coding = $ref(false), keyword = $ref(''), queryInput = $ref('')

let timeStr = $computed(() => {
  if (!info.time) return ''
  return moment(info.time).format('YYYY-MM-DD HH:mm:ss')
})

function refreshLink () {
  if (state.user && state.nodes[nid] && state.nodes[nid].name !== info.name) state.nodes[nid].name = info.name
}

let isPublic = $ref(false)

watch($$(isPublic), async v => {
  if (v) await srpc.U.putLinkTo(state.user?.token || '', '', nid, { role: 'viewer' })
  else await srpc.U.delLinkTo(state.user?.token || '', 'U', nid)
})

async function init () {
  state.loading = true
  const res = await srpc.S.get(state.user?.token || '', nid)
  if (!res) {
    await Swal.fire(I('[[Error|错误]]'), I('[[Service not found or permission denied|服务未找到或权限不足]]'), 'error')
    return router.push('/')
  }
  links = await srpc.U.getLinkFrom(state.user?.token || '', nid)
  state.loading = false
  info = { name: res.name, time: res.time, links: res.links, forms: {} }
  if (links.U) isPublic = true
  delete links.U
  for (const k in info.links) {
    if (k[k.length - 1] === 'F') info.forms[k] = JSON.parse(res[k] || '{}')
  }
  refreshLink()
}

async function submit () {
  if (!state.user?.token) return
  const data = { name: info.name }
  for (const f in info.forms) data[f] = JSON.stringify(info.forms[f])
  state.loading = true
  const res = await srpc.node.put(state.user.token, nid, data)
  state.loading = false
  if (!res) return Swal.fire(I('[[Error|错误]]'), I('[[Fail to save|保存失败]]'), 'error')
  refreshLink()
  Swal.fire(I('[[Success|保存成功]]'), '', 'success')
}

let showForm = $ref(false)
</script>

<template>
  <Transition name="fade">
    <div class="fixed top-0 left-0 w-screen h-screen bg-black opacity-50" v-if="coding" @click="coding = false" />
  </Transition>
  <div class="all-transition fixed p-2 w-11/12 md:w-2/3 bg-white h-screen" :class="coding ? 'right-0' : '-right-full'">
    <div class="text-sm text-gray-500 mb-2">{{ I('[[Backend Code|后端代码]]') }}</div>
    <Editor v-if="coding" v-model="info.forms[coding].code" class="h-full" />
  </div>
  <!--
  <Transition name="fade">
    <div class="fixed top-0 left-0 w-screen h-screen bg-black opacity-50" v-if="showForm" @click="showForm = false" />
  </Transition>
  <div class="all-transition fixed w-11/12 md:w-1/3 bg-white h-screen" :class="showForm ? 'right-0' : '-right-full'">
    <h4 class="text-lg font-bold text-center my-2">{{ I('[[All forms|所有表单]]') }}</h4>
    <input class="w-full py-1 px-2 mb-2 text-sm font-mono border" :placeholder="I('[[Search Form ID|搜索表单ID]]')" v-model="keyword">
    <div v-for="(n, id) in state.nodes">
      <div v-if="n.data.type === 'form'" class="flex items-center px-1 cursor-pointer all-transition" :class="forms[n.node] ? 'bg-blue-200' : 'bg-gray-100'" @click="choose(n.node)">
        <CheckIcon v-if="forms[n.node]" class="w-4 text-blue-500" />
        <PlusIcon v-else class="w-4 text-gray-400" />
        <div class="mx-1 font-bold">{{ n.name }}</div>
      </div>
    </div>
  </div>
  -->
  <div class="w-full min-h-full p-4" v-if="info.time">
    <h3 class="font-bold flex items-center justify-between my-1">
      <input class="bg-transparent text-xl" v-model="info.name">
      <button @click="submit" class="bg-blue-500 rounded shadow all-transition hover:shadow-md px-3 py-1 text-sm text-white">{{ I('[[Save|保存]]') }}</button>
    </h3>
    <div class="flex flex-col md:flex-row w-full">
      <div class="p-3 m-2 bg-white shadow rounded grow">
        <h3 class="text-lg font-bold border-b">{{ I('[[Service Forms|服务表单]]') }}</h3>
        <div v-for="f, id in info.forms" class="all-transition border-b border-gray-200 hover:bg-gray-100 bg-white p-2 text-gray-700 flex">
          <div>{{ info.links[f].name }}</div>
          <div class="grow"></div>
          <CodeBracketIcon class="w-5 mx-2 rounded cursor-pointer text-green-500" @click="coding = id" />
          <XMarkIcon class="w-5 mx-2 rounded cursor-pointer text-red-500" @click="delete info.forms[id]"/>
        </div>
        <button class="flex items-center px-3 py-1 bg-blue-500 rounded text-white font-bold my-2" @click="showForm = true">
          <PlusIcon class="w-6 mr-1"/>
          {{ I('[[Add Form|添加表单]]') }}
        </button>
      </div>
      <div class="md:w-96 xl:w-1/3">
        <div class="p-3 m-2 bg-white shadow rounded" v-if="state.nodes[nid]?.role === 'owner'">
          <h3 class="text-lg font-bold">{{ I('[[Permission|权限管理]]') }}</h3>
          <hr>
          <label class="block my-2 flex items-center">
            <span class="font-bold mr-2">{{ I('[[Public|公开]]') }}</span>
            <Toggle v-model="isPublic" />
            <p class="text-xs text-gray-500">{{ I('[[accessible by link|可通过链接访问]]') }}</p>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
