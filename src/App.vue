<script setup>
import OverlayLoading from './components/OverlayLoading.vue'
import Bar from './components/Bar.vue'
import state from './state.js'
</script>

<template>
  <div class="w-full min-h-screen flex flex-col bg-gray-100">
    <Bar></Bar>
    <div class="grow">
      <RouterView></RouterView>
    </div>
  </div>
  <OverlayLoading :show="state.loading">{{ typeof state.loading === 'string' ? state.loading : '' }}</OverlayLoading>
</template>
