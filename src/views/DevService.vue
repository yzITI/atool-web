<script setup>
import { watch } from 'vue'
import state from '../state.js'
import srpc from '../utils/srpc.js'
import blocks from '../blocks/index.js'
import Editor from '../components/Editor.vue'
import FormEditor from '../components/FormEditor.vue'
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
  for (const id in steps) steps[id].form = JSON.parse(steps[id].form || '[]')
  state.loading = false
}

async function submitService (exit = true) {
  state.loading = true
  const res = await srpc.service.put(state.user.token, sid, service)
  if (exit) state.loading = false
  if (!res) return Swal.fire('Error', '', 'error')
}

async function submitAll () {
  await submitService(false)
  for (const id in steps) await submitStep(id, false)
  state.loading = false
}

// following are step operations

let newStep = $ref(''), on = $ref('')

async function create () {
  if (!newStep || steps[newStep]) return
  const data = { title: 'Step ' + newStep, description: 'This is a new step', step: newStep, service: sid, form: [] }
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
  const res = await srpc.step.del(state.user.token, sid, id)
  state.loading = false
  if (!res) return Swal.fire('Error', '', 'error')
  delete steps[id]
  if (on === id) on = ''
}

async function submitStep (id, exit = true) {
  if (!steps[id]) return
  state.loading = true
  const s = { ...steps[id] }
  s.form = JSON.stringify(s.form || [])
  const res = await srpc.step.put(state.user.token, sid, id, s)
  if (exit) state.loading = false
  if (!res) return Swal.fire('Error', '', 'error')
}

// following are form operations

let editing = $ref(-1)
let editingType = $computed(() => {
  if (editing < 0 || !steps[on]) return false
  const b = steps[on].form[editing]
  return b?._
})

// following are for simulator

let simulator = $ref({ state: {}, json: '{}' })
watch(() => simulator.state, v => {
  simulator.json = JSON.stringify(simulator.state, null, 2)
}, { deep: true })
function updateState () {
  simulator.state = JSON.parse(simulator.json)
}
</script>

