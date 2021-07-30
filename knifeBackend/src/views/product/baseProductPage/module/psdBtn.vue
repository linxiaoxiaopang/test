<template>
  <el-button
    :type="(isEdit && 'danger') || 'info'"
    size="mini"
    class="filter-item"
    @click="to"
  >
    {{ isEdit ? "编辑" : "添加" }}刀版图文件
  </el-button>
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
      const { base_sizes = [] } = this.data || {};
      return !!base_sizes.length;
    },
  },
  methods: {
    to() {
      this.$router.push(`/knife/psd?id=${this.data.id}`);
    },
  },
};
</script>

<style>
</style>