<script setup>
const props = defineProps(['i', 'form', 'state'])
let block = $computed(() => props.form[props.i])
</script>

<template>
  <label class="block my-2">
    <span class="font-bold block">Key<code class="font-normal text-xs text-gray-500 ml-2">state.{{ block.key }}</code></span>
    <input class="border font-mono rounded px-2 py-1 w-full" type="text" placeholder="textarea key" v-model="block.key">
  </label>
  <label class="block my-2">
    <span class="font-bold block">Label</span>
    <input class="border rounded px-2 py-1 w-full" type="text" placeholder="textarea label" v-model="block.label">
  </label>
  <label class="block my-2">
    <span class="font-bold block">Rows</span>
    <input class="border rounded px-2 py-1 w-full" type="number" placeholder="textarea rows" v-model="block.rows">
  </label>
  <label class="block my-2">
    <span class="font-bold block">Placeholder</span>
    <input class="border rounded px-2 py-1 w-full" type="text" placeholder="textarea placeholder" v-model="block.placeholder">
  </label>
  <label class="block my-2">
    <span class="font-bold block">Hint</span>
    <input class="border rounded px-2 py-1 w-full" type="text" placeholder="textarea hint" v-model="block.hint">
  </label>
</template>