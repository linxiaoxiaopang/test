<template>
  <div class="head-container">
    <!-- 新增 -->
    <div class="inline-block role-component-header">
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="linkToAddRole"
        >添加角色</el-button
      >

      <!-- 搜索 -->
      <el-input
        v-model="query.search"
        clearable
        placeholder="输入角色名称搜索"
        style="width: 200px"
        class="filter-item"
        prefix-icon="el-icon-search"
        @keyup.enter.native="toQuery"
      />
      <eForm ref="form" :is-add="true" />
    </div>
  </div>
</template>

<script>
// 权限判断函数
import { parseTime } from "@/utils/index";
import eForm from "./form";
// 查询条件
export default {
  components: { eForm },
  props: {
    query: {
      type: Object,
      required: true,
    },
    sup_this: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      downloadLoading: false,
    };
  },
  methods: {
    linkToAddRole() {
      this.$router.push("/system/role/addRole");
    },
    toQuery() {
      this.$parent.page = 1;
      this.$parent.init();
    },
    download() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = ["ID", "名称", "描述"];
        const filterVal = ["id", "name", "desc"];
        const data = this.formatJson(filterVal, this.$parent.data);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list",
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === "createTime") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
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