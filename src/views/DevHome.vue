<script setup>
import state from '../state.js'
import srpc from '../utils/srpc.js'
import { PlusIcon, CubeIcon, SwatchIcon, CodeBracketSquareIcon, PencilSquareIcon } from '@heroicons/vue/24/outline'
import ServiceEditor from '../components/ServiceEditor.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

state.loading = true
if (!state.user) router.push('/')
else init()

let services = $ref({}), edit = $ref({})

async function init () {
  state.loading = true
  const res = await srpc.service.getAll(state.user.token)
  if (!res) Swal.fire('Error', '', 'error')
  else services = res
  state.loading = false
}

const random = () => Math.random().toString(36).substr(2, 10) + Math.random().toString(36).substr(2, 10)

async function put () {
  if (!edit.id) return
  state.loading = true
  const res = await srpc.service.put(state.user.token, edit.id, edit)
  state.loading = false
  if (!res) Swal.fire('Error', '', 'error')
  else {
    services[edit.id] = { ...edit }
    edit = {}
  }
}
</script>

<template>
  <div class="w-full min-h-full p-4">
    <h2 class="text-2xl font-bold mb-4 flex items-center">
      <CodeBracketSquareIcon class="w-10 mr-2" />
      Development
    </h2>
    <p v-if="!Object.keys(services).length" class="text-gray-500">You don't have any service now.</p>
    <div v-for="(s, id) in services" class="shadow all-transition hover:shadow-md bg-white rounded my-2 p-2 text-gray-700">
      <div class="flex items-start justify-between">
        <h3 class="flex items-center font-bold text-lg">
          <CubeIcon class="w-8 mx-2" style="min-width: 2rem;" />
          {{ s.title }}
        </h3>
        <div class="flex items-center">
          <PencilSquareIcon class="w-6 mx-1 cursor-pointer text-blue-500" @click="edit = { ...s }" />
          <SwatchIcon class="w-6 mx-1 cursor-pointer text-gray-500" @click="router.push('/dev/service/' + id)" />
        </div>
      </div>
      <p class="text-gray-500 text-xs mx-2 my-1">{{ s.description }}</p>
    </div>
  </div>
  <button class="fixed right-10 bottom-10 rounded-full bg-blue-500 text-white p-3 shadow all-transition hover:shadow-md" @click="edit = { id: random() }"><PlusIcon class="w-8" /></button>
  <ServiceEditor :service="edit" @submit="put" />
</template>
