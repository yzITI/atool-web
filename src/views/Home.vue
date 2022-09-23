<script setup>
import Editor from '../components/Editor.vue'
let code = $ref('')
</script>

<template>
  <h1>New Atool!</h1>
  <code>{{ code }}</code>
  <Editor v-model="code"></Editor>
</template>
