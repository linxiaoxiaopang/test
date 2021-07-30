<template>
  <color-text-btn type="info" :loading="loading" @click="cancel">
    取消
  </color-text-btn>
</template>

<script>
import { cancell } from '@/api/order/cancell'
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
      console.log(this.data)

      this.$confirm(
        `<div>已选择订单编号:<span style="color: #ffba00;">${orderCode}</span></div>
        确定取消该订单吗？已取消的订单，可以在已取消订单中恢复原订单状态。`,
        '确认',
        {
          confirmButtonText: '确认取消',
          cancelButtonText: '放弃',
          dangerouslyUseHTMLString: true,
          callback: async (action) => {
            if (action === 'confirm') {
              const { id } = this.data || {}
              try {
                await this.cancell({
                  idList: [id]
                })
                this.$message.success('取消成功')
              } catch (err) {}
              return
            }
            this.$message.info('已放弃')
          }
        }
      )
    },
    async cancell(params) {
      this.loading = true
      try {
        const res = await cancell(params)
        const { detail, code } = res
        if ($SUC({ code })) {
          this.sup_this && this.sup_this.init()
          this.$store.dispatch('GetOrderCount')
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