<template>
  <div class="h-full min-w-full overflow-auto flex items-start" v-if="service">
    <div class="h-full w-96 p-4 shrink-0">
      <div>
        <h3 class="flex items-center font-bold text-lg">
          <CubeIcon class="w-8 mx-2" style="min-width: 2rem;" />
          {{ service.title }}
        </h3>
        <code class="text-gray-500 text-xs mx-2 my-1">{{ sid }}</code>
      </div>
      <hr class="my-2">
      <div class="flex items-center mb-4">
        <input type="text" v-model="newStep" class="rounded border bg-white px-2 py-1" placeholder="new step id">
        <button class="p-1 mx-2 rounded-full shadow all-transition hover:shadow-md" :class="newStep && !steps[newStep] ? 'bg-blue-500' : 'bg-gray-500'" @click="create"><PlusIcon class="w-5 text-white" /></button>
        <button @click="submitAll" class="bg-blue-500 rounded shadow all-transition hover:shadow-md px-3 py-1 ml-4 text-sm font-bold text-white">Save All</button>
      </div>
      <div v-for="(s, id) in steps" class="shadow all-transition hover:shadow-md bg-white rounded my-2 p-1 text-gray-700 cursor-pointer" @click="on = id" :class="on === id && 'ring'">
        <div class="flex items-start justify-between">
          <h3 class="flex items-center font-bold font-mono">
            <TagIcon class="w-4 mx-1" style="min-width: 1rem;" />
            {{ id }}
          </h3>
          <div class="flex items-center">
            <TrashIcon class="w-4 mx-1 cursor-pointer text-red-500" @click="del(id)" />
          </div>
        </div>
        <p class="text-gray-500 text-xs mx-2">{{ s.description }}</p>
      </div>
    </div>
    <div class="w-96 shrink-0">
      <div class="p-4 bg-white m-2 shadow rounded">
        <h3 class="font-bold text-lg flex items-center justify-between">
          Edit Service
          <button @click="submitService" class="bg-blue-500 rounded shadow all-transition hover:shadow-md px-3 py-1 mb-1 text-sm text-white">Save</button>
        </h3>
        <hr>
        <label class="block my-2 text-gray-700">
          <span class="font-bold">Title</span>
          <input class="block w-full border rounded px-2 py-1" v-model="service.title">
        </label>
        <label class="block my-2 text-gray-700">
          <span class="font-bold">Description</span>
          <textarea class="block w-full border rounded px-2 py-1 text-sm" rows="2" v-model="service.description" />
        </label>
        <label class="block my-2 text-gray-700">
          <span class="font-bold">Entry</span>
          <select class="block w-full border rounded px-2 py-1 text-sm" v-model="service.entry">
            <option v-for="(s, id) in steps">{{ id }}</option>
          </select>
        </label>
        <label class="font-bold block text-gray-700">State</label>
        <p class="text-gray-500 text-xs">JSON object of service initial state</p>
        <Editor class="h-40 my-2" v-model="service.state" language="json" />
      </div>
      <div class="p-4 bg-white m-2 shadow rounded" v-if="on">
        <h3 class="font-bold text-lg flex items-center justify-between">
          <span>Edit Step <code class="bg-gray-200 px-1">{{ on }}</code></span>
          <button @click="submitStep(on)" class="bg-blue-500 rounded shadow all-transition hover:shadow-md px-3 py-1 mb-1 text-sm text-white">Save</button>
        </h3>
        <hr>
        <label class="block my-2 text-gray-700">
          <span class="font-bold">Title</span>
          <input class="block w-full border rounded px-2 py-1" v-model="steps[on].title">
        </label>
        <label class="block my-2 text-gray-700">
          <span class="font-bold">Description</span>
          <textarea class="block w-full border rounded px-2 py-1 text-sm" rows="2" v-model="steps[on].description" />
        </label>
      </div>
    </div>
    <div class="shrink-0 p-4 m-2 bg-white shadow rounded" style="width: 32rem;" v-if="steps[on]">
      <h3 class="font-bold text-lg flex items-center justify-between">
        <span>Form</span>
        <button @click="submitStep(on)" class="bg-blue-500 rounded shadow all-transition hover:shadow-md px-3 py-1 mb-1 text-sm text-white">Save</button>
      </h3>
      <FormEditor :form="steps[on].form" :state="simulator.state" @edit="i => editing = i" />
    </div>
    <div class="shrink-0 w-96" v-if="steps[on]">
      <div class="p-4 m-2 bg-white shadow rounded" v-if="editingType">
        <h3 class="text-lg font-bold">Edit Form Block</h3>
        <p class="text-xs text-gray-500 mb-2">Block type: <code>{{ editingType }}</code></p>
        <Component :is="blocks[editingType]?.panel" :i="editing" :form="steps[on].form" :state="simulator.state" />
      </div>
      <div class="p-4 m-2 bg-white shadow rounded">
        <h3 class="text-lg font-bold">Simulator</h3>
        <hr class="mb-2">
        <label class="font-bold block text-gray-700">Realtime State</label>
        <p class="text-gray-500 text-xs">JSON object of service state</p>
        <Editor class="h-40 my-2" language="json" v-model="simulator.json" />
        <button @click="updateState" class="bg-yellow-500 rounded shadow all-transition hover:shadow-md px-3 py-1 text-sm font-bold text-white">Update State</button>
      </div>
    </div>
    <div class="shrink-0" style="width: 30rem;" v-if="steps[on]">
      <div class="p-4 m-2 bg-white shadow rounded">
        <h3 class="font-bold text-lg flex items-center justify-between">
          Frontend Code
          <button @click="submitStep(on)" class="bg-blue-500 rounded shadow all-transition hover:shadow-md px-3 py-1 mb-1 text-sm text-white">Save</button>
        </h3>
        <Editor class="my-2" style="height: 35vh;" language="javascript" v-model="steps[on].fcode" />
      </div>
      <div class="p-4 m-2 bg-white shadow rounded">
        <h3 class="font-bold text-lg flex items-center justify-between">
          Backend Code
          <button @click="submitStep(on)" class="bg-blue-500 rounded shadow all-transition hover:shadow-md px-3 py-1 mb-1 text-sm text-white">Save</button>
        </h3>
        <Editor class="my-2" style="height: 35vh;" language="javascript" v-model="steps[on].bcode" />
      </div>
    </div>
    <div class="w-96 shrink-0 p-4 m-2 bg-white shadow rounded">
      <h3 class="text-lg font-bold">Service Permission</h3>
      <p class="text-gray-500 text-sm">Under development</p>
    </div>
  </div>
</template>