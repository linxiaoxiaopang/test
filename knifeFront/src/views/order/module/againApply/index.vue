<template>
  <div class="line inline-block">
    <color-text-btn
      size="mini"
      type="success"
      :loading="loading"
      @click="cancel"
    >
      重新申请
    </color-text-btn>
  </div>
</template>

<script>
import { orderExpressBatchUpdate } from '@/api/express'

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
        确定重新申请运单吗？`,
        '确认',
        {
          confirmButtonText: '确认',
          cancelButtonText: '放弃',
          dangerouslyUseHTMLString: true,
          callback: async (action) => {
            if (action === 'confirm') {
              const { id, expressCompanyId, expressShippingMethodId } =
                this.data || {}
              try {
                await this.orderExpressBatchUpdate({
                  companyId: expressCompanyId,
                  shippingMethodId: expressShippingMethodId,
                  orderIdList: [id]
                })
                this.$message.success('重新申请成功')
              } catch (err) {}
              return
            }
            this.$message.info('已放弃')
          }
        }
      )
    },
    async orderExpressBatchUpdate(params) {
      this.loading = true
      try {
        const res = await orderExpressBatchUpdate(params)
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
