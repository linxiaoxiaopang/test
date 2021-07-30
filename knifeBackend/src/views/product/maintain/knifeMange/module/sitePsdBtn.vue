<template>
  <color-text-btn
    :type="isEdit ? 'danger' : 'info'"
    size="mini"
    class="filter-item line"
    @click="to"
  >
    {{ isEdit ? "更新" : "上传" }}位置psd
  </color-text-btn>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    status: {
      type: Number,
      default: 0
    }
  },
  computed: {
    isEdit() {
      return this.status > 2
    },
  },
  methods: {
    to() {
      this.$router.push(`/knife/size?id=${this.data.id}&base_size_id=${this.data.base_sizes[0].id}`);
    },
  },
};
</script>

<style>
</style>