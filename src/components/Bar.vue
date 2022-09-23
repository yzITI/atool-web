<script setup>
import User from './User.vue'
import { useRouter } from 'vue-router'
const router = useRouter() 
</script>

<template>
  <div class="w-full h-12 px-4 bg-white shadow flex items-center justify-between">
    <div>
      <h1 class="font-bold text-2xl cursor-pointer select-none" @click="router.push('/')">Atool</h1>
    </div>
    <div>
      <User></User>
    </div>
  </div>
</template>
