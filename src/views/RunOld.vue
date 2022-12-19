<script setup>
import { PlayIcon, TagIcon, CubeIcon } from '@heroicons/vue/24/outline'
import state from '../state.js'
import { run } from '../utils/sandbox.js'
import srpc from '../utils/srpc.js'
import Form from '../components/Form.vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter(), route = useRoute()
const sid = route.params.id

let service = $ref({}), step = $ref(null)
let hasFcode = $computed(() => step.fcode && /\S/.test(step.fcode))

async function init () {
  state.loading = true
  const res = await srpc.run.get(state.user?.token, sid)
  state.loading = false
  if (!res) {
    await Swal.fire('Error', 'The service is not ready for run', 'error')
    router.push('/')
  }
  service = res
}
init()

async function start () {
  state.loading = true
  const ctx = await srpc.run.start(state.user?.token, sid)
  state.loading = false
  if (!ctx) return Swal.fire('Error', 'Cannot start the service', 'error')
  ctx.form = JSON.parse(ctx.form || '[]')
  ctx.state = JSON.parse(ctx.state || '{}')
  step = ctx
}

async function submit () {
  state.loading = true
  let ctx = { state: step.state }
  if (step.fcode) {
    const { isConfirmed } = await Swal.fire('warning', 'Code will be executed on your device', 'warning')
    if (!isConfirmed) return state.loading = false
    ctx = await new Promise(r => {
      const ins = run(step.fcode, ctx)
      ins.onReturn = r
    })
  }
  ctx = await srpc.run.next(state.user?.token, sid, step.step, ctx)
  state.loading = false
  if (!ctx) return Swal.fire('Error', 'Step error', 'error')
  if (!ctx.step && !ctx.err)  return Swal.fire('Completed', 'There is no next step', 'success')
  if (!ctx.step && ctx.err)  return Swal.fire('Error', ctx.err, 'error')
  ctx.form = JSON.parse(ctx.form || '[]')
  ctx.state = JSON.parse(ctx.state || '{}')
  step = ctx
}
</script>

<template>
  <div class="w-full min-h-full p-4">
    <h2 class="text-2xl font-bold flex items-center">
      <CubeIcon class="w-10 mr-2" />
      {{ service.title }}
    </h2>
    <p class="text-gray-500 text-sm mb-4">{{ service.description }}</p>
    <button v-if="!step" @click="start" class="bg-blue-500 rounded shadow all-transition hover:shadow-md px-3 py-1 ml-4 font-bold text-white flex items-center"><PlayIcon class="w-5 mr-1" />Start</button>
    <div v-else class="shadow p-4 rounded bg-white">
      <h2 class="text-lg font-bold flex items-center text-gray-800">
        <TagIcon class="w-5 mr-1" />
        {{ step.title }}
      </h2>
      <p class="text-gray-500 text-xs mb-2">{{ step.description }}</p>
      <Form :form="step.form" :state="step.state" />
      <div class="py-2 px-4 border-t border-gray-200 flex items-start justify-between">
        <div class="text-xs text-gray-500">
          <div :class="hasFcode && 'text-red-500'">{{ hasFcode ? '✓' : '✘' }} Frontend Code</div>
          <div :class="step.bcode && 'text-blue-500'">{{ step.bcode ? '✓' : '✘' }} Backend Code</div>
        </div>
        <button v-if="hasFcode || step.bcode" @click="submit" class="bg-blue-500 rounded shadow all-transition hover:shadow-md px-3 py-1 ml-4 font-bold text-white flex items-center">Submit</button>
      </div>
    </div>
  </div>
</template>
