<script setup>
import { GlobeAsiaAustraliaIcon } from '@heroicons/vue/24/outline'
import User from './User.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import { state, LS } from '../state.js'
import { I } from '../utils/string.js'

function changeLocale () {
  state.locale = Number(!state.locale)
  LS.locale = state.locale
}
</script>

<template>
  <div class="w-full h-12 px-4 bg-white shadow flex items-center justify-between relative">
    <div>
      <h1 class="font-bold text-2xl cursor-pointer select-none" @click="router.push('/')">Atool</h1>
    </div>
    <div class="flex items-center">
      <button class="flex items-center text-gray-500 text-sm mr-4" @click="changeLocale">
        <GlobeAsiaAustraliaIcon class="w-4 mr-1" />
        {{ I('[[中文|English]]') }}
      </button>
      <User></User>
    </div>
  </div>
</template>
