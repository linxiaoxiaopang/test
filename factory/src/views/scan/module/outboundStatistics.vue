<template>
  <el-dialog
    v-el-drag-dialog
    title="出库统计"
    :visible.sync="dialogVisible"
    width="800px"
    append-to-body
  >
    <avue-crud
      ref="crud"
      class="outbound-statistics"
      :data="finalData"
      :option="tableOption"
      :page="tablePage"
      :tableLoading="tableLoading"
      @size-change="sizeChange"
      @current-change="pageChange"
      @search-change="searchChange"
    >
      <template #menuLeft>
        {{ statisticalImportTime[0] }} 至 {{ statisticalImportTime[1] }}
        出库总计：{{ tableData.totalCount }}单
      </template>
      <template #expressCompanyId="{ row }">
        {{ row.companyName || getLabel('expressCompanyId', row.companyId) }}
      </template>
    </avue-crud>
  </el-dialog>
</template>

<script>
import { avueCrudMixin, dialogComponents } from '@/mixins'
import { getOutboundStatistics as getList } from '@/api/order/order'
import { formatDate, getValueFromObj } from '@/utils'

let currentDate = formatDate(new Date())
let importTime = [currentDate, currentDate]
const tableOption = {
  btn: false,
  menu: false,
  searchSpan: 12,
  column: [
    {
      label: '物流方式',
      prop: 'expressCompanyId',
      slot: true,
      search: true,
      type: 'select'
    },
    {
      label: '导入时间',
      prop: 'importTime',
      hide: true,
      search: true,
      type: 'daterange',
      valueFormat: 'yyyy-MM-dd',
      searchValue: importTime
    },
    {
      label: '数量（单）',
      prop: 'count'
    }
  ]
}
export default {
  mixins: [
    dialogComponents,
    avueCrudMixin({
      getList,
      tableOption
    })
  ],
  data() {
    return {
    
    }
  },
  computed: {
    finalData({ tableData }) {
      return tableData.outboundStatisticsListMap
    },
    statisticalImportTime({ searchForm }) {
      return getValueFromObj(searchForm, 'importTime') || []
    }
  },
  methods: {
  
  }
}
</script>

<style lang="scss">
.outbound-statistics {
  .formPart {
    margin-top: 0;
  }
}
</style>
