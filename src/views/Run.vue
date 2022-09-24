<script setup>
import blocks from '../blocks/index.js'
import state from '../state.js'
state.run = {
  steps: [{
    title: 'test Title',
    description: 'lalallalsldfhajsdkvnoqwdfjk',
    form: [
      { type: 'html', html: 'test!' },
      { type: 'html', html: '<h1>test</h1>' },
      { type: 'html', html: 'test!' }
    ]
  }]
}
</script>

<template>
  <div>
    <div v-for="(s, i) in state.run.steps" class="shadow rounded-lg bg-white m-4"><!-- step card -->
      <div class="p-4"><!-- header -->
        <h3 class="text-2xl font-bold">{{ s.title }}</h3>
        <p class="text-sm text-gray-500">{{ s.description }}</p>
      </div>
      <!-- form -->
      <template v-for="(b, j) in s.form">
        <hr>
        <div class="my-2 mx-4">
          <component :is="blocks[b.type]?.block" :i="i" :j="j" />
        </div>
      </template>
      <hr>
      <div class="p-4"><!-- footer -->
        <button class="text-white font-bold bg-blue-500 rounded shadow all-transition hover:shadow-md px-3 py-1">Submit</button>
      </div>
    </div>
  </div>
</template>
