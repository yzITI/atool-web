<script setup>
import Editor from '../components/Editor.vue'
const props = defineProps(['i', 'form', 'state'])
let block = $computed(() => props.form[props.i])
</script>

<template>
  <p class="text-xs text-gray-500 mb-1">Allow <code>{{ '\{\{ var \}\}' }}</code> to access state object</p>
  <Editor class="h-40" language="html" v-model="block.html" />
</template>
