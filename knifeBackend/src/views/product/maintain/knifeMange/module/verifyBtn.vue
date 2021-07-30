<template>
  <color-text-btn
    v-if="isEdit"
    type="primary"
    class="filter-item line"
    @click="to"
  >
    校验组件
  </color-text-btn>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isEdit() {
      try {
        return this.data.base_sizes.length;
      } catch (err) {
        return false;
      }
    },
  },
  methods: {
    to() {
      this.$router.push(`/product/maintain/verifyComponent?id=${this.data.id}`);
    },
  },
};
</script>

<style>
</style>