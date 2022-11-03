<script setup>
import { watch } from 'vue'
import state from '../state.js'
import { I, random } from '../utils/string.js'
import srpc from '../utils/srpc.js'
import blocks from '../blocks/index.js'
import Editor from '../components/Editor.vue'
import FormEditor from '../components/FormEditor.vue'
import { DocumentTextIcon, Bars3Icon } from '@heroicons/vue/24/outline'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter(), route = useRoute()

const nid = route.params.id

init()

let info = $ref({}), form = $ref([]), ctx = $ref({ state: {}, json: '{}' })
watch(() => ctx.state, v => {
  ctx.json = JSON.stringify(ctx.state, null, 2)
}, { deep: true })
function updateState () {
  ctx.state = JSON.parse(ctx.json)
}

let timeStr = $computed(() => {
  if (!info.time) return ''
  return moment(info.time).format('YYYY-MM-DD HH:mm:ss')
})

let editing = $ref(-1)
let editingType = $computed(() => {
  if (editing < 0 || !form.length) return false
  const b = form[editing]
  return b?._
})

async function init () {
  state.loading = true
  const res = await srpc.node.get(state.user?.token || '', nid)
  state.loading = false
  if (!res) return Swal.fire('Error', '', 'error')
  info = { title: res.title, description: res.description, time: res.time }
}

let showPanel = $ref(true)
</script>

<template>
  <div class="w-full h-full flex items-start">
    <div class="p-4 h-full overflow-y-auto grow">
      <div class="p-4 bg-white rounded border">
        <h3 class="font-bold text-lg flex items-center justify-between">
          <span>{{ I(info.title) }}</span>
          <div class="flex items-center mb-1">
            <button @click="showPanel = true" class="mr-2 lg:hidden"><Bars3Icon class="w-6" /></button>
            <button @click="submit" class="bg-blue-500 rounded shadow all-transition hover:shadow-md px-3 py-1 text-sm text-white">{{ I('[[Save|保存]]') }}</button>
          </div>
        </h3>
        <FormEditor :form="form" :state="ctx.state" @edit="i => { editing = i; showPanel = true }" />
      </div>
    </div>
    <Transition name="fade">
      <div v-if="showPanel" class="fixed z-40 w-screen h-screen top-0 left-0 bg-black opacity-40 lg:hidden" @click="showPanel = false" />
    </Transition>
    <div class="all-transition shrink-0 side lg:w-96 xl:w-1/3 lg:h-full overflow-y-auto" :class="showPanel && 'show-side'">
      <div class="p-3 m-2 bg-white shadow rounded">
        <h3 class="text-lg font-bold">{{ I('[[Edit Form Info.|编辑表单信息]]') }}</h3>
        <hr>
        <label class="block my-2">
          <span class="font-bold block">{{ I('[[Title|标题]]') }}</span>
          <input class="border rounded px-2 py-1 w-full" type="text" :placeholder="I('[[Form title|表单标题]]')" v-model="info.title">
        </label>
        <label class="block my-2 text-gray-700">
          <span class="font-bold block">{{ I('[[Description|描述]]') }}</span>
          <textarea class="block w-full border rounded px-2 py-1 text-sm" rows="2" v-model="info.description" :placeholder="I('[[Form description|表单表述]]')" />
        </label>
        <div class="flex items-center">
          <button @click="submit" class="bg-blue-500 rounded shadow all-transition hover:shadow-md px-3 py-1 text-sm text-white font-bold">{{ I('[[Save|保存]]') }}</button>
          <p class="text-xs text-gray-500 ml-2">{{ I('[[Last saved at|最后保存于]]: ') }}{{ timeStr }}</p>
        </div>
      </div>
      <div class="p-3 m-2 bg-white shadow rounded" v-if="editingType">
        <h3 class="text-lg font-bold">{{ I('[[Edit Form Block|编辑表单组件]]') }}</h3>
        <p class="text-xs text-gray-500 mb-2">{{ I('[[Block type|组件类型]]:') }} <code>{{ editingType }}</code></p>
        <Component :is="blocks[editingType]?.panel" :i="editing" :form="form" :state="ctx.state" />
      </div>
      <div class="p-3 m-2 bg-white shadow rounded">
        <h3 class="text-lg font-bold">{{ I('[[Realtime State|实时状态]]') }}</h3>
        <Editor class="h-40 my-2" language="json" v-model="ctx.json" />
        <button @click="updateState" class="bg-yellow-500 rounded shadow all-transition hover:shadow-md px-3 py-1 text-sm font-bold text-white">{{ I('[[Update State|更新状态]]') }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 1024px) {
  .side {
    @apply fixed max-h-screen top-0 z-40 w-11/12 sm:w-4/5 md:w-2/3;
    right: -100%;
  }
  .show-side {
    right: 0;
  }
}
</style>
