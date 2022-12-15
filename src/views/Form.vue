<script setup>
import { watch } from 'vue'
import state from '../state.js'
import { I } from '../utils/string.js'
import Toggle from '../components/Toggle.vue'
import srpc from '../utils/srpc.js'
import blocks from '../blocks/index.js'
import Editor from '../components/Editor.vue'
import FormEditor from '../components/FormEditor.vue'
import { Bars3Icon } from '@heroicons/vue/24/outline'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter(), route = useRoute()

const nid = route.params.id
let editable = $computed(() => state.nodes[nid]?.role === 'editor' || state.nodes[nid]?.role === 'owner')

init()

let info = $ref({}), links = $ref({}), form = $ref([]), ctx = $ref({ state: {}, json: '{}' })
watch(() => ctx.state, v => {
  ctx.json = JSON.stringify(ctx.state, null, 2)
}, { deep: true })
function updateState () { ctx.state = JSON.parse(ctx.json) }

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

let isPublic = $ref(false)

watch($$(isPublic), async v => {
  if (v) await srpc.U.putLinkTo(state.user?.token || '', '', nid, { role: 'viewer' })
  else await srpc.U.delLinkTo(state.user?.token || '', 'U', nid)
})

function refreshLink () {
  if (state.user && state.nodes[nid] && state.nodes[nid].name !== info.name) state.nodes[nid].name = info.name
}

async function init () {
  state.loading = true
  const res = await srpc.F.get(state.user?.token || '', nid)
  if (!res) {
    await Swal.fire(I('[[Error|错误]]'), I('[[Form not found or permission denied|表单未找到或权限不足]]'), 'error')
    return router.push('/')
  }
  links = await srpc.U.getLinkFrom(state.user?.token || '', nid)
  state.loading = false
  info = { name: res.name, time: res.time }
  form = []
  if (links.U) isPublic = true
  delete links.U
  for (let i = 0; ; i++) {
    if (!res[i]) break
    form.push(JSON.parse(res[i]))
  }
  refreshLink()
}

let showPanel = $ref(false)

async function submit () {
  if (!state.user?.token) return
  const data = { name: info.name, type: 'form' }
  for (let i = 0; i < form.length; i++) {
    data[i] = JSON.stringify(form[i])
  }
  state.loading = true
  const res = await srpc.F.put(state.user.token, nid, data)
  state.loading = false
  if (!res) return Swal.fire(I('[[Error|错误]]'), I('[[Fail to save|保存失败]]'), 'error')
  refreshLink()
  Swal.fire(I('[[Success|保存成功]]'), '', 'success')
}
</script>

<template>
  <div class="w-full h-full flex items-start" v-if="info.time">
    <div class="p-4 h-full overflow-y-auto grow">
      <div class="p-4 bg-white rounded border relative">
        <h3 class="font-bold text-lg flex items-center justify-between my-1">
          <input v-model="info.name" :readonly="!editable">
          <div class="flex items-center mb-1">
            <button @click="showPanel = true" class="mr-2 lg:hidden"><Bars3Icon class="w-6" /></button>
            <button v-if="editable" @click="submit" class="bg-blue-500 rounded shadow all-transition hover:shadow-md px-3 py-1 text-sm text-white">{{ I('[[Save|保存]]') }}</button>
          </div>
        </h3>
        <p v-if="editable" style="font-size: 0.6rem;" class="text-gray-300 absolute right-2 top-1">{{ I('[[Last saved at|最后保存于]]: ') }}{{ timeStr }}</p>
        <FormEditor :form="form" :state="ctx.state" @edit="i => { editing = i; showPanel = true }" />
      </div>
    </div>
    <Transition name="fade">
      <div v-if="showPanel" class="fixed z-40 w-screen h-screen top-0 left-0 bg-black opacity-40 lg:hidden" @click="showPanel = false" />
    </Transition>
    <div class="all-transition shrink-0 side lg:w-96 xl:w-1/3 lg:h-full overflow-y-auto" :class="showPanel && 'show-side'">
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
      <div class="p-3 m-2 bg-white shadow rounded" v-if="state.nodes[nid]?.role === 'owner'">
        <h3 class="text-lg font-bold">{{ I('[[Permission|权限管理]]') }}</h3>
        <hr>
        <label class="block my-2 flex items-center">
          <span class="font-bold mr-2">{{ I('[[Public|公开]]') }}</span>
          <Toggle v-model="isPublic" />
          <p class="text-xs text-gray-500">{{ I('[[accessible by link|可通过链接访问]]') }}</p>
        </label>
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
