<script setup>
import OverlayLoading from './components/OverlayLoading.vue'
import Bar from './components/Bar.vue'
import state from './state.js'
</script>

<template>
  <div class="w-full min-h-screen bg-gray-100">
    <Bar></Bar>
    <div style="height: calc(100vh - 3rem); overflow: auto;">
      <RouterView></RouterView>
    </div>
  </div>
  <OverlayLoading :show="state.loading">{{ typeof state.loading === 'string' ? state.loading : '' }}</OverlayLoading>
</template>
