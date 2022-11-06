<script setup>
import { GlobeAsiaAustraliaIcon } from '@heroicons/vue/24/outline'
import User from './User.vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter(), route = useRoute()
import { state, LS } from '../state.js'
import { I } from '../utils/string.js'

function changeLocale () {
  state.locale = Number(!state.locale)
  LS.locale = state.locale
}

let page = $computed(() => {
  if (route.path.indexOf('/form/') === 0) return I('[[Form|表单]]')
  if (route.path.indexOf('/data/') === 0) return I('[[Data|数据]]')
  if (route.path.indexOf('/service/') === 0) return I('[[service|服务]]')
  return ''
})
</script>

<template>
  <div class="w-full h-12 px-4 bg-white shadow flex items-center justify-between relative z-30">
    <div class="flex items-center">
      <h1 class="font-bold text-2xl cursor-pointer select-none" @click="router.push('/')">Atool</h1>
      <h3 v-if="page" class="font-bold ml-2 text-2xl select-none">{{ page }}</h3>
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
