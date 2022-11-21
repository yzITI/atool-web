<script setup>
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

let info = $ref({}), forms = $ref({}), codes = $ref({}), coding = $ref(false), keyword = $ref(''), queryInput = $ref('')

let timeStr = $computed(() => {
  if (!info.time) return ''
  return moment(info.time).format('YYYY-MM-DD HH:mm:ss')
})

function refreshLink () {
  if (state.user && state.nodes[nid] && state.nodes[nid].title !== info.title) {
    srpc.node.refreshLink(state.user.token, nid)
    state.nodes[nid].title = info.title
  }
}

function choose (id) {
  if (forms[id]) return delete forms[id]
  forms[id] = { title: state.nodes[id].data.title }
}

function filter (f) {
  if (mode === 0) return f.data.title.indexOf(keyword) !== -1
  if (mode === 1) {
    const list = queryInput.split('\n').map(x => x.trim())
    for (const id of list) {
      if (id === f.node) return true
    }
    return false
  }
}

async function init () {
  state.loading = true
  const res = await srpc.node.get(state.user?.token || '', nid)
  if (!res) {
    await Swal.fire(I('[[Error|错误]]'), I('[[Service not found or permission denied|服务未找到或权限不足]]'), 'error')
    return router.push('/')
  }
  state.loading = false
  info = { title: res.title, time: res.time, public: res.public }
  forms = JSON.parse(res.forms || '{}')
  for (const f in forms) {
    if (res[f]) codes[f] = res[f]
  }
  refreshLink()
}

async function submit () {
  if (!state.user?.token) return
  const data = { title: info.title, public: info.public, type: 'service', forms: JSON.stringify(forms) }
  for (const f in forms) {
    if (codes[f]) data[f] = codes[f]
  }
  state.loading = true
  const res = await srpc.node.put(state.user.token, nid, data)
  state.loading = false
  if (!res) return Swal.fire(I('[[Error|错误]]'), I('[[Fail to save|保存失败]]'), 'error')
  refreshLink()
  Swal.fire(I('[[Success|保存成功]]'), '', 'success')
}

let showPanel = $ref(true), showForm = $ref(false), mode = $ref(0)
</script>

<template>
  <Transition name="fade">
    <div class="fixed top-0 left-0 w-screen h-screen bg-black opacity-50" v-if="coding" @click="coding = false" />
  </Transition>
  <div class="all-transition fixed p-2 w-11/12 md:w-2/3 bg-white h-screen" :class="coding ? 'right-0' : '-right-full'">
    <div class="text-sm text-gray-500 mb-2">{{ I('[[Backend Code|后端代码]]') }}</div>
    <Editor v-if="coding" v-model="codes[coding]" class="h-full" />
  </div>
  <Transition name="fade">
    <div class="fixed top-0 left-0 w-screen h-screen bg-black opacity-50" v-if="showForm" @click="showForm = false" />
  </Transition>
  <div class="all-transition fixed w-11/12 md:w-1/3 bg-white h-screen" :class="showForm ? 'right-0' : '-right-full'">
    <div class="flex items-center whitespace-nowrap w-full shadow">
      <button class="grow p-2 font-bold all-transition" :class="mode === 0 && 'bg-blue-500 text-white'" @click="mode = 0">{{ I('[[All forms|所有表单]]') }}</button>
      <button class="grow p-2 font-bold all-transition border-l" :class="mode === 1 && 'bg-blue-500 text-white'" @click="mode = 1">{{ I('[[Batch Query|批量查询]]') }}</button>
    </div>
    <div v-if="mode === 0">
      <input class="w-full py-1 px-2 shadow" :placeholder="I('[[Search by Title|搜索标题]]')" v-model="keyword">
    </div>
    <div v-if="mode === 1">
      <textarea class="w-full py-1 px-2 shadow" rows="6" :placeholder="I('[[One Form ID per row\ne.g.\nabcdABCD1234-_aA\n123456789|每行一个表单ID\n例如:\nabcdABCD1234-_aA\n123456789]]')" v-model="queryInput"/>
    </div>
    <div v-for="n in state.nodes">
      <div v-if="n.data.type === 'form' && filter(n)" class="flex items-center px-1 cursor-pointer all-transition" :class="forms[n.node] ? 'bg-blue-200' : 'bg-gray-100'" @click="choose(n.node)">
        <CheckIcon v-if="forms[n.node]" class="w-4 text-blue-500" />
        <PlusIcon v-else class="w-4 text-gray-400" />
        <div class="mx-1 font-bold">{{ n.data.title }}</div>
        <div class="font-mono text-sm">{{ n.node }}</div>
      </div>
    </div>
  </div>
  <div class="w-full min-h-full p-4" v-if="info.time">
    <h3 class="font-bold flex items-center justify-between my-1">
      <input class="bg-transparent text-xl" v-model="info.title">
      <button @click="submit" class="bg-blue-500 rounded shadow all-transition hover:shadow-md px-3 py-1 text-sm text-white">{{ I('[[Save|保存]]') }}</button>
    </h3>
    <div class="flex flex-col md:flex-row w-full">
      <div class="p-3 m-2 bg-white shadow rounded grow">
        <h3 class="text-lg font-bold border-b">{{ I('[[Service Forms|服务表单]]') }}</h3>
        <div v-for="f, id in forms" class="all-transition border-b border-gray-200 hover:bg-gray-100 bg-white p-2 text-gray-700 flex">
          <div>{{ f.title }}</div>
          <div class="grow"></div>
          <CodeBracketIcon class="w-5 mx-2 rounded cursor-pointer text-green-500" @click="coding = id" />
          <XMarkIcon class="w-5 mx-2 rounded cursor-pointer text-red-500" @click="delete forms[id]"/>
        </div>
        <button class="flex items-center px-3 py-1 bg-blue-500 rounded text-white font-bold my-2" @click="showForm = true">
          <PlusIcon class="w-6 mr-1"/>
          {{ I('[[Add Form|添加表单]]') }}
        </button>
      </div>
      <div class="grow">
        <div class="p-3 m-2 bg-white shadow rounded">
          something else
        </div>
      </div>
    </div>
  </div>
</template>
