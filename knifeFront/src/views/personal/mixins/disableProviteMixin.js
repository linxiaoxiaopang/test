import {
  disable,
  cancelDisable,
  publicDisable,
  publicCancelDisable
} from '@/api/imageApi'

export default {
  props: {
    type: {
      type: [String, Number],
      default: 0
    }
  },
  methods: {
    async doSubmit() {
      const valid = await this.validate()
      if (!valid) return
      this.loading = true
      const data = Array.isArray(this.data) ? this.data : [this.data]
      const ids = data.map(({ id }) => id)
      if (data.length === 0) {
        this.loading = false
        return this.$message.warning('请先选择数据')
      }
      if (this.isDiable) {
        await this.doCancelDisable(ids)
      } else {
        await this.doDisable(ids)
      }
      this.loading = false
    },
    async doCancelDisable(ids) {
      try {
        const apis = [cancelDisable, publicCancelDisable]
        const { code } = await apis[this.type]({
          ids
        })
        if ($SUC({ code })) {
          this.success()
        }
      } catch (err) {
        console.log(err)
      }
      return true
    },
    async doDisable(ids) {
      console.log('type', this.type)
      const apis = [disable, publicDisable]
      try {
        const { code } = await apis[this.type]({
          ids,
          ...this.form
        })
        if ($SUC({ code })) {
          this.success()
        }
      } catch (err) {
        console.log(err)
      }
      return true
    }
  }
}
