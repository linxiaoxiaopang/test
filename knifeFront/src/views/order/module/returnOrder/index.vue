<template>
  <color-text-btn type="info" :loading="loading" @click="cancel"> 退货 </color-text-btn>
</template>

<script>
import { returnGoods } from '@/api/order/returnGoods'
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    sup_this: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async cancel() {
      console.log(this.data)
      const { orderCode } = this.data
      this.$confirm(
        `<div>已选择订单编号:<span style="color: #ffba00;">${orderCode}</span></div>
        确定退货吗？`,
        '确认',
        {
          confirmButtonText: '确认退货',
          cancelButtonText: '放弃',
          dangerouslyUseHTMLString: true,
          callback: async (action) => {
            if (action === 'confirm') {
              const { id } = this.data || {}
              try {
                const { code } = await this.returnGoods({
                  id: id
                })
                if ($SUC({ code })) {
                  this.sup_this && this.sup_this.init()
                  this.$message.success('退货成功')
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
    async returnGoods(params) {
      this.loading = true
      try {
        const res = await returnGoods(params)
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
