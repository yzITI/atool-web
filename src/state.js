import { reactive, watch } from 'vue'

export const SS = window.sessionStorage

export const state = reactive({
  loading: false,
  user: SS.user ? JSON.parse(SS.user) : null,
  run: null
})

export default state
