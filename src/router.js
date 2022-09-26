import { createRouter, createWebHashHistory } from 'vue-router'

const index = {
  '/': () => import('./views/Home.vue'),
  '/run': () => import('./views/Run.vue'),
  '/login': () => import('./views/Login.vue'),
  '/dev/home': () => import('./views/DevHome.vue'),
  '/dev/service/:id': () => import('./views/DevService.vue')
}

const routes = []
for (const r in index) routes.push({ path: r, component: index[r] })
const router = createRouter({ history: createWebHashHistory(), routes }) 

router.beforeEach(() => { NProgress.start() })
router.afterEach(() => {
  Swal.close()
  NProgress.done()
})

export default router