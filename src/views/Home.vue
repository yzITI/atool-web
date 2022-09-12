<script setup>
let cot = $ref(0)

function inc () {
  cot++
}
</script>

<template>
  <h1>New Atool!</h1>
  <p>cot: {{ cot }}</p>
  <button @click="inc">Click Me</button>
</template>