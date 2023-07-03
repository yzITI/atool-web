<script setup>
import CodeMirror from '../components/CodeMirror.vue'
import { I } from '../utils/string.js'
const props = defineProps(['i', 'form', 'state'])
let block = $computed(() => props.form[props.i])
</script>

<template>
  <p class="text-xs text-gray-500 mb-1">{{ I('[[Allow|可通过]] ') }}<code>{{ '\{\{ var \}\}' }}</code>{{ I(' [[to access state object|来访问state变量]]') }}</p>
  <CodeMirror language="html" v-model="block.html" />
</template>
