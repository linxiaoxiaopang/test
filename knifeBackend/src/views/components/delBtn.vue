<template>
  <div class="line inline-block">
    <color-text-btn
      type="danger"
      size="mini"
      class="filter-item"
      @click="handleDelete"
    >
      <slot>删除</slot>
    </color-text-btn>
  </div>
</template>
<script>
import request from '@/service/request'
export default {
  props: {
    id: {
      required: true
    },
    type: {
      type: String,
      required: true
    },
    sup_this: {
      type: Object
    },
    api: {
      type: Function
    }
  },
  computed: {
    delApi() {
      if (typeof this.api === 'function') return this.api
      let urls = {
        prim_prod_info: '/api/prim_prod/prim_prod_info/'
      }
      return () => {
        return request({
          url: urls[this.type] + this.id,
          method: 'delete'
        })
      }
    }
  },
  methods: {
    handleDelete() {
      this.$confirm(
        '确定删除?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          this.delApi()
            .then(res => {
              if ($SUC(res)) {
                this.$message.success('删除成功')
                if (this.sup_this) {
                  this.sup_this.refreshPage()
                }
              }
            })
        })
        .catch(() => {
          this.$message.info('已取消')
        })
    }
  }
};
</script>
