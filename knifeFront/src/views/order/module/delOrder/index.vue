<template>
  <color-text-btn class="line" type="info" :loading="loading" @click="cancel">
    删除
  </color-text-btn>
</template>

<script>
import { deleted } from '@/api/order/delete'
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
        确定删除该订单吗？已删除的订单将无法恢复。`,
        '确认',
        {
          confirmButtonText: '确认删除',
          cancelButtonText: '放弃',
          dangerouslyUseHTMLString: true,
          callback: async (action) => {
            if (action === 'confirm') {
              const { id } = this.data || {}
              try {
                const { code } = await this.deleted({
                  idList: [id]
                })
                if ($SUC({ code })) {
                  this.sup_this && this.sup_this.init()
                  this.$message.success('删除成功')
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
    async deleted(params) {
      this.loading = true
      try {
        const res = await deleted(params)
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
