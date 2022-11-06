<script setup>
import state from '../state.js'
import { I } from '../utils/string.js'
import Toggle from '../components/Toggle.vue'
import srpc from '../utils/srpc.js'
import Editor from '../components/Editor.vue'
import { DocumentTextIcon, Bars3Icon } from '@heroicons/vue/24/outline'
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
</script>

<template>
  <div class="w-full min-h-full p-4" v-if="info.time">
    <h3 class="font-bold flex items-center justify-between my-1">
      <input class="bg-transparent text-xl" v-model="info.title" :readonly="!editable">
      <button v-if="editable" @click="submit" class="bg-blue-500 rounded shadow all-transition hover:shadow-md px-3 py-1 text-sm text-white">{{ I('[[Save|保存]]') }}</button>
    </h3>
  </div>
</template>
