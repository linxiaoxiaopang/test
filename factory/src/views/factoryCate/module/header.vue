<template>
  <div class="head-container">
    <!-- 搜索 -->
    <el-input
      v-model="query.search"
      clearable
      placeholder="输入名称搜索"
      style="width: 200px"
      class="filter-item"
      @keyup.enter.native="toQuery"
    />
    <el-button
      class="filter-item"
      size="mini"
      type="primary"
      icon="el-icon-search"
      @click="toQuery"
      v-p="['prim_prod:fac_category:list']"
      >搜索</el-button
    >
    <!-- 新增 权限 -->
    <div style="display: inline-block; margin: 0px 2px">
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="showDialog"
        v-p="['prim_prod:fac_category:create']"
        >新增工厂分类</el-button
      >
    </div>

    <eForm
      ref="form"
      v-bind="$attrs"
      :sup_this="sup_this"
      :is-add="true"
      title="新增工厂分类"
    />
  </div>
</template>

<script>
import eForm from "./form";

export default {
  components: { eForm },
  props: {
    query: {
      type: Object,
      required: true,
    },
    sup_this: {
      type: Object,
      default: null,
    },
  },

  methods: {
    toQuery() {
      this.$parent.page = 1;
      this.$parent.init();
    },
    showDialog() {
      const _this = this.$refs.form;
      _this.dialog = true;
    },
  },
};
</script>
