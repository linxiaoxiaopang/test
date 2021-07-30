<template>
  <div class="app-container app-flex-col-container role-page">
    <div class="title">角色权限</div>
    <EHeader :sup_this="sup_this" :query="query" />
    <div class="flex-col-content">
      <CommonTable
        height="100%"
        :tableLoading="tableLoading"
        :cols="cols"
        :infoData="data"
        :selection="false"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="150px"
        >
          <template slot-scope="{ row }">
            <Detail :data="row" v-p="['rbac:roles:read']"/>
            <color-text-btn type="success" @click="linkToEditPage(row)" v-p="['rbac:roles:update']">
              编辑
            </color-text-btn>
          </template>
        </el-table-column>
      </CommonTable>
    </div>
    <PaginationBar
      ref="paginationBar"
      @refreshTableEventFun="refreshTableEventFun"
      :total="total"
    />
  </div>
</template>

<script>
import { initDataMixin } from "@/mixins";
import EHeader from "./module/header";
import Edit from "./module/edit";
import Detail from "./module/detail";
import cols from "./cols";

export default {
  mixins: [initDataMixin],
  components: {
    EHeader,
    Edit,
    Detail,
  },
  props: {},
  data() {
    return {
      cols,
      url: "/api/rbac/roles/",
      sup_this: this,
    };
  },

  methods: {
    linkToEditPage({ id }) {
      this.$router.push(
        `/personalCenter/permission/system/role/editRole?id=${id}`
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.role-page.role-page {
  padding: 30px;
  background: #fff;
  .title {
    margin-bottom: 20px;
  }
}
</style>