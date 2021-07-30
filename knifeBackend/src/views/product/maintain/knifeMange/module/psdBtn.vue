<template>
  <color-text-btn
    :type="(isEdit && 'danger') || 'info'"
    size="mini"
    class="filter-item line"
    @click="to"
  >
    {{ isEdit ? "编辑" : "添加" }}刀版图文件
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
      const { sizes = [] } = this.data || {};
      const files = sizes.filter(({psd_file}) => psd_file)
      return !!files.length;
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