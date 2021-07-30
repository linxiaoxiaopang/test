<template>
  <ColorTextBtn class="line inline-block" :disabled="data.id === 1" size="mini" type="success" @click="to"
    >编辑</ColorTextBtn
  >
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async to() {
      this.$router.push(
        `/system/user/editUser?id=${this.data.id}`
      );
    },
  },
};
</script>

<style scoped>
div {
  display: inline-block;
  margin-right: 3px;
}
</style>
