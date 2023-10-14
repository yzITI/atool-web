<script setup>
import state from '../state.js'
import srpc from '../utils/srpc.js'
import { CubeIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'
import { decodeJSON } from '../utils/crypto.js'
import { I } from '../utils/string.js'
import Form from '../components/Form.vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter(), route = useRoute()

const sid = route.params.id
let ctx = $ref(null), name = $ref(''), form = $ref([])

const errMsg = {
  NotFound: '[[Service not found or permission denied|服务不存在或权限不足]]',
  NodeDenied: '[[Service node lost or permission denied|服务资源缺失或权限不足]]'
}

function parseForm (raw) {
  form = []
  for (let i = 0; ;i++) {
    if (!raw[i]) break
    form.push(JSON.parse(raw[i]))
  }
}

async function init () {
  state.loading = true
  const res = await srpc.S.start(state.user?.token, sid)
  state.loading = false
  if (!res || !res.ok) {
    await Swal.fire(I('[[Error|错误]]'), res.err ? I(errMsg[res.err] || res.err) : '', 'error')
    return router.push('/')
  }
  name = res.name
  ctx = res.ctx
  try { ctx.state = { ...JSON.parse(res.form.state), ...decodeJSON(route.query.state) } }
  catch { ctx.state = decodeJSON(route.query.state) }
  parseForm(res.form)
}
init()

let showNext = $ref(true)

async function next () {
  state.loading = true
  const res = await srpc.S.next(state.user?.token, ctx)
  state.loading = false
  if (!res || !res.ok) return Swal.fire(I('[[Error|错误]]'), res.err ? I(errMsg[res.err] || res.err) : '', 'error')
  if (!res.ctx) {
    Swal.fire(I('[[Service completed|服务执行完毕]]'), '', 'success')
    return showNext = false
  }
  name = res.name
  ctx = res.ctx
  parseForm(res.form)
  document.getElementById('container').scrollTo(0, 0)
}
</script>

<template>
  <div class="w-full min-h-full p-4" v-if="ctx">
    <h2 class="text-2xl font-bold flex items-center">
      <CubeIcon class="w-10 mr-2" />
      {{ name }}
    </h2>
    <div class="shadow rounded bg-white mx-2 md:mx-4 my-3">
      <Form :form="form" :state="ctx.state" />
    </div>
    <div class="mx-2 md:mx-4 flex items-center flex-wrap" v-if="showNext">
      <button class="bg-blue-500 px-4 py-2 all-transition shadow hover:shadow-md font-bold text-white rounded flex items-center" @click="next">{{ I('[[Next|下一步]]') }}<ArrowRightIcon class="w-5 ml-1" /></button>
      <p class="text-xs text-gray-500 ml-2">{{ I('[[Code might run on server|可能在服务器上执行代码]]') }}</p>
    </div>
  </div>
</template>
