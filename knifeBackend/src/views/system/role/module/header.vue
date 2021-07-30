<template>
  <div class="head-container">
    <!-- 搜索 -->
    <div class="inline-block role-component-header">
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="$refs.form.dialog = true"
        >添加角色</el-button
      >
      
      <el-input
        v-model="query.value"
        clearable
        placeholder="输入名称搜索"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="toQuery"
      />
      <!-- 新增 -->

      <eForm ref="form" :is-add="true" />
    </div>
  </div>
</template>

<script>
// 权限判断函数
import eForm from "./form";
// 查询条件
export default {
  components: { eForm },
  props: {
    query: {
      type: Object,
      required: true,
    },
  },
  methods: {
    toQuery() {
      this.$parent.page = 1;
      this.$parent.init();
    },
  },
};
</script>
<style lang="scss" scoped>
.role-component-header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
}
</style>