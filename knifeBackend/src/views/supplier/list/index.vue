<template>
  <div class="app-container">
    <eHeader
      :menus="distors"
      :sup_this="sup_this"
      :query="query"
      v-p="['rbac:common_users:create']"
      add_url="/supplier/list/addSupplier"
      search_supplier
    >
      <el-button
        slot="create"
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="create"
        >添加供应商</el-button
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
      <!-- 创建时间slot -->
      <template #create_timeSlot="{ scoped }">
        <span>{{ parseTime(scoped[scoped.prop]) }}</span>
      </template>

      <slot>
        <el-table-column fixed="right" label="操作" width="200px" align="center">
          <template slot-scope="scope">
            <edit
              :menus="distors"
              :data="scope.row"
              :sup_this="sup_this"
              v-p="['rbac:common_users:update']"
            />
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
import initDataMixin from '@/mixins/initData'
import { getSelectedRoles } from '@/api/role'

import { parseTime } from '@/utils/index'
import eHeader from '../module/header'
import edit from './module/edit'
import Assign from '../module/assign'
import cols from './cols'

export default {
  mixins: [initDataMixin],
  components: { eHeader, edit, Assign },
  data() {
    return {
      cols,
      delLoading: false,
      url: '/api/rbac/supplier',
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
    },
    create() {
      this.$router.push('/supplier/list/addSupplier')
    }
  }
}
</script>

<style scoped></style>
