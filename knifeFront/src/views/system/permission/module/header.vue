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
    <!-- 新增 -->
    <div style="display: inline-block; margin: 0px 2px">
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="$refs.form.dialog = true"
        >新增</el-button
      >

      <LoadingBtn
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="bulkDoAdd"
        >待新增</LoadingBtn
      >

      <LoadingBtn
        class="filter-item"
        size="mini"
        type="danger"
        icon="el-icon-plus"
        @click="bulkDoAdd"
        >待更新</LoadingBtn
      >

      <LoadingBtn
        class="filter-item"
        size="mini"
        type="warning"
        icon="el-icon-plus"
        @click="bulkDoAdd"
        >待删除</LoadingBtn
      >
      <eForm ref="form" :permissions="permissions" :is-add="true" />
    </div>
  </div>
</template>

<script>

import { bulkGet, bulkAdd } from "@/api/permission";
import eForm from "./form";
export default {
  components: { eForm },
  props: {
    query: {
      type: Object,
      required: true,
    },
    permissions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      downloadLoading: false,
    };
  },
  methods: {
    
    toQuery() {
      console.log(this.query);
      this.$parent.page = 1;
      this.$parent.init();
    },
    async bulkDoAdd() {
      const permissionList = await bulkGet();
      console.log("permissionList", permissionList);
      return;
      let params = this.shakingChildren(permissionList);
      try {
        await bulkAdd(params);
        this.$parent.init();
      } catch (err) {
        console.log(err);
      }
    },
    shakingChildren(data) {
      let tempArr = [];
      this.sort = 0;
      data.map((item) => {
        const params = {
          ...item,
        };
        tempArr.push(params);
        if (Array.isArray(item.children) && item.children.length > 0) {
          tempArr = tempArr.concat(this.shakingChildren(item.children));
        }
      });
      return tempArr;
    },
  },
};
</script>
