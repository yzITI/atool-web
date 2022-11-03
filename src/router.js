import { createRouter, createWebHashHistory } from 'vue-router'

const index = {
  '/': () => import('./views/Cover.vue'),
  '/home': () => import('./views/Home.vue'),
  '/form/:id': () => import('./views/Form.vue'),
  '/run/:id': () => import('./views/Run.vue'),
  '/login': () => import('./views/Login.vue'),
  '/dev/service/:id': () => import('./views/DevService.vue')
}

const routes = []
for (const r in index) routes.push({ path: r, component: index[r] })
const router = createRouter({ history: createWebHashHistory(), routes }) 

router.beforeEach(() => { NProgress.start() })
router.afterEach(() => {
  Swal.close()
  NProgress.done()
  window.onmessage = () => {} // clean for sandbox
})

export default router