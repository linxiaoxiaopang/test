export default {
  install(Vue) {
    window.$SUC = res => {
      if (!res) return false
      const { code } = res
      return code == 0 || code >= 200 && code < 300
    }
    /*
    * 处理promise，方便await使用
    * @param {promise}
    * @return {array}
    * */
    window.awaitWrap = (promise) => {
      return promise
        .then(data => [null, data])
        .catch(err => [err, null])
    }
  }
}
