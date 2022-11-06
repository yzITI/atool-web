<script setup>
import state from '../state.js'
import srpc from '../utils/srpc.js'
import { I } from '../utils/string.js'
import { PlusIcon, HomeIcon, CubeIcon, SquaresPlusIcon, CircleStackIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
const router = useRouter()

if (!state.user) router.push('/')
else init()

const random = () => Math.random().toString(36).substr(2, 10) + Math.random().toString(36).substr(2, 10)

let catalog = $ref({
  form: [], data: [], service: []
})
let on = $ref('form')

function refreshCatalog () {
  for (const k in catalog) catalog[k] = []
  for (const k in state.nodes) {
    const n = state.nodes[k]
    catalog[n.data.type].push(n)
  }
}

async function init () {
  state.loading = true
  const res = await srpc.node.getAll(state.user.token)
  state.loading = false
  if (!res) return Swal.fire('Error', '', 'error')
  state.nodes = {}
  for (const k in res) {
    res[k].data = JSON.parse(res[k].data)
    state.nodes[res[k].node] = res[k]
  }
  refreshCatalog()
}

const newTitle = {
  form: '[[New Form|新建表单]]',
  data: '[[New Data|新建数据]]',
  service: '[[New Service|新建服务]]'
}

async function create () {
  const id = await random()
  state.loading = true
  const res = await srpc.node.put(state.user.token, id, { title: I(newTitle[on]), type: on })
  if (res) return router.push(`/${on}/${id}`)
  Swal.fire('Error', '', 'error')
  state.loading = false
}

async function del (id) {
  const { isConfirmed } = await Swal.fire({
    title: I('[[Dangerous Operation|危险操作]]'),
    html: I(`[[You are deleting node|您正在删除实例]]<br>${state.nodes[id].data.title}(<code>${id}</code>)<br><b>[[All data and permissions will be deleted|所有相关数据和权限都将被删除]]</b>`),
    showCancelButton: true,
    confirmButtonColor: 'red',
    icon: 'warning'
  })
  if (!isConfirmed) return
  state.loading = true
  const res = await srpc.node.del(state.user.token, id)
  state.loading = false
  if (!res) return Swal.fire('Error', '', 'error')
  delete state.nodes[id]
  refreshCatalog()
}
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <h2 class="text-2xl font-bold m-4 flex items-center">
      <HomeIcon class="w-10 mr-2" />
      {{ I('[[My nodes|我的实例]]') }}
    </h2>
    <div class="flex items-start font-bold text-gray-700 px-4 relative">
      <div class="rounded-t-lg all-transition bg-white px-3 py-1 cursor-pointer shadow flex items-center" :class="on === 'form' && 'bg-blue-500 text-white'" @click="on = 'form'"><SquaresPlusIcon class="w-5 mr-1" /> {{ I('[[Form|表单]]') }}</div>
      <div class="rounded-t-lg all-transition bg-white px-3 py-1 cursor-pointer shadow flex items-center" :class="on === 'data' && 'bg-blue-500 text-white'" @click="on = 'data'"><CircleStackIcon class="w-5 mr-1" />{{ I('[[Data|数据]]') }}</div>
      <div class="rounded-t-lg all-transition bg-white px-3 py-1 cursor-pointer shadow flex items-center" :class="on === 'service' && 'bg-blue-500 text-white'" @click="on = 'service'"><CubeIcon class="w-5 mr-1" />{{ I('[[Service|服务]]') }}</div>
    </div>
    <div class="grow bg-white z-10 relative p-4 overflow-y-auto">
      <p v-if="!catalog[on].length" class="text-gray-500 text-sm">{{ I('[[You don\'t have any node now.|您还没有实例，创建一个吧？]]') }}</p>
      <div v-for="n in catalog[on]" class="all-transition first:border-t border-b border-gray-200 hover:bg-gray-100 bg-white p-2 text-gray-700 cursor-pointer" @click="router.push(`/${n.data.type}/${n.node}`)">
        <div class="flex items-center justify-between">
          <h3>{{ n.data.title }}</h3>
          <TrashIcon v-if="n.role === 'owner'" class="w-5 mx-1 text-red-500 cursor-pointer shrink-0" @click.stop="del(n.node)" />
        </div>
      </div>
    </div>
  </div>
  <button class="fixed right-10 bottom-10 rounded-full bg-blue-500 text-white p-3 shadow all-transition hover:shadow-md z-10" @click="create"><PlusIcon class="w-8" /></button>
</template>
