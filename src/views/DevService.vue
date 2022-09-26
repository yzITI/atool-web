<script setup>
import state from '../state.js'
import srpc from '../utils/srpc.js'
import { PlusIcon, CubeTransparentIcon } from '@heroicons/vue/24/outline'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter(), route = useRoute()
const id = route.params.id

state.loading = true
if (!state.user) router.push('/')
else init()

let service = $ref(null), steps = $ref([])

async function init () {
  state.loading = true
  const res = await srpc.service.get(state.user.token, id)
  if (!res) Swal.fire('Error', '', 'error')
  else service = res
  const res2 = await srpc.step.getList(state.user.token, id)
  if (!res2) Swal.fire('Error', '', 'error')
  else steps = res2
  state.loading = false
  console.log(res, res2)
}
</script>

<template>
  <div class="w-full min-h-full p-4" v-if="service">
    <h2 class="text-2xl font-bold flex items-center">
      <CubeTransparentIcon class="w-10 mr-2" />
      <input v-model="service.title" class="bg-transparent appearance-none grow">
    </h2>
    <input v-model="service.description" class="text-gray-500 ml-2 my-1 bg-transparent appearance-none w-full">
    <hr class="my-2">
  </div>
</template>