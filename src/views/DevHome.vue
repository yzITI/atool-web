<script setup>
import state from '../state.js'
import srpc from '../utils/srpc.js'
import { PlusIcon, CodeBracketSquareIcon, CubeIcon, TrashIcon } from '@heroicons/vue/24/outline'
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

async function create () {
  const id = random()
  state.loading = true
  const data = { title: 'New Service', description: 'This is a new service', state: '{}' }
  const res = await srpc.service.put(state.user.token, id, data)
  state.loading = false
  if (!res) return Swal.fire('Error', '', 'error')
  data.id = id
  services[id] = data
}

async function del (id) {
  const { isConfirmed } = await Swal.fire({
    title: 'Dangerous Operation',
    html: `You are deleting service<br><code>${id}</code><br><b>All steps and permissions will be deleted.</b>`,
    showCancelButton: true,
    confirmButtonColor: 'red',
    icon: 'warning'
  })
  if (!isConfirmed) return
  state.loading = true
  const res = await srpc.service.del(state.user.token, id)
  state.loading = false
  if (!res) return Swal.fire('Error', '', 'error')
  delete services[id]
}
</script>

<template>
  <div class="w-full min-h-full p-4">
    <h2 class="text-2xl font-bold mb-4 flex items-center">
      <CodeBracketSquareIcon class="w-10 mr-2" />
      Development
    </h2>
    <p v-if="!Object.keys(services).length" class="text-gray-500">You don't have any service now.</p>
    <div v-for="(s, id) in services" class="shadow all-transition hover:shadow-md bg-white rounded my-2 p-2 text-gray-700 cursor-pointer" @click="router.push('/dev/service/' + id)">
      <div class="flex items-start justify-between">
        <h3 class="flex items-center font-bold text-lg">
          <CubeIcon class="w-8 mx-2" style="min-width: 2rem;" />
          {{ s.title }}
        </h3>
        <div class="flex items-center">
          <TrashIcon class="w-5 mx-1 text-red-500 cursor-pointer" @click.stop="del(id)" />
        </div>
      </div>
      <p class="text-gray-500 text-xs mx-2 my-1">{{ s.description }}</p>
    </div>
  </div>
  <button class="fixed right-10 bottom-10 rounded-full bg-blue-500 text-white p-3 shadow all-transition hover:shadow-md" @click="create"><PlusIcon class="w-8" /></button>
</template>
