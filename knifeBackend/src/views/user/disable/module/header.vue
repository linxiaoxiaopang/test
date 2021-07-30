<template>
  <div class="head-container">
    <div class="inline-block user-component-header">
      <el-input
        v-model="query.username"
        clearable
        placeholder="输入登录账号搜索"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="toQuery"
      />
    </div>
  </div>
</template>

<script>
// 查询条件
export default {
  props: {
    sup_this: {
      type: Object,
      required: true,
    },
    query: {
      type: Object,
      required: true,
    },
  },

  methods: {
    // 去查询
    toQuery() {
      this.$parent.page = 1;
      this.$parent.init();
    },
  },
};
</script>
<style lang="scss" scoped>
.user-component-header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
}
</style>