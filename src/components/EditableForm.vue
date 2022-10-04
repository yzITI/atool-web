<script setup>
import { onMounted } from 'vue'
import Sortable from 'sortablejs/modular/sortable.core.esm.js'
import { TrashIcon, Bars2Icon } from '@heroicons/vue/24/outline'
import blocks from '../blocks/index.js'
const props = defineProps(['form', 'state'])
let el = $ref()
onMounted(() => new Sortable(el, {
  handle: '.handle', animation: 150,
  onUpdate: e => props.form.splice(e.newIndex, 0, props.form.splice(e.oldIndex, 1)[0])
}))
</script>

<template>
  <div ref="el">
    <div v-for="(b, i) in props.form" class="py-2 px-4 border-t border-gray-200 relative group" :key="b">
      <component :is="blocks[b.type]?.block" :i="i" :form="props.form" :state="props.state" />
      <div class="absolute right-1 top-2 flex items-center all-transition opacity-0 group-hover:opacity-100">
        <TrashIcon class="w-4 mx-2 cursor-pointer text-red-500" @click="props.form.splice(i, 1)"/>
        <Bars2Icon class="w-4 cursor-pointer handle text-gray-500" />
      </div>
    </div>
  </div>
</template>
