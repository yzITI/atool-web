<script setup>
import { PlayIcon } from '@heroicons/vue/24/solid'
import { I } from '../utils/string.js'
import { run } from '../utils/sandbox.js'
import CodeMirror from '../components/CodeMirror.vue'
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
    <button class="all-transition border border-orange-500 bg-orange-100 text-orange-500 hover:text-white hover:bg-orange-500 rounded px-2 py-1.5 font-bold text-sm flex items-center" @click="exec">
      <PlayIcon class="w-5 mr-1" />
      {{ running ? I('[[Running|正在执行]]') : I('[[Execute|执行代码]]') }}
    </button>
    <span class="ml-2 text-gray-500 text-xs">{{ I('[[Code will run on your device|代码将在您的设备上执行]]') }}</span>
  </div>
  <pre v-if="error" class="bg-red-50 text-red-500 px-2 py-1 text-xs my-2">{{ error }}</pre>
  <CodeMirror v-if="block.visible" :read-only="!block.editable" language="javascript" class="my-2 overflow-auto" :style="{ height: block.height || 'auto' }" v-model="block.code" />
</template>
