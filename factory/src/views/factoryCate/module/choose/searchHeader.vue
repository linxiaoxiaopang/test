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
      >搜索</el-button
    >
  </div>
</template>

<script>
export default {
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
      this.sup_this.init();
    },
  },
};
</script>
