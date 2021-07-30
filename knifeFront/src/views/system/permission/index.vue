<template>
  <div class="app-container">
    <PermissionTreeTable
      :data="addNewPermissions"
      :tableLoading="tableLoading"
      :canInput="true"
      operationTitle="待新建权限列表"
      @inputHandler="inputHandler"
    >
      <template #rightOperationBtn>
        <LoadingBtn
          v-if="!permissions.length"
          v-p="['api:rbac:permissions:bulk_create']"
          type="primary"
          size="mini"
          @click="bulkDoAdd"
        >
          新建全部
        </LoadingBtn>
      </template>
      <slot>
        <el-table-column
          label="操作"
          width="80px"
          align="center"
          v-if="permissions.length"
        >
          <template slot-scope="{ row }">
            <LoadingBtn
              v-p="['api:rbac:permissions:create']"
              @click="addHandler(row)"
              size="mini"
              type="primary"
              >新建</LoadingBtn
            >
          </template>
        </el-table-column>
      </slot>
    </PermissionTreeTable>

    <PermissionTreeTable
      :tableLoading="tableLoading"
      :data="delPermissions"
      operationTitle="待删除权限列表"
    >
      <slot
        ><el-table-column label="操作" width="80px" align="center">
          <template slot-scope="scope">
            <el-popover :ref="scope.row.id" placement="top" width="200">
              <p>确定删除吗,如果存在下级节点则节点上升，此操作不能撤销！</p>
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
              <el-button
                slot="reference"
                :disabled="scope.row.id === 1"
                type="danger"
                size="mini"
                >删除</el-button
              >
            </el-popover>
          </template>
        </el-table-column></slot
      >
    </PermissionTreeTable>

    <PermissionTreeTable
      :tableLoading="tableLoading"
      :data="permissions"
      operationTitle="列表展示"
    >
      <template #rightOperationBtn>
        <AddGroup
          v-p="['api:rbac:permissions:create']"
          :permissions="permissionChildSelectList"
          :sup_this="sup_this"
          type="primary"
          size="mini"
          @click="bulkDoAdd"
        >
          添加权限组
        </AddGroup>
      </template>
      <slot>
        <el-table-column label="操作" width="300px" align="center">
          <template slot-scope="scope">
            <edit
              v-p="['api:rbac:permissions:update']"
              v-if="scope.row.method"
              :permissions="permissions"
              :data="scope.row"
              :sup_this="sup_this"
            />
            <ChooseGroup
              v-p="['api:rbac:permissions:update']"
              v-if="scope.row.method"
              :permissions="permissionGroupList"
              :data="scope.row"
              :sup_this="sup_this"
            />
            <ReditGroup
              v-p="['api:rbac:permissions:update']"
              :data="scope.row"
              :permissions="permissionChildSelectList"
              :sup_this="sup_this"
              v-if="!scope.row.method"
            />
            <AddChilds
              v-p="['api:rbac:permissions:add_childs']"
              :data="scope.row"
              :permissions="permissionChildSelectList"
              :sup_this="sup_this"
              v-if="!scope.row.method"
            >
              添加子权限
            </AddChilds>

            <el-popover
              v-p="['api:rbac:permissions:delete']"
              v-if="!scope.row.method"
              :ref="scope.row.id"
              placement="top"
              width="200"
            >
              <p>
                确定要确定删除权限组吗？权限与前端紧密关联，请核实正常后再进行此操作！
              </p>
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
              <el-button
                slot="reference"
                :disabled="scope.row.id === 1"
                type="danger"
                size="mini"
                >删除组</el-button
              >
            </el-popover>
          </template>
        </el-table-column>
      </slot>
    </PermissionTreeTable>
  </div>
</template>

<script>
// 权限判断函数
import treeTable from "@/components/TreeTable";
// import initData from "@/mixins/initData";
import {
  getPermissionTree,
  del,
  bulkGet,
  bulkAdd,
  add,
} from "@/api/permission";
import { parseTime, shakingChildren } from "@/utils/index";
import eHeader from "./module/header";
import edit from "./module/edit";
import AddChilds from "./module/addChilds";
import AddGroup from "./module/addGroup";
import ReditGroup from "./module/reditGroup";
import ChooseGroup from "./module/chooseGroup";
import initDataMixin from "@/mixins/initData";

import PermissionTreeTable from "./module/permissionTreeTable";

export default {
  mixins: [initDataMixin],
  components: {
    eHeader,
    edit,
    AddGroup,
    ReditGroup,
    ChooseGroup,
    AddChilds,
    treeTable,
    PermissionTreeTable,
  },
  data() {
    return {
      columns: [
        {
          text: "名称",
          value: "name",
        },
        {
          text: "方法",
          value: "method",
        },
      ],
      delLoading: false,
      sup_this: this,
      permissions: [], //前端web显示的权限列表
      addNewPermissions: [], //新增权限列表
      delPermissions: [], //需要删除的限列表
      permissionChildSelectList: [],
      permissionGroupList: [],
      url: "/api/rbac/permissions/bulk_get/",
      size: 1000,
    };
  },

  methods: {
    parseTime,

    initCallBack(res) {
      const { right_perms = [], new_perms = [], delete_perms = [] } =
        (res.detail && res.detail.data) || {};
      this.permissions = right_perms;
      this.addNewPermissions = new_perms;
      this.delPermissions = delete_perms;
      this.permissionChildSelectList = this.permissions.filter(
        ({ method }) => method
      );
      this.permissionGroupList = this.permissions.filter(
        ({ method }) => !method
      );
    },
    inputHandler({ val, index, prop }) {
      this.$set(this.addNewPermissions[index], prop, val);
    },
    async addHandler(row) {
      const { name, alias, url, method } = row || {};
      const { code } = await add({
        name,
        alias,
        url,
        method,
      });
      if (code >= 200 && code < 300) {
        this.$message.success("新增权限成功!");
        this.init();
      }
    },

    subDelete(id) {
      this.delLoading = true;
      del(id)
        .then((res) => {
          this.delLoading = false;
          this.$refs[id].doClose();
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

    async bulkDoAdd() {
      const params = this.addNewPermissions.map(
        ({ name, method, url, alias }) => ({
          name,
          method,
          url,
          alias,
        })
      );
      try {
        await bulkAdd(params);
        this.init();
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped>
</style>
