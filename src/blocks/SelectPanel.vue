<script setup>
import EditableList from '../components/EditableList.vue'
import { I } from '../utils/string.js'
import { PlusIcon } from '@heroicons/vue/24/outline'
const props = defineProps(['i', 'form', 'state'])
let block = $computed(() => props.form[props.i])

let newOption = $ref('')

async function create () {
  if (!newOption) return
  block.options.push(newOption)
  newOption = ''
}
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
    <span class="font-bold block">{{ I('[[Options|选项]]') }}</span>
    <div class="flex items-center">
      <input class="border rounded px-2 py-1" type="text" placeholder="input new option" v-model="newOption">
      <PlusIcon class="w-7 ml-2 cursor-pointer" :class="newOption ? 'text-blue-500' : 'text-gray-500'" @click="create" />
    </div>
    <EditableList :list="block.options" item-class="bg-gray-50 py-1 px-2 border my-2 rounded flex-nowrap">
      <template #item="{ elment: el, index: i }">      
        <input class="grow bg-transparent" v-model="block.options[i]" placeholder="点击编辑选项内容">
      </template>
    </EditableList> 
  </label>
  <label class="block my-2">
    <span class="font-bold block">{{ I('[[Hint|提示文本]]') }}</span>
    <input class="border rounded px-2 py-1 w-full" type="text" placeholder="input hint" v-model="block.hint">
  </label>
</template>
