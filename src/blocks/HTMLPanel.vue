<script setup>
import Editor from '../components/Editor.vue'
const props = defineProps(['i', 'form', 'state'])
let block = $computed(() => props.form[props.i])
</script>

<template>
  <Editor class="h-48" language="html" v-model="block.html" />
</template>
