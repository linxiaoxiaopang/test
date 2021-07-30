import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie
import { isUatOrPro } from '@/utils/index' // getToken from cookie
import { filterAsyncRouter } from './store/modules/permission'
import { buildMenus } from '@/api/login'
import superRouter from '@/router/superRouter'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/', '/login'] // no redirect whitelist
router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar;
  if (getToken()) {
    // 已登录且要跳转的页面是登录页
    if (to.path === '/login') {
      store.dispatch('LogOut')
      next('/')
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (!store.getters.addRouters) {
        // 判断当前用户是否已拉取完user_info信息
        store
          .dispatch('GetInfo')
          .then((res) => {
            // 拉取user_info
            const {
              detail: { type, is_super }
            } = res || {}
            if (is_super) {
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
                // asyncRouter[0].path = '/'
              }
              asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
              store.dispatch('GenerateRoutes', asyncRouter).then(() => {
                // 存储路由
                router.addRoutes(asyncRouter) // 动态添加可访问路由表
                next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
              })
            } else {
              buildMenus()
                .then((res) => {
                  const detail = res.detail
                  if (!detail) {
                    next('/404')
                  }
                  if (!(detail && detail.length)) {
                    next('/')
                  }
                  const isRedirect =
                    detail[0] &&
                    detail[0].children &&
                    Array.isArray(detail[0].children) &&
                    detail[0].children.length > 0
                  if (isRedirect) {
                    const path =
                      detail[0].path === '/' ? '/' : `${detail[0].path}/`
                    detail[0].redirect = `${path}${detail[0].children[0].path}`
                    detail[0].children.map((item) => {
                      item.path = `${path}${item.path}`
                    })
                    // detail[0].path = '/'
                  }
                  const asyncRouter = filterAsyncRouter(res.detail)
                  asyncRouter.push({
                    path: '*',
                    redirect: '/404',
                    hidden: true
                  })
                  store.dispatch('GenerateRoutes', asyncRouter).then(() => {
                    // 存储路由
                    router.addRoutes(asyncRouter) // 动态添加可访问路由表
                    next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
                  })
                })
                .catch((err) => {
                  console.log(err)
                  if (isUatOrPro) {
                    store.dispatch('LogOut')
                  }
                })
            }
          })
          .catch((err) => {
            console.log(err)
            if (isUatOrPro) {
              store.dispatch('LogOut')
            }
          })
      } else {
        next()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      console.log('白名单')
      next()
      NProgress.done()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
