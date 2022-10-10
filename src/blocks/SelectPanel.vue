<script setup>
import EditableList from '../components/EditableList.vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
const props = defineProps(['i', 'form', 'state'])
let block = $computed(() => props.form[props.i])

let newOption = $ref('')

async function create () {
  console.log(newOption)
  if (!newOption || block.options[newOption]) return
  block.options[newOption] = newOption
  newOption = ''
  console.log(block.options)
}
</script>

<template>
  <label class="block my-2">
    <span class="font-bold block">Key<code class="font-normal text-xs text-gray-500 ml-2">state.{{ block.key }}</code></span>
    <input class="border font-mono rounded px-2 py-1 w-full" type="text" placeholder="select key" v-model="block.key">
  </label>
  <label class="block my-2">
    <span class="font-bold block">Label</span>
    <input class="border rounded px-2 py-1 w-full" type="text" placeholder="select label" v-model="block.label">
  </label>
  <label class="block my-2">
    <span class="font-bold block">Options</span>  
    <input class="border rounded px-2 py-1" type="text" placeholder="input new option" v-model="newOption">
    <button class="p-1 mx-2 rounded-full shadow all-transition hover:shadow-md" :class="newOption && !block.options[newOption] ? 'bg-blue-500' : 'bg-gray-500'" @click="create"><PlusIcon class="w-5 text-white" /></button>
    <EditableList :list="block.options" item-class="bg-white py-1 px-2 border my-2 rounded flex-nowrap">
    <template #item="{ elment: el, index: i }">      
        <input class="grow" v-model="block.options[i]" placeholder="点击编辑选项内容">
    </template>
    </EditableList> 
    <!-- 这边有个小问题，如果list能修改那么选项就可能是一样的，那么通过下标定位的时候会不会有bug嘞？ -->
  </label>
  <label class="block my-2">
    <span class="font-bold block">Hint</span>
    <input class="border rounded px-2 py-1 w-full" type="text" placeholder="input hint" v-model="block.hint">
  </label>
</template>
