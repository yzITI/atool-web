<script setup>
import state from '../state.js'
import { I } from '../utils/string.js'
import srpc from '../utils/srpc.js'
import Permission from '../components/Permission.vue'
import CodeMirror from '../components/CodeMirror.vue'
import { CircleStackIcon } from '@heroicons/vue/24/outline'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter(), route = useRoute()

const nid = route.params.id
let editable = $computed(() => state.nodes[nid]?.role === 'editor' || state.nodes[nid]?.role === 'owner')

state.loading = true
init()

let info = $ref({}), json = $ref('{}'), links = $ref({})

let timeStr = $computed(() => {
  if (!info.time) return ''
  return moment(info.time).format('YYYY-MM-DD HH:mm:ss')
})

function refreshLink () {
  if (state.user && state.nodes[nid] && state.nodes[nid].name !== info.name) state.nodes[nid].name = info.name
}

async function init () {
  state.loading = true
  const res = await srpc.D.get(state.user?.token || '', nid)
  if (!res) {
    await Swal.fire(I('[[Error|错误]]'), I('[[Data not found or permission denied|数据未找到或权限不足]]'), 'error')
    return router.push('/')
  }
  links = await srpc.U.getLinkFrom(state.user?.token || '', nid)
  state.loading = false
  info = { name: res.name, time: res.time }
  delete res.name
  delete res.time
  delete res.id
  const data = {}
  for (const k in res) {
    try { data[k] = JSON.parse(res[k]) }
    catch { data[k] = res[k] }
  }
  json = JSON.stringify(data, null, 2)
  refreshLink()
}

async function submit () {
  if (!state.user?.token) return
  let data = {}
  try { data = JSON.parse(json) }
  catch {
    Swal.fire(I('[[Syntax Error|语法错误]]'), '', 'error')
    return
  }
  for (const k in data) {
    if (typeof data[k] === 'object') data[k] = JSON.stringify(data[k])
  }
  data.name = info.name
  state.loading = true
  const res = await srpc.D.put(state.user.token, nid, data)
  state.loading = false
  if (!res) return Swal.fire(I('[[Error|错误]]'), I('[[Fail to save|保存失败]]'), 'error')
  refreshLink()
  Swal.fire(I('[[Success|保存成功]]'), '', 'success')
}
</script>

<template>
  <div class="w-full h-full p-4 flex flex-col" v-if="info.time">
    <h3 class="font-bold flex items-center justify-between my-1">
      <input class="bg-transparent text-xl" v-model="info.name">
      <button v-if="editable" @click="submit" class="bg-blue-500 rounded shadow all-transition hover:shadow-md px-3 py-1 text-sm text-white">{{ I('[[Save|保存]]') }}</button>
    </h3>
    <div class="flex flex-col md:flex-row w-full md:items-start grow">
      <div class="m-2 p-3 grow h-full bg-white shadow rounded" style="height: calc(100% - 0.6rem);">
        <div class="h-full">
          <CodeMirror v-model="json" language="json" class="h-full" />
        </div>
      </div>
      <div class="md:w-96 xl:w-1/3" v-if="links">
        <Permission :links="links" :nid="nid" />
      </div>
    </div>
  </div>
</template>
