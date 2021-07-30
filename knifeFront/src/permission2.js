import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { filterAsyncRouter } from './store/modules/permission'
import { getToken } from '@/utils/auth'
import superRouter from '@/router/superRouter'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar;
  if (getToken()) {
    if (store.getters.addRouters && store.getters.addRouters.length === 0) {
      const asyncRouter = filterAsyncRouter(
        JSON.parse(JSON.stringify(superRouter))
      )
      const isRedirect =
        asyncRouter[0] &&
        asyncRouter[0].children &&
        Array.isArray(asyncRouter[0].children) &&
        asyncRouter[0].children.length > 0
      if (isRedirect) {
        const path =
          asyncRouter[0].path === '/' ? '/' : `${asyncRouter[0].path}/`
        asyncRouter[0].redirect = `${path}${asyncRouter[0].children[0].path}`
        asyncRouter[0].children.map((item) => {
          item.path = `${path}${item.path}`
        })
        asyncRouter[0].path = '/'
      }
      asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
      store.dispatch('GenerateRoutes', asyncRouter).then(() => {
        // 存储路由
        router.addRoutes(asyncRouter) // 动态添加可访问路由表
        next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
      })
    } else {
      next()
      NProgress.done()
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
      NProgress.done()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
