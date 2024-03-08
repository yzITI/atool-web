<script setup>
import { I } from '../utils/string.js'
const props = defineProps(['i', 'form', 'state'])
let block = $computed(() => props.form[props.i])
</script>

<template>
  <label>
    <span :class="block.multiple ? 'block' : 'inline'">{{ I(block.label) }}</span>
    <select class="border rounded text-left" :class="block.multiple ? 'overflow-auto w-full my-2' : 'mx-2 px-2 py-1'" v-model="props.state[block.key]" :multiple="block.multiple" :size="block.multiple ? block.options.length : 1">
      <option v-for="item in block.options">{{ item }}</option>
    </select>
  </label>
  <p class="text-xs text-gray-500">{{ I(block.hint) }}</p>
</template>
