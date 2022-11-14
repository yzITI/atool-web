<script setup>
import state from '../state.js'
import { I } from '../utils/string.js'
import Toggle from '../components/Toggle.vue'
import srpc from '../utils/srpc.js'
import Editor from '../components/Editor.vue'
import { DocumentTextIcon, Bars3Icon, PencilSquareIcon, ArrowDownTrayIcon, ArrowUpTrayIcon, CodeBracketIcon } from '@heroicons/vue/24/outline'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter(), route = useRoute()

const nid = route.params.id
let editable = $computed(() => state.nodes[nid]?.role === 'editor' || state.nodes[nid]?.role === 'owner')

init()

let info = $ref({}), form = $ref([]), codes = $ref({})

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

async function init () {
  state.loading = true
  const res = await srpc.node.get(state.user?.token || '', nid)
  if (!res) {
    await Swal.fire(I('[[Error|错误]]'), I('[[Service not found or permission denied|服务未找到或权限不足]]'), 'error')
    return router.push('/')
  }
  state.loading = false
  info = { title: res.title, time: res.time, public: res.public }
  form = JSON.parse(res.form || '[]')
  for (const f of form) {
    if (res[f]) codes[f] = res[f]
  }
  refreshLink()
}

async function submit () {
  if (!state.user?.token) return
  const data = { title: info.title, public: info.public, type: 'service', form: JSON.stringify(form) }
  for (const f of form) {
    if (codes[f]) data[f] = codes[f]
  }
  state.loading = true
  const res = await srpc.node.put(state.user.token, nid, data)
  state.loading = false
  if (!res) return Swal.fire(I('[[Error|错误]]'), I('[[Fail to save|保存失败]]'), 'error')
  refreshLink()
  Swal.fire(I('[[Success|保存成功]]'), '', 'success')
}

let showPanel = $ref(true)

let forms = $ref(['haha', 'test', 'longlonglonglonglonglonglonglong'])
let showCode = $ref(false)
</script>

<template>
  <Transition name="fade">
    <div class="fixed top-0 left-0 w-screen h-screen bg-black opacity-50" v-if="showCode" @click="showCode = false" />
  </Transition>
  <div class="all-transition fixed w-11/12 md:w-2/3 bg-white h-screen" :class="showCode ? 'right-0' : '-right-full'">
    
  </div>
  <div class="w-full min-h-full p-4" v-if="info.time">
    <h3 class="font-bold flex items-center justify-between my-1">
      <input class="bg-transparent text-xl" v-model="info.title" :readonly="!editable">
      <button v-if="editable" @click="submit" class="bg-blue-500 rounded shadow all-transition hover:shadow-md px-3 py-1 text-sm text-white">{{ I('[[Save|保存]]') }}</button>
    </h3>
    <div class="md:flex w-full">
      <div class="p-3 m-2 bg-white shadow rounded w-full md:w-2/3">
        <div v-for="f in forms" class="all-transition first:border-t border-b border-gray-200 hover:bg-gray-100 bg-white p-2 text-gray-700 flex">
          <div>{{ f }}</div>
          <div class="grow"></div>
          <ArrowUpTrayIcon class="w-4 mx-2 cursor-pointer text-red-500" />
        </div>
        <button class="flex items-center px-3 py-1 bg-blue-500 rounded text-white font-bold my-2">
          <ArrowDownTrayIcon class="w-4 mr-2"/>
          {{ I('[[Import|装载]]') }}
        </button>
      </div>
      <div class="w-full md:w-1/3">
        <div class="p-3 m-2 bg-white shadow rounded flex items-center justify-center hover:bg-gray-200 font-mono text-gray-500 cursor-pointer" @click="showCode = true">
          <CodeBracketIcon class="w-6 mx-2" />
          {{ I('[[Show Code|查看代码]]') }}
        </div>
        <div class="p-3 m-2 bg-white shadow rounded">
          something else
        </div>
      </div>
    </div>
  </div>
</template>
