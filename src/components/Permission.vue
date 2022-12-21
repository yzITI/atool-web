<script setup>
import { watch } from 'vue'
import state from '../state.js'
import { I } from '../utils/string.js'
import Toggle from '../components/Toggle.vue'
import { PlusIcon, CubeIcon, UserIcon } from '@heroicons/vue/24/outline'
import NodeSelector from './NodeSelector.vue'
import srpc from '../utils/srpc.js'

const props = defineProps(['links', 'nid'])

let isPublic = $ref(Boolean(props.links.U))

delete props.links.U

const links = $ref(props.links)

watch($$(isPublic), async v => {
  if (v) await srpc.U.putLinkTo(state.user.token, '', props.nid, { role: 'viewer' })
  else await srpc.U.delLinkTo(state.user.token, 'U', props.nid)
})

function roleClass (role) {
  if (role === 'owner') return 'border-red-500 text-red-500'
  if (role === 'editor') return 'border-amber-500 text-amber-500'
  if (role === 'viewer') return 'border-green-600 text-green-600'
}

function displayId (id) {
  if (id[id.length - 1] === 'U') return id.substring(0, id.length - 1)
  else return id
}

function verifyOwner (id) {
  for (const k in links) {
    if (k === id) continue
    if (links[k].role === 'owner') return true
  }
  return false
}

async function changeRole (id, e) {
  const v = e.target.value
  if (v !== 'owner' && !verifyOwner(id)) {
    e.target.value = links[id].role
    return Swal.fire(I('[[At least one owner must exist|至少要有一个owner]]'), '', 'error')
  }
  if (v === '') { // delete
    await srpc.U.delLinkTo(state.user.token, id, props.nid)
    delete links[id]
    return
  }
  if (id[id.length - 1] === 'S') e.target.value = links[id].role
  const user = displayId(id)
  await srpc.U.putLinkTo(state.user.token, user, props.nid, { role: v })
  links[id].role = v
}

let showSelector = $ref(false)

async function addUser (user, name) {
  if (!links[user + 'U']) {
    await srpc.U.putLinkTo(state.user.token, user, props.nid, { role: 'viewer' })
    return links = { [user + 'U']: { role: 'viewer', name }, ...links }
  }
  const res = { [user + 'U']: links[user + 'U'] }
  for (const k in links) {
    if (k !== user + 'U') res[k] = links[k]
  }
  links = res
}
</script>

<template>
  <div class="p-3 m-2 bg-white shadow rounded">
    <h3 class="text-lg font-bold">{{ I('[[Permission|权限管理]]') }}</h3>
    <hr>
    <label class="block my-2 flex items-center">
      <span class="font-bold mr-2">{{ I('[[Public|公开]]') }}</span>
      <Toggle v-model="isPublic" />
      <p class="text-xs text-gray-500">{{ I('[[accessible by link|可通过链接访问]]') }}</p>
    </label>
    <hr>
    <div v-for="(l, id) in links" class="border-gray-200 border-b px-2 py-1 flex items-center flex-wrap justify-between">
      <div class="flex items-center flex-wrap">
        <CubeIcon v-if="l.service" class="w-6 mr-1" />
        <UserIcon v-else class="w-6 mr-1" />
        <div class="flex flex-col items-start">
          {{ l.name }}
          <code class="bg-gray-100 px-1 -mt-0.5 text-gray-500 rounded select-all" style="font-size: 0.5rem;">{{ displayId(id) }}</code>
        </div>
      </div>
      <select class="border rounded px-1 cursor-pointer" :value="l.role" @change="changeRole(id, $event)" :class="roleClass(l.role)">
        <option value="owner" v-if="!l.service">Owner</option>
        <option value="editor" v-if="!l.service || l.role === 'editor'">Editor</option>
        <option value="viewer" v-if="!l.service || l.role === 'viewer'">Viewer</option>
        <option value="">Delete</option>
      </select>
    </div>
    <NodeSelector v-model="showSelector" @select="addUser" />
    <button class="rounded shadow all-transition hover:shadow-md font-bold text-white bg-green-600 px-3 py-1 my-2 flex items-center" @click="showSelector = 'U'"><PlusIcon class="w-5 mr-1" />{{ I('[[Add User|添加用户]]') }}</button>
  </div>
</template>