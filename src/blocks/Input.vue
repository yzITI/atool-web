<script setup>
import { I } from '../utils/string.js'
const props = defineProps(['i', 'form', 'state'])
let block = $computed(() => props.form[props.i])
</script>

<template>
  <label>
    <span>{{ I(block.label) }}</span>
    <input class="mx-2 border rounded px-2 py-1" :type="block.type" :placeholder="I(block.placeholder)" v-model="props.state[block.key]">
  </label>
  <p class="text-xs text-gray-500">{{ I(block.hint) }}</p>
</template>
