export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  watch: {
    visible: {
      handler(n) {
        this.dialogVisible = n
      },
      immediate: true
    },
    dialogVisible(n) {
      this.$emit('update:visible', n)
    }
  }
}
