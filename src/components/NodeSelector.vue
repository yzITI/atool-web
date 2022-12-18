<script setup>
import { I } from '../utils/string.js'
import srpc from '../utils/srpc.js'
import state from '../state.js'
import { CubeIcon, SquaresPlusIcon, CircleStackIcon, MagnifyingGlassIcon, UserIcon } from '@heroicons/vue/24/outline'
const props = defineProps(['modelValue'])
const emits = defineEmits(['update:modelValue', 'select'])

let show = $computed(() => props.modelValue)
const titles = {
  U: '[[Select User|选择用户]]',
  F: '[[Select Form|选择表单]]',
  D: '[[Select Data|选择数据]]'
}

let keyword = $ref(''), searchResult = $ref(null), searchTip = $ref('')

async function search () {
  if (keyword[keyword.length - 1] !== show && show !== 'U') return searchTip = I('[[Invalid ID|ID不正确]]')
  searchTip = 'Loading...'
  const res = await srpc.U.query(state.user?.token || '', [keyword])
  searchTip = I('[[Not found|未找到]]')
  if (res && res[keyword]) {
    searchResult = { id: keyword, name: res[keyword] }
    searchTip = ''
  }
}

let list = $computed(() => {
  const res = {}
  if (searchResult) res[searchResult.id] = searchResult.name
  for (const k in state.nodes) {
    if (k[k.length - 1] === show) res[k] = state.nodes[k].name
  }
  return res
})

function select (nid, name) {
  emits('select', nid, name)
  emits('update:modelValue', false)
}
</script>

<template>
  <Transition name="fade">
    <div class="fixed z-50 top-0 left-0 w-screen h-screen bg-black opacity-50" v-if="show" @click="emits('update:modelValue', false)" />
  </Transition>
  <div class="all-transition fixed z-50 w-11/12 md:w-1/3 bg-white h-screen top-0 overflow-y-auto" :class="show ? 'right-0' : '-right-full'">
    <h4 class="text-lg font-bold text-center my-2">{{ I(titles[show]) }}</h4>
    <input class="w-full block py-1 px-2 text-sm font-mono border" :placeholder="I('[[Enter to Search ID|回车搜索ID]]')" @change="searchResult = null; searchTip = ''" v-model="keyword" @keyup.enter="search">
    <p class="text-xs text-gray-400 px-2">{{ searchTip }}</p>
    <div class="p-2 mt-2">
      <hr>
      <div v-for="(name, id) in list" class="p-1 cursor-pointer all-transition flex items-center border-b border-gray-200 hover:bg-gray-100" @click="select(id, name)">
        <SquaresPlusIcon v-if="show === 'F'" class="w-6 mr-2" />
        <div class="flex flex-col items-start">
          {{ name }}
          <code class="text-gray-400 -mt-0.5 px-1 bg-gray-100" style="font-size: 0.6rem;">{{ id }}</code>
        </div>
      </div>
    </div>
  </div>
</template>