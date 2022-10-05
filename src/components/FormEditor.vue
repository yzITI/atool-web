<script setup>
import { onMounted } from 'vue'
import Sortable from 'sortablejs/modular/sortable.core.esm.js'
import { PencilSquareIcon, TrashIcon, Bars2Icon } from '@heroicons/vue/24/outline'
import blocks from '../blocks/index.js'
const props = defineProps(['form', 'state'])
const emits = defineEmits(['edit'])
let el = $ref(), editing = $ref(-1)
onMounted(() => new Sortable(el, {
  handle: '.handle', animation: 150,
  onUpdate: e => {
    if (editing === e.oldIndex) edit(e.newIndex)
    props.form.splice(e.newIndex, 0, props.form.splice(e.oldIndex, 1)[0])
  }
}))

function del (i) {
  if (editing === i) editing = -1
  props.form.splice(i, 1)
}

function edit (i) {
  editing = i
  emits('edit', i)
}

function create (b, type) {
  props.form.push({ ...b.template, type })
  edit(props.form.length - 1)
}
</script>

<template>
  <div ref="el">
    <div v-for="(b, i) in props.form" class="py-2 px-4 border-t border-gray-200 relative group" :key="b">
      <Component :is="blocks[b.type]?.block" :i="i" :form="props.form" :state="props.state" />
      <div class="absolute right-1 top-2 flex items-center all-transition opacity-0 group-hover:opacity-100" :class="editing === i && 'opacity-100'">
        <PencilSquareIcon class="w-4 mx-2 cursor-pointer" :class="editing === i ? 'text-blue-500' : 'text-gray-500'" @click="edit(i)" />
        <Bars2Icon class="w-4 cursor-pointer handle text-gray-500" />
        <TrashIcon class="w-4 mx-2 cursor-pointer text-red-500" @click="del(i)"/>
      </div>
    </div>
  </div>
  <div class="p-4 border-t border-gray-200 flex items-start flex-wrap">
    <button v-for="(b, type) in blocks" class="rounded-full px-4 py-1 border bg-gray-100 all-transition hover:bg-gray-200 font-bold" @click="create(b, type)">+ {{ b.name }}</button>
  </div>
</template>
