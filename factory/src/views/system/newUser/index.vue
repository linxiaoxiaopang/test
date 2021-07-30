<template>
  <div class="app-container">
    <eHeader :menus="distors" :sup_this="sup_this" :query="query" v-p="['rbac:common_users:create']"/>

    <!--表格渲染-->
    <CommonTable
      style="margin-top: 15px"
      row-key="id"
      lazy
      ref="table"
      :tableLoading="tableLoading"
      :cols="cols"
      :infoData="data"
      :selection="false"
      :load="load"
      :tree-props="{ children: 'children', hasChildren: 'sub_distributors' }"
      @selection-change="handleSelectionChange"
    >
      <template #typeSlot="{ scoped: row }">
        {{ row.type_name }}
      </template>

      <template #is_activeName="{ scoped: row }">
        <el-tag v-if="row[row.prop]" size="small" type="primary"> 是 </el-tag>
        <el-tag v-else size="small" type="danger"> 否 </el-tag>
      </template>
      <template #rolesSlot="{ scoped: row }">
        <el-tag
          style="margin: 5px"
          type="primray"
          size="mini"
          :key="id"
          v-for="{ id, name } in row[row.prop] || []"
        >
          {{ name }}
        </el-tag>
      </template>

      <slot>
        <el-table-column
          fixed="right"
          label="操作"
          width="320px"
          align="center"
        >
          <template slot-scope="scope">
            <Assign :menus="menus" :data="scope.row" :sup_this="sup_this" v-p="['rbac:match_roles:partial_update']" />
            <edit :menus="distors" :data="scope.row" :sup_this="sup_this" v-p="['rbac:common_users:update']"/>
            <updatePass :data="scope.row" :sup_this="sup_this" v-p="['rbac:common_users:change_password']" />
            <!-- <el-popover :ref="scope.row.id" placement="top" width="180">
              <p>确定删除本条数据吗？所有关联的数据将会被清除</p>
              <div style="text-align: right; margin: 0">
                <el-button
                  size="mini"
                  type="text"
                  @click="$refs[scope.row.id].doClose()"
                  >取消</el-button
                >
                <el-button
                  :loading="delLoading"
                  type="primary"
                  size="mini"
                  @click="subDelete(scope.row.id)"
                  >确定</el-button
                >
              </div>
              <ColorTextBtn
                class="line inline-block"
                slot="reference"
                type="danger"
                size="mini"
                >删除</ColorTextBtn
              >
            </el-popover> -->
          </template>
        </el-table-column>
      </slot>
    </CommonTable>
    <PaginationBar
      ref="paginationBar"
      @refreshTableEventFun="refreshTableEventFun"
      :total="total"
    />
  </div>
</template>

<script>
import CommonTreeTable from "@/components/commonTreeTable";
import initDataMixin from "@/mixins/initData";
import {
  del,
  list,
  updateAdminType,
  employeeList,
  subDistributor,
} from "@/api/user";
import { getSelectedRoles } from "@/api/role";

import { parseTime } from "@/utils/index";
import eHeader from "./module/header";
import edit from "./module/edit";
import updatePass from "./module/updatePass";
import Assign from "./module/assign";
import cols from "./cols";
import {SYS_YES} from '@/utils/constant'

export default {
  mixins: [initDataMixin],
  components: { CommonTreeTable, eHeader, edit, updatePass, Assign },
  data() {
    return {
      cols,
      delLoading: false,
      url: "/api/rbac/common_users/",
      query: {
        is_supplier: SYS_YES
      },
      sup_this: this,
      distors: [],
      treeIds: [],
      menus: [],
    };
  },
  created() {
    this.getSelectedRoles();
  },
  methods: {
    parseTime,

    load(tree, treeNode, resolve) {
      const { id } = tree;
      subDistributor(id)
        .then((res) => {
          const { detail = [] } = res || {};
          this.treeIds.push(id);
          resolve(detail);
        })
        .catch((err) => {
          resolve([]);
        });
    },
    async getSelectedRoles() {
      const { detail = [] } = (await getSelectedRoles()) || {};
      this.menus = detail;
    },
    initCallBack() {
      this.treeIds.map((id) => {
        const node = this.$refs.table.table["store"].states.treeData[id];
        node.loaded = false;
        node.expanded = false;
      });
    },

    subDelete(id) {
      this.delLoading = true;
      del(id)
        .then((res) => {
          this.delLoading = false;
          this.$refs[id].doClose();
          const size = this.size;
          this.page = Math.min(this.page, Math.ceil((this.total - 1) / size));
          this.init();
          this.$message({
            showClose: true,
            type: "success",
            message: "删除成功!",
            duration: 2500,
          });
        })
        .catch((err) => {
          this.delLoading = false;
          this.$refs[id].doClose();
          console.log(err);
        });
    },
    async employeeList(params = {}) {
      const { detail = [] } = await employeeList(params);
      this.distors = detail;
    },
  },
};
</script>

<style scoped>
</style>
