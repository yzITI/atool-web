<script setup>
const props = defineProps(['i', 'form', 'state'])
let block = $computed(() => props.form[props.i])
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
