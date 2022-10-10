<script setup>
const props = defineProps(['i', 'form', 'state'])
let block = $computed(() => props.form[props.i])
</script>

<template>
  <label>
    <span>{{ block.label }}</span>
    <select class="mx-2 border rounded px-20 py-1" v-model="props.state[block.key]">
        <Option v-for="item in block.options" :value="item" :key="item">{{ item }}</Option>
    </select>
  </label>
  <p class="text-xs text-gray-500">{{ block.hint }}</p>
</template>