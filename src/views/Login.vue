<script setup>
import { useRoute, useRouter } from 'vue-router'
import { decodeJSON } from '../utils/crypto.js'
import { state, SS } from '../state'
const route = useRoute(), router = useRouter()
const token = route.query.token

state.loading = true

if (token) {
  state.user = decodeJSON(token.split('.')[1])
  state.user.token = token
  SS.user = JSON.stringify(state.user)
  state.loading = false
}

router.push('/')
</script>

<template>
</template>
