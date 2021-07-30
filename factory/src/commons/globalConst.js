export default {
  install(Vue) {
    window.$SUC = res => {
      if (!res) return false
      const { code } = res
      return (code >= 200 && code < 300) || code === 0
    }
  }
}
