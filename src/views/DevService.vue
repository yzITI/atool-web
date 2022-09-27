<script setup>
import state from '../state.js'
import srpc from '../utils/srpc.js'
import { PlusIcon, CubeIcon, TagIcon } from '@heroicons/vue/24/outline'
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
  <div class="h-full min-w-full overflow-x-auto overflow-y-hidden" v-if="service">
    <div class="h-full w-80 p-4">
      <div>
        <h3 class="flex items-center font-bold text-lg">
          <CubeIcon class="w-8 mx-2" style="min-width: 2rem;" />
          {{ service.title }}
        </h3>
        <p class="text-gray-500 text-xs mx-2 my-1">{{ service.description }}</p>
      </div>
      <hr class="my-2">
      <div v-for="(s, i) in steps" class="shadow all-transition hover:shadow-md bg-white rounded my-2 p-2 flex items-center justify-between text-gray-700">
        <div>
          <h3 class="flex items-center font-bold text-lg">
            <TagIcon class="w-8 mx-2" style="min-width: 2rem;" />
            {{ s.title }}
          </h3>
          <p class="text-gray-500 text-xs mx-2 my-1">{{ s.description }}</p>
        </div>
        <div class="flex items-center">
        </div>
      </div>
    </div>
  </div>
</template>