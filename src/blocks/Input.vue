<script setup>
const props = defineProps(['i', 'form', 'state'])
let block = $computed(() => props.form[props.i])
</script>

<template>
  <label>
    <span>{{ block.label }}</span>
    <input class="mx-2 border rounded px-2 py-1" :type="block.type" :placeholder="block.placeholder" v-model="props.state[block.key]">
  </label>
  <p class="text-xs text-gray-500">{{ block.hint }}</p>
</template>
