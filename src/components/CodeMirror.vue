<script setup>
import { onMounted, watch } from 'vue'
import { EditorView, basicSetup } from 'codemirror'
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

async function getLang () {
  if (props.language === 'javascript') return (await import('@codemirror/lang-javascript')).javascript()
  if (props.language === 'html') return (await import('@codemirror/lang-html')).html()
  if (props.language === 'json') return (await import('@codemirror/lang-json')).json()
}

onMounted(async () => {
  editor = new EditorView({
    doc: props.modelValue || '',
    extensions: [basicSetup, await getLang(), inputListener, EditorView.lineWrapping],
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
