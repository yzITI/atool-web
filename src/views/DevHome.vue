<script setup>
import state from '../state.js'
import srpc from '../utils/srpc.js'
import { PlusIcon, CubeIcon, CodeBracketSquareIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
const router = useRouter()

state.loading = true
if (!state.user) router.push('/')
else init()

let list = $ref([])

async function init () {
  state.loading = true
  const res = await srpc.service.getList(state.user.token)
  if (!res) Swal.fire('Error', '', 'error')
  else list = res
  state.loading = false
}

const random = () => Math.random().toString(36).substr(2, 10)

async function create () {
  state.loading = true
  const id = random() + random(), data = { title: 'New Service', description: 'This is a new service' }
  const res = await srpc.service.put(state.user.token, id, data)
  state.loading = false
  if (!res) Swal.fire('Error', '', 'error')
  data.id = id
  list.unshift(data)
}
</script>

<template>
  <div class="w-full min-h-full p-4">
    <h2 class="text-2xl font-bold mb-4 flex items-center">
      <CodeBracketSquareIcon class="w-10 mr-2" />
      Development
    </h2>
    <p v-if="!list.length" class="text-gray-500">You don't have any service now.</p>
    <div v-for="s in list" class="shadow all-transition hover:shadow-md bg-white rounded my-2 p-2 flex items-center justify-between cursor-pointer text-gray-700" @click="router.push('/dev/service/' + s.id)">
      <div class="flex items-center">
        <CubeIcon class="w-8 mx-2" />
        <div>
          <h3 class="font-bold text-lg">{{ s.title }}</h3>
          <p class="text-gray-500 text-sm">{{ s.description }}</p>
        </div>
      </div>
      <div></div>
    </div>
  </div>
  <button class="fixed right-10 bottom-10 rounded-full bg-blue-500 text-white p-3 shadow all-transition hover:shadow-md" @click="create"><PlusIcon class="w-8" /></button>
</template>
