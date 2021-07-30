<template>
  <div class="app-container">
    <avue-crud
      ref="crud"
      class="in-production"
      :data="tableData"
      :option="tableOption"
      :page="tablePage"
      :tableLoading="tableLoading"
      @size-change="sizeChange"
      @current-change="pageChange"
      @search-change="searchChange"
    >
      <template #menu="{ row }">
        <el-button type="text" @click="showOrderDetail(row.id)">查看详情</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button type="text" @click="orderExport(row.id)" v-p="['order:order:export']">再次导出</el-button>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { tableOption } from './tablePartData'
import { produceBatchList as getList } from '@/api/order/produceBatch'
import { orderExport, orderList } from '@/api/order/order'
import { avueCrudMixin, cacheComponentMixin } from '@/mixins'
import saveAs from 'jszip/vendor/FileSaver.js'

export default {
  name: 'inProductionExported',
  mixins: [
    avueCrudMixin({
      getList,
      tableOption
    }),
    // 缓存组件混入
    cacheComponentMixin
  ],
  data() {
    return {
      resetMergeData: {
        orderItems: [
          {
            asc: false,
            column: 'export_time'
          },
          {
            asc: false,
            column: 'id'
          }
        ]
      },
      loading: false
    }
  },
  methods: {
    showOrderDetail(id) {
      // console.log(id)
      this.$router.push({
        path: '/order/inProductionExported/showDetail',
        query: {
          productionBatchId: id
        }
      })
    },
    orderExport(id) {
      this.loading = true
      orderList({
        exportStatus: 1,
        orderItems: [
          {
            asc: false,
            column: 'export_time'
          },
          {
            asc: false,
            column: 'id'
          }
        ],
        isReturnRelatedData: 1,
        productionBatchId: id
      }).then(({ detail }) => {
        const idList = detail.map((item) => item.id)

        if (idList.length === 0) {
          this.$message.warning('该生产批次下无订单！')
          this.loading = false
          return
        }

        orderExport(idList, 0)
          .then((res) => {
            console.log(res)
            saveAs(res, '订单')
            this.$message.success('导出成功')
          })
          .finally(() => {
            this.loading = false
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
