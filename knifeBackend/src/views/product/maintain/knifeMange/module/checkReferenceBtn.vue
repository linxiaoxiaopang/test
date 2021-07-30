<template>
  <color-text-btn
    type="info"
    size="mini"
    class="filter-item line"
    @click="check"
  >
    <span>刀版图校验</span>
  </color-text-btn>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      sizeStatus: {}
    }
  },
  mounted() {
    const { sizes } = this.data
    sizes.map(({ size_name, status }) => {
      this.sizeStatus[`${size_name}`] = status
    })
  },
  methods: {
    check() {
      // console.log(this.$store)
      this.$store.commit('verifyKnife/SET_KNIFE', this.data.sizes)
      // this.$router.push(`/product/maintain/checkReference?protoId=${this.data.id}`)
      this.sizeStatus.protoId = this.data.id
      this.$router.push({
        path: '/product/maintain/checkReference',
        query: this.sizeStatus
      })
    }
  }
}
</script>

<style></style>
