import { createRouter, createWebHashHistory } from 'vue-router'

const index = {
  '/': () => import('./views/Cover.vue'),
  '/login': () => import('./views/Login.vue'),
  '/home': () => import('./views/Home.vue'),
  '/F/:id': () => import('./views/Form.vue'),
  '/S/:id': () => import('./views/Service.vue'),
  '/run/:id': () => import('./views/Run.vue')
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