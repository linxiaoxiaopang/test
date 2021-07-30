<template>
  <color-text-btn
    type="primary"
    class="filter-item line"
    @click="to"
  >
    校验位置组件
  </color-text-btn>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    }
  },
  methods: {
    to() {
      this.$router.push(`/knife/verify?id=${this.data.id}`)
    }
  }
}
</script>

<style>
</style>