<template>
  <div class="app-container">
    <eHeader :menus="distors" :sup_this="sup_this" :query="query" v-p="['rbac:common_users:create']" />

    <!--表格渲染-->
    <CommonTable
      :tableLoading="tableLoading"
      :cols="cols"
      :infoData="data"
      :selection="false"
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
        <el-tag style="margin: 5px" type="primray" size="mini" :key="id" v-for="{ id, name } in row[row.prop] || []">
          {{ name }}
        </el-tag>
      </template>

      <slot>
        <el-table-column fixed="right" label="操作" width="300px" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.id !== 1">
              <edit :menus="distors" :data="scope.row" :sup_this="sup_this" v-p="['rbac:common_users:update']" />
              <updatePass :data="scope.row" :sup_this="sup_this" v-p="['rbac:common_users:reset_password']" />
              <Assign :menus="menus" :data="scope.row" :sup_this="sup_this" v-p="['rbac:common_users:match_roles']" />
              <color-text-btn type="danger"> 禁用 </color-text-btn>
            </template>
            <template v-else>
              <color-text-btn type="warning"> 超级管理员 </color-text-btn>
            </template>
          </template>
        </el-table-column>
      </slot>
    </CommonTable>
    <PaginationBar ref="paginationBar" @refreshTableEventFun="refreshTableEventFun" :total="total" />
  </div>
</template>

<script>
import initDataMixin from '@/mixins/initData'
import { getSelectedRoles } from '@/api/role'

import { parseTime } from '@/utils/index'
import eHeader from './module/header'
import edit from './module/edit'
import updatePass from './module/updatePass'
import Assign from './module/assign'
import cols from './cols'

export default {
  mixins: [initDataMixin],
  components: { eHeader, edit, updatePass, Assign },
  data() {
    return {
      cols,
      delLoading: false,
      url: '/api/rbac/admin_users/',
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
    }
  }
}
</script>

<style scoped></style>
