<script setup>
const props = defineProps(['i', 'form', 'state'])
let block = $computed(() => props.form[props.i])
</script>

<template>
  <label class="font-bold block p-2">{{ block.label }}</label>
  <div class="w-full overflow-x-auto">
    <table class="table-auto text-center border-collapse border border-slate-500">
      <thead class="font-bold bg-gray-200">
        <tr>
          <th class="border border-slate-500 px-2" v-for="c in block.columns">{{ c.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="d in props.state[block.key]">
          <td class="border border-slate-500 px-1" v-for="c in block.columns">{{ d[c.key] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>