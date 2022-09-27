<script setup>
import { CubeTransparentIcon } from '@heroicons/vue/24/outline'
import state from '../state.js'
import srpc from '../utils/srpc.js'
const props = defineProps(['service'])
const emits = defineEmits(['submit'])
</script>

<template>
  <Transition name="fade">
    <div v-if="props.service.id" class="fixed top-0 left-0 bg-black opacity-20 w-screen h-screen" @click="props.service.id = ''" />
  </Transition>
  <div class="print:hidden fixed top-0 w-11/12 sm:w-96 bg-white h-screen all-transition p-4 overflow-y-auto shadow" :class="props.service.id ? 'right-0' : '-right-full'">
    <div class="flex items-center">
      <CubeTransparentIcon class="w-8 mr-2" />
      <div>
        <h3 class="font-bold text-xl">Edit Service</h3>
        <code class="text-xs text-gray-500 block">{{ props.service.id }}</code>      
      </div>
    </div>
    <hr class="my-4">
    <label class="block my-2">
      <span class="font-bold">Title</span>
      <input class="block w-full border rounded px-2 py-1" v-model="props.service.title">
    </label>
    <label class="block my-2">
      <span class="font-bold">Description</span>
      <textarea class="block w-full border rounded px-2 py-1 text-sm" rows="2" v-model="props.service.description" />
    </label>
    <button @click="emits('submit')" class="bg-blue-500 rounded shadow all-transition hover:shadow-md px-3 py-1 my-2 font-bold text-white">Submit</button>
  </div>
</template>