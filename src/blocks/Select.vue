<script setup>
const props = defineProps(['i', 'form', 'state'])
let block = $computed(() => props.form[props.i])
</script>

<template>
  <label>
    <span>{{ block.label }}</span>
    <select class="mx-2 border rounded px-2 py-1 text-left" v-model="props.state[block.key]">
      <option v-for="item in block.options">{{ item }}</option>
    </select>
  </label>
  <p class="text-xs text-gray-500">{{ block.hint }}</p>
</template>