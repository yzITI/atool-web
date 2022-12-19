<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
import OverlayLoading from './components/OverlayLoading.vue'
import Bar from './components/Bar.vue'
import state from './state.js'
</script>

<template>
  <div class="w-full min-h-screen bg-gray-100">
    <Bar v-if="!route.query.simple"></Bar>
    <div :style="{ height: route.query.simple ? '100vh' : 'calc(100vh - 3rem)', overflow: 'auto' }">
      <RouterView></RouterView>
    </div>
  </div>
  <OverlayLoading :show="state.loading">{{ typeof state.loading === 'string' ? state.loading : '' }}</OverlayLoading>
</template>
