<script setup>
import state from '../state.js'
import srpc from '../utils/srpc.js'
import { I } from '../utils/string.js'
import { PlusIcon, HomeIcon, CubeIcon, SquaresPlusIcon, CircleStackIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
const router = useRouter()

state.loading = true
if (!state.user) router.push('/')
else init()

const random = () => Math.random().toString(36).substr(2, 8) + Math.random().toString(36).substr(2, 7)

let catalog = $ref({ F: {}, D: {}, S: {} })
let on = $ref('F')

function refreshCatalog () {
  for (const k in catalog) catalog[k] = {}
  for (const k in state.nodes) {
    const n = state.nodes[k]
    catalog[k[k.length - 1]][k] = n
  }
}

async function init () {
  state.loading = true
  const res = await srpc.U.getLinkTo(state.user.token)
  state.loading = false
  if (!res) return Swal.fire('Error', '', 'error')
  state.nodes = res
  refreshCatalog()
}

const newTitle = {
  F: '[[New Form|新建表单]]',
  D: '[[New Data|新建数据]]',
  S: '[[New Service|新建服务]]'
}

async function create () {
  const id = await random() + on
  state.loading = true
  const res = await srpc[on].put(state.user.token, id, { name: I(newTitle[on]) })
  if (res) return router.push(`/${on}/${id}`)
  Swal.fire('Error', '', 'error')
  state.loading = false
}

async function del (id) {
  console.log(id, state.nodes[id])
  const { isConfirmed } = await Swal.fire({
    title: I('[[Dangerous Operation|危险操作]]'),
    html: I(`[[You are deleting node|您正在删除实例]]<br>${state.nodes[id].name}(<code>${id}</code>)<br><b>[[All data and permissions will be deleted|所有相关数据和权限都将被删除]]</b>`),
    showCancelButton: true,
    confirmButtonColor: 'red',
    icon: 'warning'
  })
  if (!isConfirmed) return
  state.loading = true
  const res = await srpc.U.delNode(state.user.token, id)
  state.loading = false
  if (!res) return Swal.fire('Error', '', 'error')
  delete state.nodes[id]
  refreshCatalog()
}
</script>

<template>
  <div class="w-full h-full flex flex-col" v-if="!state.loading">
    <h2 class="text-2xl font-bold m-4 flex items-center">
      <HomeIcon class="w-10 mr-2" />
      {{ I('[[My nodes|我的实例]]') }}
    </h2>
    <div class="flex items-start font-bold text-gray-700 px-4 relative">
      <div class="rounded-t-lg all-transition bg-white px-3 py-1 cursor-pointer shadow flex items-center" :class="on === 'F' && 'bg-blue-500 text-white'" @click="on = 'F'"><SquaresPlusIcon class="w-5 mr-1" /> {{ I('[[Form|表单]]') }}</div>
      <!--
      <div class="rounded-t-lg all-transition bg-white px-3 py-1 cursor-pointer shadow flex items-center" :class="on === 'D' && 'bg-blue-500 text-white'" @click="on = 'D'"><CircleStackIcon class="w-5 mr-1" />{{ I('[[Data|数据]]') }}</div>
      -->
      <div class="rounded-t-lg all-transition bg-white px-3 py-1 cursor-pointer shadow flex items-center" :class="on === 'S' && 'bg-blue-500 text-white'" @click="on = 'S'"><CubeIcon class="w-5 mr-1" />{{ I('[[Service|服务]]') }}</div>
    </div>
    <div class="grow bg-white z-10 relative p-4 overflow-y-auto">
      <p v-if="!Object.keys(catalog[on]).length" class="text-gray-500 text-sm">{{ I('[[You don\'t have any node now.|您还没有实例，创建一个吧？]]') }}</p>
      <div v-for="(n, id) in catalog[on]" class="all-transition first:border-t border-b border-gray-200 hover:bg-gray-100 bg-white p-2 text-gray-700 cursor-pointer" @click="router.push(`/${id[id.length - 1]}/${id}`)">
        <div class="flex items-center justify-between">
          <div class="flex items-center flex-wrap">
            <h3>{{ n.name }}</h3>
            <code class="ml-1 px-1 text-gray-400 bg-gray-100" style="font-size: 0.65rem;">{{ id }}</code>
          </div>
          <TrashIcon v-if="n.role === 'owner'" class="w-5 mx-1 text-red-500 cursor-pointer shrink-0" @click.stop="del(id)" />
        </div>
      </div>
    </div>
  </div>
  <button class="fixed right-10 bottom-10 rounded-full bg-blue-500 text-white p-3 shadow all-transition hover:shadow-md z-10" @click="create"><PlusIcon class="w-8" /></button>
</template>
