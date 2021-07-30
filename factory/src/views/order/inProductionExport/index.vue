<template>
  <div class="app-container">
    <avue-crud
      ref="crud"
      class="in-production in-production-export"
      :data="finalData"
      :option="tableOption"
      :page="tablePage"
      :tableLoading="tableLoading"
      :row-class-name="tableRowClassName"
      :span-method="spanMethod"
      @size-change="sizeChange"
      @current-change="pageChange"
      @search-change="searchChange"
      @hook:updated="initCallBack"
      @selection-change="handleSelectionChange"
    >
      <template #productInfo="{ row }">
        <div v-if="!row.isHeader" class="align-center">
          <div class="flex-middle">
            <el-image
              :src="row.productShowCover"
              :preview-src-list="[row.productShowCover]"
              style="width: 50px; height: 50px"
              class="h100 mr5"
            >
              <img slot="error" src="@/assets/images/default.png" width="50" height="50" alt="" class="block" />
            </el-image>
            <div class="flex-one">
              <div>标题: {{ row.productCnName }}</div>
              <div>款式: {{ row.productStructName }}</div>
              <div>尺码: {{ row.productSizeName }}</div>
            </div>
          </div>
        </div>
        <div v-else>
          <span class="mr15">订单号: {{ row.orderCode }}</span>
          <span class="mr15">运单号: {{ row.expressWaybillCode }}</span>
          <span class="mr15">收货人: {{ row.consigneeName }}</span>
          <span class="mr15">物流方式: {{ getLabel('expressCompanyId', row.expressCompanyId) }}</span>
        </div>
      </template>
      <template #expressExpireTime="{row}">
        {{row.expressExpireTime  && $moment(row.expressExpireTime).fromNow()}}
      </template>
      <template #menuLeft>
        <el-button v-if="!isExported" size="mini" type="primary" @click="orderExport" v-p="['order:order:export']"
          >导出订单
        </el-button>
      </template>
      <template #menu="{ row }">
        <el-button type="text" size="mini" @click="showOrderDetail(row)">查看详情</el-button>
        <span v-if="isExported">
          <!--<span v-if="isExported">
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" size="mini" @click="$router.push('/order/inProductionExported/viewDetails')">查看明细</el-button>
          </span>-->
          <el-divider direction="vertical"></el-divider>
          <color-text-btn>
            <a class="thunder-link" :href="row.knifeLayoutPath"> 下载刀版图 </a>
          </color-text-btn>
        </span>
      </template>
    </avue-crud>

    <order-detile :visible.sync="orderDetailDialogVisible" :data="orderDetailData"></order-detile>
  </div>
</template>

<script>
import { IN_PRODUCTION } from '@/utils/constant/businessConst'
import { validatenull } from '@/components/avue/utils/validate'
import { tableOption } from './tablePartData'
import orderDetile from '@/views/order/orderDetile'
import { orderList as getList, orderExport } from '@/api/order/order'
import { avueCrudMixin } from '@/mixins'
import saveAs from 'jszip/vendor/FileSaver.js'
import { initCallBack } from '@/utils/download'

export default {
  components: {
    orderDetile
  },
  mixins: [
    avueCrudMixin({
      getList,
      tableOption
    })
  ],
  data() {
    return {
      finalData: [],
      orderDetailData: {},
      orderDetailDialogVisible: false,
      orderSortById: {},
      selected: []
    }
  },
  computed: {
    resetMergeData() {
      let more = {
        orderStatus: IN_PRODUCTION, // 订单状态 - 生产中
        exportStatus: 0 // 是否已经导出报关订单数据 0 未导出  1-已导出
      }
      if (this.isExported) {
        more = {
          exportStatus: 1,
          productionBatchId: this.$route.query.productionBatchId
        }
      }
      return {
        orderItems: [
          {
            asc: false,
            column: 'import_time'
          },
          {
            asc: false,
            column: 'id'
          }
        ],
        isReturnRelatedData: 1, // 是否返回订单orderItemDTOList：0不返回，1返回
        ...more
      }
    },
    isExported() {
      let exportedPath = ['/order/inProductionExported/showDetail']
      return exportedPath.includes(this.$route.path)
    }
  },
  watch: {
    tableData: {
      handler(n, o) {
        if (n !== o) {
          this.finalData = []
          n.map((row) => {
            row.isHeader = true
            row.productNum = 0
            this.finalData.push(row)

            let orderItemDTOList = row.orderItemDTOList
            if (!validatenull(orderItemDTOList)) {
              row.productNum = orderItemDTOList.length

              orderItemDTOList.forEach((orderItem) => {
                orderItem.userName = row.userName
                orderItem.importTime = row.importTime
                orderItem.expressExpireTime = row.expressExpireTime
                orderItem.expressWaybillIsUploaded = parseFloat(row.expressWaybillIsUploaded) || row.waybillChangeStatus
                orderItem.factoryStatus = `${row.orderStatus}${row.exportStatus}`
              })

              this.finalData = this.finalData.concat(orderItemDTOList)
            }
          })
        }
      },
      deep: true
    }
  },
  methods: {
    initCallBack,
    orderExport() {
      if (this.selected.length === 0) {
        this.$message.error('请先选择订单')
        return
      }
      orderExport(this.selected, 1).then((res) => {
        saveAs(res, '订单')
        this.$message.success('导出成功')
        this.init()
      })
    },
    handleSelectionChange(selection) {
      this.selected = selection.map((item) => item.id)
    },
    showOrderDetail(row) {
      this.orderDetailData = this.orderSortById[row.orderId].row
      this.orderDetailDialogVisible = true
    },
    spanMethod({ row, rowIndex, columnIndex }) {
      if (row.isHeader) {
        this.orderSortById[row.id] = {
          row,
          rowspan: row.productNum, // 合并行数
          currentRowIndex: null // 合并当前行序号
        }
        if (columnIndex === 1) {
          return [1, 8]
        } else if (columnIndex === 0) {
          return [1, 1]
        } else {
          return [0, 0]
        }
      } else if (columnIndex > 2 && this.orderSortById[row.orderId]) {
        if (
          this.orderSortById[row.orderId].currentRowIndex === rowIndex ||
          this.orderSortById[row.orderId].currentRowIndex === null
        ) {
          this.orderSortById[row.orderId].currentRowIndex = rowIndex
          return [this.orderSortById[row.orderId].rowspan, 1]
        } else {
          return [0, 0]
        }
      }
    },
    tableRowClassName({ row }) {
      if (row.isHeader) {
        return 'table-title'
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
