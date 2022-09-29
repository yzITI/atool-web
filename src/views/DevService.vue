<script setup>
import state from '../state.js'
import srpc from '../utils/srpc.js'
import { PlusIcon, CubeIcon, TagIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter(), route = useRoute()
const sid = route.params.id

state.loading = true
if (!state.user) router.push('/')
else init()

let service = $ref(null), steps = $ref({})

async function init () {
  state.loading = true
  const res = await srpc.service.get(state.user.token, sid)
  if (!res) Swal.fire('Error', '', 'error')
  else service = res
  const res2 = await srpc.step.getAll(state.user.token, sid)
  if (!res2) Swal.fire('Error', '', 'error')
  else steps = res2
  state.loading = false
}

let newStep = $ref(''), on = $ref('')

async function create () {
  if (!newStep || steps[newStep]) return
  state.loading = true
  const data = { title: 'Step ' + newStep, description: 'This is a new step' }
  const res = await srpc.step.put(state.user.token, sid, newStep, data)
  state.loading = false
  if (!res) return Swal.fire('Error', '', 'error')
  data.step = newStep
  data.service = sid
  steps[newStep] = data
  newStep = ''
}

async function del (id) {
  const { isConfirmed } = await Swal.fire({
    title: 'Dangerous Operation',
    html: `Are you sure to delete step <code>${id}</code> ?`,
    showCancelButton: true,
    confirmButtonColor: 'red',
    icon: 'warning'
  })
  if (!isConfirmed) return
  state.loading = true
  const res = await srpc.step.del(state.user.token, sid, newStep)
  state.loading = false
  if (!res) return Swal.fire('Error', '', 'error')
  delete steps[id]
  if (on === id) on = ''
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
      <p class="text-xs text-gray-500">Type in step id to create a new step</p>
      <div class="flex items-center mb-4">
        <input type="text" v-model="newStep" class="rounded border bg-white px-2 py-1" placeholder="new step id">
        <PlusIcon class="w-6 mx-2 text-blue-500 cursor-pointer" v-if="newStep && !steps[newStep]" @click="create" />
      </div>
      <div v-for="(s, id) in steps" class="shadow all-transition hover:shadow-md bg-white rounded my-2 p-1 text-gray-700 cursor-pointer" @click="on = id" :class="on === id && 'ring'">
        <div class="flex items-start justify-between">
          <h3 class="flex items-center font-bold font-mono">
            <TagIcon class="w-6 mx-2" style="min-width: 1.5rem;" />
            {{ id }}
          </h3>
          <div class="flex items-center">
            <TrashIcon class="w-4 mx-1 cursor-pointer text-red-500" @click="del(id)" />
          </div>
        </div>
        <p class="text-gray-500 text-xs mx-2 my-1">{{ s.description }}</p>
      </div>
    </div>
  </div>
</template>