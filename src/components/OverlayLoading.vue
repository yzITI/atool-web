<script setup>
const { show, absolute } = defineProps(['show', 'absolute'])
import loading from '../assets/loading.svg'
</script>

<template>
  <Transition name="fade">
    <div class="z-50 bg-gray-100 flex flex-col justify-center items-center top-0 right-0 bottom-0 left-0" :class="absolute ? 'absolute ' : 'fixed'" v-if="show">
      <img :src="loading" class="w-30 h-30">
      <slot></slot>
    </div>
  </Transition>
</template>
