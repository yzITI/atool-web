<script setup>
import bannerImg from '../assets/banner.png'
import img1 from '../assets/calculator.svg'
import img2 from '../assets/website.svg'
import img3 from '../assets/documents.svg'
import { I } from '../utils/string.js'
import Form from '../components/Form.vue'
import { CubeIcon } from '@heroicons/vue/24/outline'

let state = $ref({ res: '' }), form = $ref([
  { _: 'html', html: '<p>Type in values of A and B, then execute the code!</p>' },
  { _: 'input', type: 'number', label: 'A = ', key: 'A', placeholder: 'value of A' },
  { _: 'input', type: 'number', label: 'B = ', key: 'B', placeholder: 'value of B' },
  { _: 'code', code: 'const S = ctx.state\nS.res = S.A + S.B', editable: false, visible: true, height: '40px' },
  { _: 'html', html: '<p>The result: A + B = {{ res }}</p>' }
])
</script>

<template>
  <section class="flex flex-col py-10 sm:py-0 sm:h-full bg-white items-center justify-center">
    <h1 class="font-bold text-5xl">ATool</h1>
    <p class="text-lg">ATool is an Amazing Tool</p>
    <div class="my-2">
      <button class="text-blue-600 bg-white rounded all-transition hover:bg-blue-100 px-3 py-1 m-2 font-bold">{{ I('[[Document|查看文档]]') }}</button>
    </div>
    <img :src="bannerImg" class="w-4/5 sm:w-3/4 my-4 object-contain" style="max-height: 60vh;">
  </section>
  <section class="flex flex-col lg:flex-row py-10 bg-white justify-center bg-teal-700 lg:h-[32rem]">
    <div class="lg:w-1/4 flex lg:flex-col rounded-md bg-white lg:justify-around items-center shadow-md p-4 m-4">
      <img :src="img1" class="w-20 md:w-32 lg:w-4/5">
      <p class="text-lg md:text-2xl mx-2">Powerful Calculator</p>
    </div>
    <div class="lg:w-1/4 flex lg:flex-col rounded-md bg-white lg:justify-around items-center shadow-md p-4 m-4">
      <img :src="img2" class="w-20 md:w-32 lg:w-4/5">
      <p class="text-lg md:text-2xl mx-2">Flexible Interaction</p>
    </div>
    <div class="lg:w-1/4 flex lg:flex-col rounded-md bg-white lg:justify-around items-center shadow-md p-4 m-4">
      <img :src="img3" class="w-20 md:w-32 lg:w-4/5">
      <p class="text-lg md:text-2xl mx-2">Designable Survey</p>
    </div>
  </section>
  <section class="p-10">
    <h2 class="text-2xl font-bold flex items-center">
      <CubeIcon class="w-10 mr-2" />
      A + B Demo
    </h2>
    <div class="shadow rounded bg-white mx-2 md:mx-4 my-3">
      <Form :form="form" :state="state" />
    </div>
  </section>
</template>
