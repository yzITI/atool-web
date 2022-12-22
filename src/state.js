import { reactive, watch } from 'vue'

export const SS = window.sessionStorage

export const LS = window.localStorage

if (typeof LS.locale === 'undefined') LS.locale = navigator.language.indexOf('zh') === 0 ? 1 : 0

export const state = reactive({
  locale: Number(LS.locale || 0),
  loading: false,
  user: SS.user ? JSON.parse(SS.user) : null,
  nodes: JSON.parse(LS.nodes || '{}')
})

watch(() => state.nodes, v => { LS.nodes = JSON.stringify(v) }, { deep: true })

export default state
