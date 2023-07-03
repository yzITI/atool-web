<script setup>
import { onMounted, watch } from 'vue'
import { EditorView, basicSetup } from 'codemirror'
import { html } from '@codemirror/lang-html'
import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import debounce from '../utils/debounce.js'
const props = defineProps(['modelValue', 'language', 'readOnly'])
const emits = defineEmits(['update:modelValue'])

let el = $ref(), editor = null

const update = debounce(() => {
  const v = editor?.state?.doc?.toString()
  if (v !== props.modelValue) emits('update:modelValue', v)
})
const inputListener = EditorView.updateListener.of(v => {
  if (!v.docChanged) return
  update()
})

function getLang () {
  if (props.language === 'javascript') return javascript()
  if (props.language === 'html') return html()
  return json()
}

onMounted(() => {
  editor = new EditorView({
    doc: props.modelValue || '',
    extensions: [basicSetup, getLang(), inputListener, EditorView.lineWrapping],
    parent: el
  })
})

watch(() => props.modelValue, v => {
  if (!editor) return
  if (v !== editor.state.doc.toString()) editor.dispatch({
    changes: {
      from: 0,
      to: editor.state.doc.length,
      insert: v
    }
  })
})
</script>

<template>
  <div ref="el"></div>
</template>
