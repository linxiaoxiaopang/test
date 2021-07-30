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
        >新增全部</LoadingBtn
      >
    </div>
    <eForm ref="form" v-bind="$attrs" :menus="menus" :is-add="true" />
  </div>
</template>

<script>
import { add, bulkAdd } from "@/api/menu";
import superRouter from "@/router/superRouter";

import eForm from "./form";
export default {
  components: { eForm },
  props: {
    query: {
      type: Object,
      required: true,
    },
    menus: {
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
      let params = this.shakingChildren(superRouter);
      try {
        await bulkAdd(params);
        this.$parent.init();
      } catch (err) {
        console.log(err);
      }
    },
    async doAdd() {
      let pArr = this.shakingChildren(superRouter);
      const errArr = [];
      for (let i = 0; i < pArr.length; i++) {
        let p = pArr[i];
        const res = await p;
        const { code, msg = {} } = res;
        if (code < 200 || code > 300) {
          const name = Object.keys(msg).filter(
            (key) => key !== "status_code"
          )[0];
          if (Array.isArray(msg[name]) && msg[name].length > 0) {
            errArr.push(`第${i + 1}个${msg[name].join(",")}`);
          }
        }
      }
      if (errArr.length) {
        this.$notify.error({
          title: "错误",
          message: errArr.join(""),
        });
      }
      this.$parent.init();
    },

    shakingChildren(data) {
      let tempArr = [];
      this.sort = 0;
      data.map((item) => {
        const {
          component,
          id,
          pid,
          name,
          path,
          hidden,
          meta: { icon },
        } = item;
        const params = {
          component: component === "Layout" ? "" : component,
          id,
          pid,
          name,
          icon,
          path: path.replace(/^\//, ""),
          is_frame: false,
          is_show: !hidden,
          sort: ++this.sort,
        };
        tempArr.push(params);
        if (Array.isArray(item.children) && item.children.length > 0) {
          tempArr = tempArr.concat(this.shakingChildren(item.children));
        }
      });
      return tempArr;
    },

    // shakingChildren(data) {
    //   let tempArr = [];
    //   this.sort = 0;
    //   data.map((item) => {
    //     const {
    //       component,
    //       id,
    //       pid,
    //       name,
    //       path,
    //       hidden,
    //       meta: { icon },
    //     } = item;
    //     const params = {
    //       component: component === "Layout" ? "" : component,
    //       id,
    //       pid,
    //       name,
    //       icon,
    //       path: path.replace(/^\//, ""),
    //       is_frame: false,
    //       is_show: !hidden,
    //       sort: ++this.sort,
    //     };
    //     tempArr.push(add(params));
    //     if (Array.isArray(item.children) && item.children.length > 0) {
    //       tempArr = tempArr.concat(this.shakingChildren(item.children));
    //     }
    //   });
    //   return tempArr;
    // },
  },
};
</script>
