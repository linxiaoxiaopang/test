<template>
  <div class="app-container">
    <avue-crud ref="crud"
               :data="tableData"
               :option="tableOption"
               :page="tablePage"
               class="in-production">
      <template #menuLeft>
        <el-button size="mini" icon="el-icon-plus" type="primary" @click="addUser">添加管理员</el-button>
      </template>
    </avue-crud>
  </div>
</template>

<script>
  import { tableOption, tableData } from "./tablePartData";
  export default {
    data() {
      return {
        tableOption,
        tableData,
        tablePage: {
          total: 10,
          pageIndex: 0,
          pageSize: 10,
        },
      }
    },
    methods: {
      addUser(){
        this.$router.push({
          path: '/system/user/addUser'
        })
      },
    }
  };
</script>

<style lang="scss" scoped></style>
