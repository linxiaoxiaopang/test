<template>
  <color-text-btn type="primary" size="mini" class="line filter-item" @click="to"> 编辑图片 </color-text-btn>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },

  methods: {
    to() {
      const { base_sizes: [{ id: referenceId }] = [{}], id: protoId } = this.data
      if (!referenceId) {
        return this.$message.error('请先设计参考尺码，再进行此操作！')
      }
      this.$router.push(`/product/maintain/uploadProShow?protoId=${protoId}&referenceId=${referenceId}`)
    }
  }
}
</script>
