<template>
  <color-text-btn
    type="info"
    size="mini"
    class="filter-item line"
    v-if="data.base_sizes.length > 0 && !isLack"
    @click="check"
  >
    <span>效果图校验</span>
  </color-text-btn>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    isLack: {
      type: Boolean
    }
  },
  methods: {
    check() {
      const hasShowImage = this.data.prim_struct.some((item) => {
        return item.prim_show_groups.some((item2) => {
          return item2.prim_show_img.length && item2.prim_show_img.length > 0
        })
      })
      console.log('hasShowImage', hasShowImage)
      if (!hasShowImage) {
        this.$message.error('请先上传效果图')
        return
      }
      const {
        base_sizes: [{ id }],
        id: protoId
      } = this.data
      this.$router.push(`/product/maintain/checkProShow?id=${id}&protoId=${protoId}`)
    }
  }
}
</script>

<style></style>
