<template>
  <div class="app-container">
    <eHeader :sup_this="sup_this" :query="query" />

    <!--表格渲染-->
    <CommonTable
      :tableLoading="tableLoading"
      :cols="cols"
      :infoData="data"
      :selection="false"
      @selection-change="handleSelectionChange"
    >
      <template #create_timeSlot="{ scoped }">
        <span>{{ parseTime(scoped[scoped.prop]) }}</span>
      </template>

      <template #is_activeName="{ scoped: row }">
        <el-tag v-if="row[row.prop]" size="small" type="primary"> 是 </el-tag>
        <el-tag v-else size="small" type="danger"> 否 </el-tag>
      </template>
      <slot>
        <el-table-column fixed="right" label="操作" width="100px" align="center">
          <template slot-scope="scope">
            <color-text-btn type="danger" @click="removeDisable"> 解禁 </color-text-btn>
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
import eHeader from './module/header'
import cols from './cols'
import { parseTime } from '@/utils'

export default {
  mixins: [initDataMixin],
  components: { eHeader },
  data() {
    return {
      cols,
      delLoading: false,
      url: '/api/rbac/common_users/',
      sup_this: this
    }
  },
  methods: {
    parseTime,
    removeDisable() {
      console.log('removeDisable')
    }
  }
}
</script>

<style scoped></style>
