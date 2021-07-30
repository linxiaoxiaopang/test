<template>
  <div class="app-container">
    <eHeader :menus="distors" :sup_this="sup_this" :query="query" v-p="['rbac:common_users:create']" />
    <!-- 20210625068 LY823286705CN-->
    <!--表格渲染-->
    <CommonTable
      :tableLoading="tableLoading"
      :cols="cols"
      :infoData="data"
      :selection="false"
      :isExpand="true"
      height="calc(100vh - 300px)"
      @expand-change="expandChange"
      @selection-change="handleSelectionChange"
    >
      <template #expand="{ scoped: row }">
        <div v-if="!showExpand[`${row.id}`]">
          该分销商暂无子账号
        </div>
        <div v-else>
          <el-table :data="expandData[`${row.id}`]" border v-loading="loading">
            <el-table-column label="子账号名称" prop="nick_name"> </el-table-column>
            <el-table-column label="登录账号" prop="username"> </el-table-column>
            <el-table-column label="创建时间" prop="date_joined">
              <template v-slot="{ row }">
                {{ row.date_joined | formatTime }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
      <template #typeSlot="{ scoped: row }">
        {{ row.type_name }}
      </template>
      <template #date_joinedSlot="{ scoped: row }">
        {{ row.date_joined | formatTime }}
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
            <edit :menus="distors" :data="scope.row" :sup_this="sup_this" v-p="['rbac:common_users:update']" />
            <updatePass :data="scope.row" :sup_this="sup_this"></updatePass>
            <resellerInfo :data="scope.row" :id="scope.row.id"></resellerInfo>
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
import resellerInfo from './module/resellerInfo.vue'
import { parseTime } from '@/utils/index'
import eHeader from './module/header'
import edit from './module/edit'
import updatePass from './module/updatePass'
import Assign from './module/assign'
import cols from './cols'
import { subAccount } from './resellerPage/resellerAPI'

export default {
  mixins: [initDataMixin],
  components: { eHeader, edit, updatePass, Assign, resellerInfo },
  data() {
    return {
      cols,
      delLoading: false,
      url: '/api/rbac/common_users?is_supplier=0',
      sup_this: this,
      distors: [],
      treeIds: [],
      menus: [],
      expandData: {},
      loading: false,
      showExpand: {}
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
    // 当点击展开列时发送获取子账号数据请求
    async expandChange(row) {
      // 隐藏文字
      this.showExpand[`${row.id}`] = true
      this.loading = true
      // 发送请求
      const { detail } = await subAccount({ parent_id: row.id })
      this.expandData[`${row.id}`] = detail
      // 若某一列没有数据就显示 文字
      if (!detail.length) {
        this.showExpand[`${row.id}`] = false
      }
      this.loading = false
    }
  }
}
</script>

<style scoped>
.el-table {
  border-left: 1px solid #ebeef5;
}
.expandClass {
  width: 300px;
}
</style>
