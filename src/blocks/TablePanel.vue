<script setup>
import EditableList from '../components/EditableList.vue'
import { I } from '../utils/string.js'
import { PlusIcon } from '@heroicons/vue/24/outline'
const props = defineProps(['i', 'form', 'state'])
let block = $computed(() => props.form[props.i])
</script>

<template>
  <label class="block my-2">
    <span class="font-bold block">Key<code class="font-normal text-xs text-gray-500 ml-2">state.{{ block.key }}</code></span>
    <input class="border font-mono rounded px-2 py-1 w-full" type="text" placeholder="select key" v-model="block.key">
  </label>
  <label class="block my-2">
    <span class="font-bold block">{{ I('[[Label|标签]]') }}</span>
    <input class="border rounded px-2 py-1 w-full" type="text" placeholder="select label" v-model="block.label">
  </label>
  <label class="block my-2">
    <span class="font-bold inline-block">{{ I('[[Columns|表头字段]]') }}</span>
    <PlusIcon class="inline w-5 ml-2 cursor-pointer text-green-500" @click="block.columns.push({ key: '', label: '' })" />
    <EditableList :list="block.columns" item-class="bg-gray-50 py-1 px-2 border my-2 rounded flex-nowrap">
      <template #item="{ elment: el, index: i }">      
        <input class="grow bg-transparent font-mono" v-model="block.columns[i].key" placeholder="key">
        <input class="grow bg-transparent" v-model="block.columns[i].label" placeholder="Label">
      </template>
    </EditableList> 
  </label>
</template>
