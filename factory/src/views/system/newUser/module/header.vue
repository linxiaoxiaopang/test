<template>
  <div class="head-container">
    <div class="inline-block user-component-header">
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="to"
        >添加用户</el-button
      >

      <el-input
        v-model="query.username"
        clearable
        placeholder="输入登录账号搜索"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="toQuery"
      />
    </div>

    <!-- 新增 -->

    <eForm ref="form" v-bind="$attrs" :is-add="true" />
  </div>
</template>

<script>
// 权限判断函数
import eForm from "./form";
// 查询条件
export default {
  components: { eForm },
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
    async to() {
      this.$router.push("/system/user/addUser");
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