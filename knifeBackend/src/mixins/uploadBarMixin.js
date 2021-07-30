export default {
  data() {
    return {
      uploadBar: {},
      customColors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 100 },
        { color: '#6f7ad3', percentage: 100 }
      ]
    }
  },
  computed: {
    showUploadBar() {
      return (
        this.uploadBar.total && this.uploadBar.total != this.uploadBar.loaded
      )
    },
    percentage() {
      return (
        this.uploadBar.total &&
        this.uploadBar.loaded &&
        Number(
          ((this.uploadBar.loaded / this.uploadBar.total) * 100).toFixed(2)
        )
      )
    }
  },
  mounted() {
    this.$nextTick(() => {
      const node = this.$el.querySelector(
        '.common-filed-img-uploadbar-wrapper'
      )
      if (!node) {
        throw new Error(
          '进度条组件需要在文件上传组件的父组件上加上全局样式"common-filed-img-uploadbar-wrapper"'
        )
      }
    })
  },
  methods: {
    progressFunc(progressEvent) {
      const { total = 0.000001, loaded = 0 } = progressEvent || {}
      this.$set(this.uploadBar, 'loaded', loaded)
      this.$set(this.uploadBar, 'total', total)
    }
  }
}
