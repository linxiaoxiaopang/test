export default {
  activated() {
    // 第一次加载时会执行activated生命周期
    // deactivated为true时，表示组件已缓存，此时可以执行init更新数据
    if (this.deactivated) {
      this.refreshPage()
    }
  },
  deactivated() {
    this.deactivated = true
  },
  methods: {
    refreshPage() {
      this.isPageChange = true // 防止请求数据postData更新
      this.init()
    }
  }
}
