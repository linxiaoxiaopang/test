import Vue from 'vue'
// import "default-passive-events";
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import '@/styles/theme/index.css' // global css
import 'font-awesome/css/font-awesome.min.css'
import moment from 'moment'//导入文件
import PSD from 'psd.js/dist/psd.min'
import fabric from '@/components/fabric'
//其他线程
import VueWorker from 'vue-worker'

//vue-awesome-swiper滚动插件
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import './permission' // permission control

import baseComponents from '@/commons/baseComponents'
import globalConst from '@/commons/globalConst'
import commonElementUi from '@/commons/commonElementUi'
import filters from '@/filters' // global filters
import directive from '@/directive' // global directive
import config from '@/service/config'

import '@/components'

Vue.prototype.$serverRootPath = config.baseURL
Vue.prototype.PSD = PSD
Vue.prototype.$moment = moment//赋值使用

moment.locale('zh-cn')
moment.relativeTimeThreshold('h', 24) // 设置新的阈值 - 一天最少小时数

Vue.use(ElementUI, { locale })
  .use(baseComponents)
  .use(globalConst)
  .use(commonElementUi)
  .use(filters)
  .use(directive)
  .use(fabric)
  .use(VueAwesomeSwiper)
  .use(VueWorker)
Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
