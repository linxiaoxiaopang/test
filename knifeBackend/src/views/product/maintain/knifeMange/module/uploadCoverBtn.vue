<template>
  <color-text-btn
    type="primary"
    class="filter-item line"
    @click="to"
  >
    上传封面
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
      this.$router.push(`/knife/cover?id=${this.data.id}`)
    }
  }
}
</script>

<style>
</style>