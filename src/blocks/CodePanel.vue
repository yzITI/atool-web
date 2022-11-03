<script setup>
import { watch, nextTick } from 'vue'
import { I } from '../utils/string.js'
import Toggle from '../components/Toggle.vue'
const props = defineProps(['i', 'form', 'state'])
let block = $computed(() => props.form[props.i])

watch(() => block.height, async v => {
  await nextTick()
  window.onresize()
})
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
  <label class="block my-2">
    <span class="font-bold">{{ I('[[Height|显示高度]]') }}:</span>
    <input class="border rounded px-2 py-1 ml-2 w-24" type="text" placeholder="(default in px)" v-model="block.height">
  </label>
</template>
