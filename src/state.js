import { reactive, watch } from 'vue'

export const SS = window.sessionStorage

export const LS = window.localStorage

if (typeof LS.locale === 'undefined') LS.locale = navigator.language.indexOf('zh') === 0 ? 1 : 0

export const state = reactive({
  locale: Number(LS.locale || 0),
  loading: false,
  user: null,
  nodes: JSON.parse(LS.nodes || '{}')
})

export function login (token) {
  SS.removeItem('token')
  let input = token?.split('.')?.[1]
  if (!input) return false
  input = input.replace(/-/g, '+').replace(/_/g, '/')
  const pad = input.length % 4
  if (pad) input += new Array(5 - pad).join('=')
  const payload = JSON.parse(decodeURIComponent(atob(input).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')))
  if (payload.iat + 86400e3 < Date.now()) return false
  payload.token = token
  SS.token = token
  state.user = payload
  return payload
}

if (SS.token) login(SS.token)

watch(() => state.nodes, v => { LS.nodes = JSON.stringify(v) }, { deep: true })

export default state
