export default {
  install(Vue) {
    window.$SUC = (res) => {
      if (!res) return false
      const { code } = res || {}
      return (code >= 200 && code < 300) || code == 0
    }
    // @example see @\views\product\baseProductPage\module\header.vue
    window.awaitWrap = (promise) => {
      return promise
        .then(data => [null, data])
        .catch(err => [err, null])
    }
  }
}
