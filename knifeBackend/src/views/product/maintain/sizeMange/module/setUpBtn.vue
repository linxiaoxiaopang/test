<template>
  <color-text-btn type="primary" size="mini" class="filter-item line" @click="to"> 显示设置 </color-text-btn>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    },

    //一键定制位置
    isPosRefer: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    to() {
      const {
        base_sizes: [{ id }]
      } = this.data

      if (!this.isPosRefer) {
        return this.$router.push(`/product/maintain/referenceSize?id=${id}`)
      }
      return this.$router.push(`/product/maintain/posReferenceSize?id=${id}`)
    }
  }
}
</script>

<style></style>
