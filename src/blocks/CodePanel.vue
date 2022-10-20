<script setup>
import { I } from '../utils/string.js'
import Toggle from '../components/Toggle.vue'
const props = defineProps(['i', 'form', 'state'])
let block = $computed(() => props.form[props.i])
</script>

<template>
  <label class="block my-2 flex items-center">
    <span class="font-bold mr-2">{{ I('[[Code visible|代码可见]]') }}</span>
    <Toggle v-model="block.visible" />
  </label>
  <label class="block my-2 flex items-center">
    <span class="font-bold mr-2">{{ I('[[Code editable|代码可编辑]]') }}</span>
    <Toggle v-model="block.editable" />
  </label>
</template>
