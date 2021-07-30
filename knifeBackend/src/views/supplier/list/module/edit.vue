<template>
  <ColorTextBtn class="line inline-block" size="mini" type="primary" @click="to">编辑</ColorTextBtn>
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
    async to() {
      this.$router.push(`/supplier/list/editSupplier?id=${this.data.id}`)
    }
  }
}
</script>

<style scoped>
div {
  display: inline-block;
  margin-right: 3px;
}
</style>
