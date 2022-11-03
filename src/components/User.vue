<script setup>
import { UserCircleIcon, HomeIcon } from '@heroicons/vue/24/outline'
import Wrapper from './Wrapper.vue'
import { I } from '../utils/string.js'
import state from '../state'
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps(['show'])

let showPanel = $ref(false)

function goto (path) {
  router.push(path)
  showPanel = false
}

function signin () {
  window.location.href = 'https://cn.aauth.link/#/launch/atool'
}
</script>

<template>
  <Transition name="fade" mode="out-in">
    <UserCircleIcon v-if="state.user" @click="showPanel = true" class="w-8 text-gray-700 cursor-pointer" />
    <button v-else @click="signin" class="bg-blue-500 rounded shadow all-transition hover:shadow-md px-3 py-1 font-bold text-white">{{ I('[[Sign in|登录]]') }}</button>
  </Transition>
  <Transition name="fade">
    <div v-if="showPanel" @click="showPanel = false" class="fixed w-full h-screen bg-transparant z-50 top-0 left-0" />
  </Transition>
  <div class="fixed z-50 top-16 w-72 rounded shadow-lg bg-white all-transition" v-if="state.user" :class="showPanel ? 'right-2' : '-right-72'">
    <Wrapper :show="showPanel" class="pt-4 flex flex-col items-center">
      <UserCircleIcon class="w-16 text-gray-500" />
      <h3 class="text-xl font-bold text-gray-800">{{ state.user.name }}</h3>
      <p class="text-xs text-gray-500 mt-1 mb-3">{{ state.user.id }}</p>
      <button class="all-transition w-full text-gray-500 flex items-center px-6 py-3 border border-x-0 hover:bg-gray-50" @click="goto('/home')">
        <HomeIcon class="w-6 mr-2" />{{ I('[[My nodes|我的实例]]') }}
      </button>
      <div class="rounded-b bg-gray-100 text-gray-500 text-sm py-2 flex items-center justify-around w-full">
        <p class="cursor-pointer" @click="goto('/about')">{{ I('[[About|关于]]') }}</p>
        <p>&copy; yzITI 2022</p>
      </div>
    </Wrapper>
  </div>
</template>