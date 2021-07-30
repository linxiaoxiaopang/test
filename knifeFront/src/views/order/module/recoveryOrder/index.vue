<template>
  <color-text-btn class="line" type="info" :loading="loading" @click="cancel">
    恢复
  </color-text-btn>
</template>

<script>
import { recover } from '@/api/order/recover'
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    sup_this: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async cancel() {
      const { orderCode } = this.data
      this.$confirm(
        `<div>已选择订单编号:<span style="color: #ffba00;">${orderCode}</span></div>
        确定恢复该订单吗？`,
        '确认',
        {
          confirmButtonText: '确认恢复',
          cancelButtonText: '放弃',
          dangerouslyUseHTMLString: true,
          callback: async (action) => {
            if (action === 'confirm') {
              const { id } = this.data || {}

              try {
                const { code } = await this.recover({
                  id: id
                })
                if ($SUC({ code })) {
                  this.sup_this && this.sup_this.init()
                  this.$message.success('恢复成功')
                  this.$store.dispatch('GetOrderCount')
                }
              } catch (err) {}
              return
            }
            this.$message.info('已放弃')
          }
        }
      )
    },
    async recover(params) {
      this.loading = true
      try {
        const res = await recover(params)
        const { detail, code } = res
        if ($SUC({ code })) {
          this.sup_this && this.sup_this.init()
        }
      } catch (err) {
        console.log(err)
      }
      this.loading = false
      return true
    }
  }
}
</script>

<style></style>
