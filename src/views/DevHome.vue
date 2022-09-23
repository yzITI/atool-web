<script setup>
import state from '../state.js'
import { useRouter } from 'vue-router'
const router = useRouter()

if (!state.user) router.push('/')
else init()

let list = $ref([])

async function init () {
  state.loading = true
  // load service list
  state.loading = false
}
</script>

<template>
  <div class="w-full min-h-full">
    This is /dev/home page
  </div>
</template>
