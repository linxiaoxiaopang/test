import axios from 'axios'
import router from '@/router'
import { Notification, detailBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import { getUUID } from '@/utils'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API // api 的 base_url
  // timeout: 60000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  (config) => {
    if (getToken()) {
      config.headers['Authorization'] = 'JWT ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    config.headers['Content-Type'] = 'application/json'
    config.headers['x-trace-id'] = `12${getUUID()}`
    config.url = config.url.replace(/\/$/, '')
    return config
  },
  (error) => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  (response) => {
    const status = response.status || response.code
    if (status < 200 || status > 300) {
      Notification.error({
        title: '错误',
        message: response.detail || response.msg.name.join(',')
      })
      return Promise.reject('error')
    } else {
      //通过“size”和“type”的key值是否存在判断是否是'blod'类型的数据
      if (response.data.size && response.data.type) {
        return response.data
      }

      //格式化response数据
      response.data.detail = response.data.data
      delete response.data.data
      let { code, msg, message } = response.data || {}
      msg = msg || message
      if (code.toString().indexOf('401') >= 0) {
        Notification.error({
          title: '错误',
          message: '授权失败，没有访问权限!'
        })
        store.dispatch('LogOut')
        return Promise.reject(response.data)
      }
      if (code != 0 && (code < 200 || code > 300)) {
        let errMsg = ''
        let title = '错误'
        if (typeof msg === 'string') {
          errMsg = msg
        } else if (msg instanceof Object) {
          const errArr = Object.keys(msg).filter(
            (key) => key !== 'status_code'
          )
          if (msg['status_code']) {
            title = `${msg['status_code']}错误`
          }
          const tmpArr = []
          errArr.map((key) => {
            const str = `${key}: ${msg[key]}`
            tmpArr.push(str.replace(/。$/, ''))
          })
          errMsg = tmpArr.join('，') + '。'
        }
        Notification.error({
          title: title,
          message: errMsg,
          customClass: 'wrap'
        })
        return Promise.reject(errMsg)
      }
      return response.data
    }
  },
  (error) => {
    let code = 0
    if (error.toString().indexOf('500') >= 0) {
      Notification.error({
        title: '错误',
        message: '服务器错误!'
      })
      return Promise.reject(error)
    }
    try {
      code = error.response.data.status
    } catch (e) {
      if (error.toString().indexOf('timeout')) {
        Notification.error({
          title: '错误',
          message: '请求超时!'
        })
        return Promise.reject(error)
      }
    }
    if (code === 401) {
      detailBox
        .confirm(
          '登录状态过期了哦，您可以继续留在该页面，或者重新登录',
          '系统提示',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        .then(() => {
          store.dispatch('LogOut')
        })
    } else if (code === 403) {
      router.push({ path: '/401' })
    } else if (code === 502) {
      Notification.error({
        title: '错误',
        message: '后端服务器连接失败!'
      })
    } else {
      const errorMsg = error.response.data.detail
      if (errorMsg !== undefined) {
        Notification.error({
          title: '错误',
          message: errorMsg,
          duration: 2500
        })
      }
    }
    return Promise.reject(error)
  }
)
export default service
