<script setup>
import { PlayIcon } from '@heroicons/vue/24/solid'
import { I } from '../utils/string.js'
import { run } from '../utils/sandbox.js'
import Editor from '../components/Editor.vue'
const props = defineProps(['i', 'form', 'state'])
let block = $computed(() => props.form[props.i])
let running = $ref(false), error = $ref('')

async function exec () {
  if (running) return
  running = true
  error = ''
  await new Promise(r => setTimeout(r))
  const ctx = { state: props.state }
  const res = await new Promise(r => run(block.code, ctx).onReturn = r)
  running = false
  if (res instanceof Error) {
    const line = res.stack.split('\n')[1].match(/\d+?:\d+?$/)[0]
    error = `${res.message}\n  at ${line}`
  } else {
    for (const k in props.state) {
      if (typeof res.state[k] === 'undefined') delete props.state[k]
    }
    for (const k in res.state) props.state[k] = res.state[k]
  }
}
</script>

<template>
  <div class="flex items-center">
    <button class="all-transition shadow hover:shadow-md rounded px-2 py-1.5 font-bold text-white bg-yellow-500 text-sm flex items-center" @click="exec">
      <PlayIcon class="w-5 mr-1" />
      {{ running ? I('[[Running|正在执行]]') : I('[[Execute|执行代码]]') }}
    </button>
    <span class="ml-2 text-gray-500 text-xs">{{ I('[[Code will run on your device|代码将在您的设备上执行]]') }}</span>
  </div>
  <pre v-if="error" class="bg-red-50 text-red-500 px-2 py-1 text-xs my-2">{{ error }}</pre>
  <Editor v-if="block.visible" :read-only="!block.editable" class="h-56 my-2" v-model="block.code" />
</template>
