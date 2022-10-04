<script setup>
import EditableForm from '../components/EditableForm.vue'

let form = $ref([{ type: 'html', html: '<h1>test</h1>' }]), state = $ref({})

for (let i = 1; i <= 20; i++) form.push({ type: 'html', html: '<p>test</p>' })
</script>

<template>
  <div class="p-4">
    <h1 class="font-bold text-2xl">New Atool!</h1>
    <p>The new Atool is still under construction</p>
    <div class="bg-white shadow rounded my-2 p-4">
      <EditableForm :form="form" :state="state" />
    </div>
  </div>
</template>
