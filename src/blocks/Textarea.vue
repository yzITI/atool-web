<script setup>
import { I } from '../utils/string.js'
const props = defineProps(['i', 'form', 'state'])
let block = $computed(() => props.form[props.i])
</script>

<template>
  <label>
    <span class="block">{{ I(block.label) }}</span>
    <p class="text-xs text-gray-500">{{ I(block.hint) }}</p>
    <textarea class="my-2 border rounded px-2 py-1 w-full" :rows="block.rows" :placeholder="I(block.placeholder)" v-model="props.state[block.key]"></textarea>
  </label>
</template>
