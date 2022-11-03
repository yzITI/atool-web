<script setup>
import state from '../state.js'
import srpc from '../utils/srpc.js'
import { I } from '../utils/string.js'
import { PlusIcon, HomeIcon, CubeIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
const router = useRouter()

if (!state.user) router.push('/')
else init()

const random = () => Math.random().toString(36).substr(2, 10) + Math.random().toString(36).substr(2, 10)

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
}

async function create () {
  const id = await random()
  state.loading = true
  const res = await srpc.node.put(state.user.token, id, { title: I('[[New Form|新建表单]]'), type: 'form' })
  if (res) return router.push('/form/' + id)
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
}
</script>

<template>
  <div class="w-full min-h-full p-4">
    <h2 class="text-2xl font-bold mb-4 flex items-center">
      <HomeIcon class="w-10 mr-2" />
      {{ I('[[My nodes|我的实例]]') }}
    </h2>
    <p v-if="!Object.keys(state.nodes).length" class="text-gray-500">{{ I('[[You don\'t have any service now.|您还没有实例，创建一个吧？]]') }}</p>
    <div v-for="n in state.nodes" class="all-transition border hover:shadow bg-white rounded my-2 p-2 text-gray-700 cursor-pointer" @click="router.push('/form/' + n.node)">
      <div class="flex items-center justify-between">
        <h3 class="flex items-center font-bold text-lg">
          <CubeIcon class="w-8 mx-2" style="min-width: 2rem;" />
          {{ n.data.title }}
        </h3>
        <TrashIcon v-if="n.role === 'owner'" class="w-5 mx-1 text-red-500 cursor-pointer" @click.stop="del(n.node)" />
      </div>
    </div>
  </div>
  <button class="fixed right-10 bottom-10 rounded-full bg-blue-500 text-white p-3 shadow all-transition hover:shadow-md" @click="create"><PlusIcon class="w-8" /></button>
</template>
