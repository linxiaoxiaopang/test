<template>
  <el-image :src="formatUrl" v-bind="$attrs" v-on="$listeners" />
</template>

<script>
export default {
  props: {
    raw: {
      required: true,
    },
  },
  computed: {
    formatUrl() {
      if (!this.raw) return;
      return URL.createObjectURL(this.raw);
    },
  },
};
</script>

<style>
</style>