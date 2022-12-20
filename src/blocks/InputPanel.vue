<script setup>
const props = defineProps(['i', 'form', 'state'])
import { I } from '../utils/string.js'
let block = $computed(() => props.form[props.i])
const types = ['checkbox', 'color', 'date', 'datetime-local', 'email', 'image', 'month', 'number', 'password', 'radio', 'range', 'tel', 'text', 'time', 'url', 'week']
</script>

<template>
  <label class="block my-2">
    <span class="font-bold block">Key<code class="font-normal text-xs text-gray-500 ml-2">state.{{ block.key }}</code></span>
    <input class="border font-mono rounded px-2 py-1 w-full" type="text" placeholder="input key" v-model="block.key">
  </label>
  <label class="block my-2">
    <span class="font-bold block">{{ I('[[Label|标签]]') }}</span>
    <input class="border rounded px-2 py-1 w-full" type="text" placeholder="input label" v-model="block.label">
  </label>
  <label class="block my-2">
    <span class="font-bold block">{{ I('[[Type|类型]]') }}</span>
    <select class="border rounded px-2 py-1 w-full" v-model="block.type">
      <option v-for="t in types">{{ t }}</option>
    </select>
  </label>
  <label class="block my-2">
    <span class="font-bold block">{{ I('[[Placeholder|占位文本]]') }}</span>
    <input class="border rounded px-2 py-1 w-full" type="text" placeholder="input placeholder" v-model="block.placeholder">
  </label>
  <label class="block my-2">
    <span class="font-bold block">{{ I('[[Hint|提示文本]]') }}</span>
    <input class="border rounded px-2 py-1 w-full" type="text" placeholder="input hint" v-model="block.hint">
  </label>
</template>
