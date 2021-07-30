import { vaildData } from '@/components/avue/utils/util'
export default {
  install: Vue => {
    Vue.prototype.$reconfirm = ({
      msg = '确定执行该操作？',
      title = '提示',
      success,
      error,
      ...options
    } = {}) => {
      return Vue.prototype
        .$confirm(msg, title, {
          type: 'warning',
          ...options
        })
        .then(() => {
          // console.log(typeof success === 'function', success)
          if (typeof success === 'function') {
            success()
            return true
          } else {
            Vue.prototype.$message.success('已确定该操作')
          }
          return true
        })
        .catch(() => {
          console.log(typeof error === 'function', error)
          if (typeof error === 'function') {
            error()
          } else {
            Vue.prototype.$message.info('已取消该操作')
          }
          return false
        })
    }

    Vue.prototype.$isSuccess = ({
      success,
      successText = '操作成功',
      error,
      errorText = '操作失败',
      msg,
      ...res
    } = {}) => {
      return new Promise((resolve, reject) => {
        if ($SUC(res)) {
          Vue.prototype.$message.success(successText)
          if (typeof success === 'function') success()
          resolve(true)
        } else {
          Vue.prototype.$message.error(msg || errorText)
          if (typeof error === 'function') error()
          reject(false)
        }
      }).catch(err => {
        return err
      })
    }

    Vue.prototype.validData = vaildData
  }
}
