<script setup>
import monaco from '../utils/editorWorker.js'
import debounce from '../utils/debounce.js'
import { onMounted, onUnmounted, watch } from 'vue'
const props = defineProps(['modelValue', 'language'])
const emits = defineEmits(['update:modelValue'])

let editorEl = $ref(), editor = null

watch(() => props.modelValue, v => {
  if (!editor) return
  if (v !== editor.getValue()) editor.setValue(v)
})

onMounted(() => {
  editor = monaco.editor.create(editorEl, {
    value: props.modelValue || '',
    language: props.language || 'javascript',
    theme: 'vs-dark',
    lineNumbersMinChars: 2,
    tabSize: 2
  })
  editor.onDidChangeModelContent = debounce(() => {
    const v = editor.getValue()
    if (v !== props.modelValue) emits('update:modelValue', v)
  })
})

onUnmounted(() => {
  if (editor) editor.dispose()
})
</script>

<template>
  <div class="h-96" ref="editorEl"></div>
</template>
