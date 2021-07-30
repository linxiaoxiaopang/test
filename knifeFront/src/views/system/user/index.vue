<template>
  <div class="app-container system-account-user">
    <eHeader :menus="distors" :sup_this="sup_this" :query="query" />

    <!--表格渲染-->
    <CommonTable
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
        <el-tag v-if="row[row.prop]" size="small" type="primary"> 启用 </el-tag>
        <el-tag v-else size="small" type="danger"> 禁用 </el-tag>
      </template>
      <template #rolesSlot="{ scoped: row }">
        <el-tag style="margin: 5px" type="primray" size="mini" :key="id" v-for="{ id, name } in row[row.prop] || []">
          {{ name }}
        </el-tag>
      </template>

      <slot>
        <el-table-column fixed="right" label="操作" width="320px" align="center">
          <template slot-scope="scope">
            <Assign :menus="menus" :data="scope.row" :sup_this="sup_this" v-p="['rbac:common_users:match_roles']" />
            <edit :menus="distors" :data="scope.row" :sup_this="sup_this" v-p="['rbac:common_users:update']" />
            <updatePass :data="scope.row" :sup_this="sup_this" v-p="['rbac:common_users:reset_password']" />
          </template>
        </el-table-column>
      </slot>
    </CommonTable>
    <PaginationBar ref="paginationBar" @refreshTableEventFun="refreshTableEventFun" :total="total" />
  </div>
</template>

<script>
import CommonTreeTable from '@/components/commonTreeTable'
import initDataMixin from '@/mixins/initData'
import { del, list, updateAdminType, employeeList, subDistributor } from '@/api/user'
import { getSelectedRoles } from '@/api/role'

import { parseTime } from '@/utils/index'
import eHeader from './module/header'
import edit from './module/edit'
import updatePass from './module/updatePass'
import Assign from './module/assign'
import cols from './cols'

export default {
  mixins: [initDataMixin],
  components: { CommonTreeTable, eHeader, edit, updatePass, Assign },
  data() {
    return {
      cols,
      delLoading: false,
      url: '/api/rbac/common_users/',
      sup_this: this,
      distors: [],
      treeIds: [],
      menus: []
    }
  },
  created() {
    this.getSelectedRoles()
  },
  methods: {
    parseTime,

    load(tree, treeNode, resolve) {
      const { id } = tree
      subDistributor(id)
        .then((res) => {
          const { detail = [] } = res || {}
          this.treeIds.push(id)
          resolve(detail)
        })
        .catch((err) => {
          resolve([])
        })
    },
    async getSelectedRoles() {
      const { detail = [] } = (await getSelectedRoles()) || {}
      this.menus = detail
    },
    initCallBack() {
      this.treeIds.map((id) => {
        const node = this.$refs.table.table['store'].states.treeData[id]
        node.loaded = false
        node.expanded = false
      })
    },

    subDelete(id) {
      this.delLoading = true
      del(id)
        .then((res) => {
          this.delLoading = false
          this.$refs[id].doClose()
          const size = this.size
          this.page = Math.min(this.page, Math.ceil((this.total - 1) / size))
          this.init()
          this.$message({
            showClose: true,
            type: 'success',
            message: '删除成功!',
            duration: 2500
          })
        })
        .catch((err) => {
          this.delLoading = false
          this.$refs[id].doClose()
          console.log(err)
        })
    },
    async employeeList(params = {}) {
      const { detail = [] } = await employeeList(params)
      this.distors = detail
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-table__header .cell {
    color: #666;
    font-weight: normal;
  }
}
</style>
