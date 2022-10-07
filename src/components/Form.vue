<script setup>
import blocks from '../blocks/index.js'
const props = defineProps(['form', 'state'])
</script>

<template>
  <div>
    <div v-for="(b, i) in props.form" class="py-2 px-4 border-t border-gray-200 relative group" :key="b">
      <Component :is="blocks[b._]?.block" :i="i" :form="props.form" :state="props.state" />
    </div>
  </div>
</template>
