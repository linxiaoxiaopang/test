<template>
  <div class="app-container">
    <eHeader :menus="distors" :sup_this="sup_this" :query="query" v-p="['rbac:common_users:create']" search_account>
      <el-button slot="create" class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="create"
        >添加供应商账号</el-button
      >
    </eHeader>

    <!--表格渲染-->
    <CommonTable
      :tableLoading="tableLoading"
      :cols="cols"
      :infoData="data"
      :selection="false"
      @selection-change="handleSelectionChange"
    >
      <!-- 供应商slot -->
      <template #supplierSlot="{ scoped }">
        <span>{{ scoped[scoped.prop] ? scoped[scoped.prop].name : '' }}</span>
      </template>
      <!-- 创建时间slot -->
      <template #create_timeSlot="{ scoped }">
        <span>{{ parseTime(scoped[scoped.prop]) }}</span>
      </template>
      <!-- 激活状态slot -->
      <template #is_activeName="{ scoped: row }">
        <el-tag v-if="row[row.prop]" size="small" type="primary"> 是 </el-tag>
        <el-tag v-else size="small" type="danger"> 否 </el-tag>
      </template>
      <!-- 用户角色 -->
      <template #rolesSlot="{ scoped: row }">
        <el-tag style="margin: 5px" type="primray" size="mini" :key="id" v-for="{ id, name } in row[row.prop] || []">
          {{ name }}
        </el-tag>
      </template>

      <slot>
        <el-table-column fixed="right" label="操作" width="200px" align="center">
          <template slot-scope="scope">
            <edit :menus="distors" :data="scope.row" :sup_this="sup_this" v-p="['rbac:common_users:update']" />
            <updatePass :data="scope.row" :sup_this="sup_this" v-p="['rbac:common_users:reset_password']" />
            <!-- <Assign :menus="menus" :data="scope.row" :sup_this="sup_this" /> -->
            <color-text-btn type="danger"> 禁用 </color-text-btn>
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
import eHeader from '../module/header'
import edit from './module/edit'
import updatePass from '../module/updatePass'
import Assign from '../module/assign'
import cols from './cols'

export default {
  mixins: [initDataMixin],
  components: { eHeader, edit, updatePass, Assign },
  data() {
    return {
      cols,
      delLoading: false,
      url: '/api/rbac/common_users?is_supplier=1',
      sup_this: this,
      distors: [],
      treeIds: [],
      menus: []
    }
  },
  created() {
    // this.getSelectedRoles()
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
    },
    create() {
      this.$router.push('/supplier/addSupplier')
    }
  }
}
</script>

<style scoped></style>
