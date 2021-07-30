export default {
  props: {
    title: {
      type: String,
      default: '提示'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    sup_this: {
      type: Object,
      required: true
    },
    isAdd: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialog: this.dialogVisible
    }
  },
  watch: {
    dialog(newVal) {
      this.$emit('update:dialogVisible', newVal)
    },
    dialogVisible(newVal) {
      this.dialog = newVal
    }
  },
  methods: {
    resetForm() {
      const { form } = this.$refs
      if (!Array.isArray(form)) {
        form.resetFields()
      } else {
        form.map(node => {
          node.resetFields()
        })
      }

      this.$nextTick(() => {
        this.dialog = false
      })
    },
    cancel() {
      this.resetForm()
    },
    success() {
      this.$message.success('操作成功')
      this.resetForm()
      this.init()
    },
    init() {
      this.sup_this && this.sup_this.init()
    },
    async validate(isData) {
      const { form } = this.$refs
      const forms = Array.isArray(form) ? form : [form]
      const successData = await Promise.all(
        forms.map(async node => {
          try {
            return await node.validate()
          } catch (err) {
            return false
          }
        })
      )
      if (isData) {
        return successData
      }
      return successData.every(bool => bool)
    }
  }
}
