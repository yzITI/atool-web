<script setup>
import state from '../state.js'
const props = defineProps(['i', 'j'])
let step = $computed(() => state.run?.steps?.[props.i])
let block = $computed(() => step?.form?.[props.j])
</script>

<template>
  <div v-html="block?.html" />
</template>

<style scoped>
div:deep() h1 { @apply text-2xl font-bold my-3; }
div:deep() h2 { @apply text-xl font-semibold my-2; }
div:deep() h3 { @apply text-lg font-semibold my-2; }
div:deep() h4, h5, h6 { @apply font-semibold my-2; }
</style>
