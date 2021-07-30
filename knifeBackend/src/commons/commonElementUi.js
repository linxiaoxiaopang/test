export default {
  install: (Vue) => {
    Vue.prototype.$lConfirm = async (msg, title = '提示') => {
      return await Vue.prototype
        .$confirm(msg, title, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          return true
        })
        .catch(() => {
          Vue.prototype.$message({
            type: 'info',
            message: '已取消'
          })
          return false
        })
    }
  }
}
