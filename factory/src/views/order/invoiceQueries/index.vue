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
      <template #header="{ row }">
        <div class="statistical">
          <span>{{ statisticalImportTime[0] }} 至 {{ statisticalImportTime[1] }}</span>
          <span>总共{{ statisticalLength }}条订单，</span>
          <span>已发货{{ statistical[DELIVER] }}条,</span>
          <span>生产中{{ statistical[IN_PRODUCTION] }}条,</span>
          <span>已过期{{ statistical[EXPIRED] }}条</span>
        </div>
      </template>
      <template #productInfo="{ row }">
        <div v-if="!row.isHeader" class="align-center">
          <div class="flex-middle">
            <el-image
              :src="row.productShowCover"
              :preview-src-list="[row.productShowCover]"
              style="width: 50px; height: 50px"
              class="h100 mr5"
            >
              <div slot="error" class="image-slot">
                <img src="@/assets/images/default.png" width="50" height="50" alt="" class="block" />
              </div>
            </el-image>
            <div class="nowrap">
              <div>{{ row.productCnName }}</div>
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
      <template #importTime="{ row }">
        <div>下单时间：{{ row.importTime || '暂无' }}</div>
        <div>发货时间：{{ row.deliveryTime|| '暂未发货' }}</div>
      </template>

      <template #menu="{ row }">
        <el-button type="text" @click="showOrderDetail(row)">查看详情</el-button>
        <span>
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
import { DELIVER, IN_PRODUCTION, EXPIRED, ORDER_STATUS_LIST } from '@/utils/constant/businessConst'
import { validatenull } from '@/components/avue/utils/validate'
import { tableOption } from './tablePartData'
import orderDetile from '@/views/order/orderDetile'
import { getDeliveryList as getList, orderExport, getDeliveryOfStatistical } from '@/api/order/order'
import { avueCrudMixin } from '@/mixins'
import saveAs from 'jszip/vendor/FileSaver.js'
import { initCallBack } from '@/utils/download'
import { formatDate } from '@/utils/index'
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
      selected: [],
      statistical: {},
      statisticalLength: 0,
      statisticalImportTime: '',
      DELIVER,
      IN_PRODUCTION,
      EXPIRED
    }
  },
  computed: {
    resetMergeData() {
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
        isReturnRelatedData: 1 // 是否返回订单orderItemDTOList：0不返回，1返回
      }
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
                orderItem.deliveryTime = row.deliveryTime
                orderItem.expressWaybillIsUploaded = row.expressWaybillIsUploaded
                orderItem.factoryStatus = ORDER_STATUS_LIST[row.orderStatus]
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
      this.selected = selection.map((item) => item.orderId)
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
          return [1, 7]
        } else if (columnIndex === 0) {
          return [1, 1]
        } else {
          return [0, 0]
        }
      } else if (columnIndex > 1 && this.orderSortById[row.orderId]) {
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
    },
    afterInit() {
      this.getStatistical(this.postData)
    },
    getStatistical(data) {
      if (this.statisticalImportTime === this.searchForm.importTime) return
      this.statisticalImportTime = this.searchForm.importTime
      getDeliveryOfStatistical({
        importEndTime: data.importEndTime,
        importStartTime: data.importStartTime
      }).then((res) => {
        const statusList = res.detail.statusList
        this.statistical = {
          [DELIVER]: statusList.filter((item) => item == DELIVER).length,
          [IN_PRODUCTION]: statusList.filter((item) => item == IN_PRODUCTION).length,
          [EXPIRED]: statusList.filter((item) => item == EXPIRED).length
        }
        this.statisticalLength = statusList.length
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.statistical {
  padding-bottom: 20px;
}
</style>
