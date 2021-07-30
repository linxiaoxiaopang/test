<template>
  <div class="app-container app-flex-col-container orderBasePage">
    <slot name="top" :sup_this="sup_this"></slot>
    <EHeader
      :sup_this="sup_this"
      :query.sync="query"
      :formField="formField"
      :searchTypeOptionKey="$attrs.searchTypeOptionKey"
      :hasOrderState="$attrs.hasOrderState"
      resetOrderProp="orderCode"
    />
    <!-- 批量 -->
    <slot name="batchOperation" :sup_this="sup_this" :selectionData="selectionDataAllArr"></slot>
    <div class="flex-col-content">
      <CommonTable
        ref="CommonTable"
        class="fixed-footer-top"
        @sort-change="sortChange"
        height="100%"
        :tableLoading="tableLoading"
        :cols="cols"
        :infoData="new_data"
        :selection="selection"
        :show-summary="showSummary"
        :summary-method="getSummaries"
        :selectable="selectable"
        @selection-change="handleSelectionChange"
        :spanMethod="tableSpanMethod"
        :row-class-name="tableRowClassName"
        @hook:updated="tableUpdated"
      >
        <!-- 订单信息 -->
        <template #orderCodeSlot="{ scoped: { orderItemDTOList }, scoped }">
          <div v-if="scoped.isTitle">
            <hoverCopy :value="scoped[scoped.prop]">
              订单号：
              <span class="text-primary"> {{ scoped[scoped.prop] }} </span>
            </hoverCopy>
            <span class="ml10"> 业务员：{{ scoped.userName }} </span>
            <span v-if="params.orderStatus === orderStatus.DELIVER" class="ml10"> 包裹重量：{{ scoped.totalWeight }}</span>
          </div>

          <div v-else>
            <!-- 产品信息 -->
            <productInfo
              :data="scoped.orderItemDTOList"
              :orderData="scoped"
              :sup_this="sup_this"
              :skuList="skuList"
            />
          </div>
        </template>
        <!-- 销售总计 -->
        <template #totalSalesSlot="{ scoped }">
          <div>销售金额: {{ parsePrice(scoped.totalPrice) }}</div>
          <div>运费: {{ parsePrice(scoped.externalFreight) }}</div>
          <div>总计: {{ parsePrice(numberAdd([scoped.externalFreight, scoped.totalPrice])) }}</div>
        </template>
        <!-- 货款总计 -->
        <template #totalLoansSlot="{ scoped }">
          <div>产品货款: {{ parsePrice(scoped.internalTotalPrice) }}</div>
          <div>
            <!-- templateFreight初始值为null，为0时表示不在物流方式运费模板重量范围内 -->
            物流运费: {{
              Number(scoped.templateFreight)
                ? parsePrice(scoped.templateFreight)
                : scoped.templateFreight === null ? '- -' : '不在重量范围内'
            }}
          </div>
          <div>
            总计: {{
              Number(scoped.templateFreight)
                ? parsePrice(numberAdd([scoped.internalTotalPrice, scoped.templateFreight]))
                : '- -'
            }}
          </div>
        </template>
        <!-- 收件人及国家 -->
        <template #consigneeCountryCodeSlot="{ scoped }">
          <div>{{ scoped.consigneeName }}</div>
          <div>[{{ scoped.consigneeCountryCode }}]</div>
        </template>
        <!-- 导入时间 -->
        <template #importTimeSlot="{ scoped }">
          <span>{{ parseTime(scoped[scoped.prop]) }}</span>
        </template>
        <!-- 时间 -->
        <template #timeSlot="{ scoped }">
          <div>导入时间：{{ parseTime(scoped.importTime) }}</div>
          <div>发货时间：{{ parseTime(scoped.deliveryTime) }}</div>
        </template>
        <!-- 订单状态 -->
        <template #orderStatusSlot="{ scoped }">
          <span>{{ getOrderStatus(scoped) }}</span>
        </template>
        <!-- 物流信息 -->
        <template #expressCompanyIdSlot="{ scoped }">
          <!-- 没有运单号 -->
          <div v-if="!scoped.expressWaybillCode">
            <!-- 运单申请中 -->
            <div v-if="scoped.expressWaybillIsCreated === 8">
              {{ getLabel('expressCompanyId', scoped[scoped.prop]) }}
            </div>
            <!-- 运单错误 -->
            <div v-else-if="scoped.expressWaybillIsCreated === 9">
              <span>物流:</span> {{ getLabel('expressCompanyId', scoped[scoped.prop]) }}
              <br>
              <span>失败原因:</span> {{ scoped.remark }}
              <br>
              <!-- <againApply :data="scoped" :sup_this="sup_this"></againApply> -->
              <selectExpressCompanyName
                :sup_this="{ selectionDataAllArr: [scoped], init }"
                v-if="scoped.orderStatus === 20"
              >
                重新申请
              </selectExpressCompanyName>
            </div>
            <div v-else>
              <div>待生成运单号</div>
              <selectExpressCompanyName
                :sup_this="{ selectionDataAllArr: [scoped], init }"
                v-if="scoped.orderStatus === 20"
              >
                申请运单号
              </selectExpressCompanyName>
            </div>
          </div>

          <!-- 运单号 -->
          <div v-else>
            <div>
              {{
                scoped.expressShippingMethodCnName ||
                getLabel('expressCompanyId', scoped.expressCompanyId)
              }}
            </div>
            <hoverCopy
              :value="scoped.expressWaybillCode"
              style="color: #3841db; text-indent: -8px"
              v-if="getOrderStatus(scoped) != '运单申请中'" 
              :style="{ color: scoped.orderStatus === 29 ? '#606266' : '#3841db' }"
              >「{{ scoped.expressWaybillCode }}」</hoverCopy
            >
            <!-- 手动导入运单需显示运单到期时间 -->
            <div
              v-if="
                scoped.expressExpireTime &&
                scoped.orderStatus !== 70 &&
                scoped.waybillType === orderStatus.WAYBILL_TYPE_HAND
              "
            >
              {{ detail('expressExpireTime', scoped).includes('前') ? '已到期' : '剩余发货' }}:
              {{ detail('expressExpireTime', scoped).replace(/前|后/, '') }}
            </div>
          </div>
        </template>

        <template #orderItemDTOListSlot="{ scoped }">
          <span>{{ handleProductCount(scoped) }}</span>
        </template>

        <template #dicSlot="{ scoped }">
          <span>{{ getLabel(scoped.prop, scoped[scoped.prop]) }}</span>
        </template>

        <template #expressExpireTimeSlot="{ scoped }">
          <span v-if="scoped[scoped.prop]" :style="expireDirTime(scoped)">
            {{ scoped[scoped.prop] && $moment(scoped[scoped.prop]).fromNow() }}
          </span>
          <div v-else style="text-align: center">----</div>
        </template>

        <template #deliveryTimeSlot="{ scoped }">
          <span>{{ parseTime(scoped[scoped.prop]) }}</span>
        </template>

        <template #expressWaybillCodeSlot="{ scoped }">
          <span>{{ scoped[scoped.prop] }}</span>
        </template>

        <template #changeTimeSlot="{ scoped }">
          <span>{{ parseTime(scoped[scoped.prop]) }}</span>
        </template>

        <template #returnApplyTimeSlot="{ scoped }">
          <span>{{ parseTime(scoped[scoped.prop]) }}</span>
        </template>

        <template #cancelTimeSlot="{ scoped }">
          <span>{{ parseTime(scoped[scoped.prop]) }}</span>
        </template>
        <template #expressWaybillIsUploadedSlot="{ scoped }">
          <span>{{ scoped[scoped.prop] ? '是' : '否' }}</span>
        </template>

        <template #productExternalSkuCodeSlot="{ scoped: { orderItemDTOList }, scoped }">
          <div class="sku-item" v-for="(item, index) in orderItemDTOList" :key="index">
            <span class="skuStyle" style="margin-right: 10px"
              >SKU: {{ item['productExternalSkuCode'] }}</span
            >
            <Relation
              v-if="showRelation(item) "
              :orderData="scoped"
              :data="item"
              :allData="orderItemDTOList"
              :skuList="skuList"
              :sup_this="sup_this"
              v-p="['product:sku_map:relation_sku']"
            />
          </div>
        </template>
        <slot :sup_this="sup_this" class="main-slot"></slot>
      </CommonTable>
    </div>
    <PaginationBar
      ref="paginationBar"
      @refreshTableEventFun="refreshTableEventFun"
      :total="total"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { initDataMixin, momentMixin } from '@/mixins'
import EHeader from '../header'
import Relation from './module/relation'
import {
  ORDER_STATUS_LIST,
  WAIT_GENERATE_WAYBILL,
  DELIVER,
  WAYBILL_TYPE_HAND
} from '@/utils/constant'
import { getValueFromObj, numberAdd, parsePrice, parseTime } from '@/utils'
import { findArray, getLabel } from '@/components/avue/utils/util'
import cloneDeep from 'lodash/cloneDeep'
import ProductInfo from './module/productInfo'
import selectExpressCompanyName from '../selectExpressCompanyName'
import againApply from '../againApply'
import ChangeOrder from '../changeOrder'
import HoverCopy from '@/views/order/module/orderBasePage/module/hoverCopy'
import { initData } from '@/api/data'
export default {
  mixins: [initDataMixin, momentMixin],
  components: {
    // 搜索表单
    EHeader,
    // 关联产品
    Relation,
    // 订单信息
    ProductInfo,
    // 申请运单号/重新申请
    selectExpressCompanyName,
    againApply,
    // 换单按钮
    ChangeOrder,
    // hover时出现复制按钮
    HoverCopy
  },
  props: {
    // 表格列数组
    cols: {
      type: Array,
      required: true
    },
    formField: {
      type: Array,
      // required: true,
      default: () => []
    },
    skuList: {
      type: Array,
      default: () => []
    },
    // 请求参数
    resetMergeData: {
      type: Object,
      default: () => ({})
    },
    // 请求地址
    resetUrl: {
      type: String,
      default: '/order/order/list/'
    },
    // 表格多选列
    selection: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      orderStatus: {
        DELIVER,
        WAYBILL_TYPE_HAND
      },
      ORDER_STATUS_LIST,
      sup_this: this,
      method: 'post',
      // 请求地址
      url: this.resetUrl,
      // 当前订单页选择项
      selectionData: [],
      // 所有订单选择项
      selectionDataAll: {},
      // 当前订单全选
      selectedAll: false
    }
  },
  computed: {
    new_data() {
      const arr = []
      const data = cloneDeep(this.data)
      data.map((item) => {
        arr.push({
          isTitle: true,
          ...item
        })
        arr.push(item)
      })
      return arr
    },
    showSummary({ selection, selectionDataAllArr, selectedAll }) {
      return (selection && selectionDataAllArr.length > 0) || selectedAll
    },
    actualSelectedLen({ selectionDataAll }) {
      let len = 0
      for (const key in selectionDataAll) {
        len += selectionDataAll[key].length
      }
      return len
    },
    selectionDataAllArr({ selectionDataAll }) {
      let tempArr = []
      for (const key in selectionDataAll) {
        tempArr = tempArr.concat(selectionDataAll[key])
      }
      return tempArr
    },
    handleTableCellValue() {
      let handleFns = {
        expressExpireTime: (scoped) => {
          return (scoped.$expressExpireTime = this.$moment(scoped.expressExpireTime).fromNow())
        }
      }
      return (key, scoped) => {
        return handleFns[key](scoped)
      }
    }
  },
  watch: {
    selectedAll(n) {
      this.selectedAllChange(n)
    },
    selectionData: {
      handler(n) {
        if (!this.isPageChange) {
          this.$set(this.selectionDataAll, this.page, n)
        }
      },
      deep: true
    },
    total(n) {
      if (n === 0) {
        this.selectedAllChange(false)
      }
    }
  },
  created() {
    this.initMergeData()
  },
  methods: {
    getLabel,
    parseTime,
    parsePrice,
    numberAdd,
    sortChange({ column, prop, order }) {
      if (order === 'descending') {
        this.initMergeData(prop, true)
      } else {
        this.initMergeData(prop, false)
      }
      this.init()
    },
    goDetail() {
      this.$emit('goDetail')
    },
    initMergeData(prop = 'import_time', asc = false) {
      this.mergeData = Object.assign(
        this.mergeData,
        { isReturnRelatedData: 1 },
        {
          orderItems: [
            {
              asc,
              column: prop.replace(/([A-Z])/g, '_$1').toLowerCase()
            },
            {
              asc: false,
              column: 'id'
            }
          ]
        }
      )
    },
    async getAllData() {
      let [, res] = await awaitWrap(
        initData(
          this.url,
          this.method,
          {
            ...this.params,
            isReturnRelatedData: 0,
            isReturnWaybillChangeRecord: 0,
            page: {
              pageIndex: 1,
              pageSize: 0
            }
          }
        )
      )
      if ($SUC(res)) {
        let allTableData = res.detail || []
        let { selectionDataAll, size } = this
        let len = Math.ceil(allTableData.length / size)
        for (let i = 1; i <= len; i++) {
          this.$set(
            selectionDataAll,
            i,
            allTableData
              .slice((i - 1) * size, i * size)
          )
        }
        // console.log(selectionDataAll)
        return allTableData
      }
      return []
    },
    handleSelectionChange(selection) {
      this.selectionData = selection
    },
    selectedAllChange(n) {
      this.selectedAll = n
      let table = getValueFromObj(this, '$refs.CommonTable.$refs.table')
      if (n) {
        if (this.selectionData.length < this.data.length) {
          table.toggleAllSelection()
        }
      } else {
        this.selectionDataAll = {}
        table.clearSelection()
      }
    },
    initCallBack() {
      let { new_data } = this
      this.$nextTick(function () {
        if (this.isPageChange) {
          ;(this.selectionDataAll[this.page] || []).forEach(({ id }) => {
            let rowIndex = new_data.findIndex(row => row.id === id)
            // console.log(rowIndex, new_data[rowIndex])
            if (rowIndex > -1) this.$refs.CommonTable.$refs.table.toggleRowSelection(new_data[rowIndex], true)
          })
          this.$nextTick(function () {
            clearTimeout(this.isPageChangeTimer)
            this.isPageChangeTimer = setTimeout(() => this.isPageChange = false, 500)
          })
        } else {
          this.selectedAllChange(false)
        }
      })
    },
    handleProductCount(data) {
      const { orderItemDTOList } = data
      let sum = 0
      if (orderItemDTOList) {
        orderItemDTOList.map((item) => {
          sum += item.productCount
        })
      }
      return sum
    },
    showRelation({ productExternalSkuCode, productInternalSkuCode }) {
      return !(productExternalSkuCode && productInternalSkuCode)
    },
    tableSpanMethod({ row, column, rowIndex, columnIndex }) {
      const columnLenth = this.cols.length + 1
      if (row.isTitle) {
        if (columnIndex === 0) {
          return [1, 1]
        } else if (columnIndex === 1) {
          return [1, columnLenth]
        } else {
          return [0, 0]
        }
      } else {
        if (columnIndex === 0) {
          return [1, 0]
        } else if (columnIndex === 1) {
          return [1, 2]
        }
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'row-grey'
      }
      return ''
    },
    selectable(row, index) {
      if (row.isTitle) return true
      return false
    },
    getOrderStatus(scoped) {
      if (scoped.orderStatus == WAIT_GENERATE_WAYBILL) {
        switch (scoped.expressWaybillIsCreated) {
          case 0:
            return '待申请运单'
          case 8:
            return '运单申请中'
          case 9:
            return '运单申请异常'
          default:
            return ''
        }
      }
      return ORDER_STATUS_LIST[scoped.orderStatus]
    },
    // 订单列表 显示 已选中订单数量 方法
    // 使用合计行
    // :show-summary="showSummary"
    // :summary-method="getSummaries"
    tableUpdated() {
      let {
        $refs: { CommonTable: { $refs: { table } = {} } = {} }
      } = this
      if (table) {
        let {
          $el,
          $refs: { headerWrapper, footerWrapper, bodyWrapper, rightFixedWrapper }
        } = table
        let headerHeight = headerWrapper.clientHeight
        let footerHeight = footerWrapper ? footerWrapper.clientHeight : 0
        let bodyHeight = $el.clientHeight - headerHeight - footerHeight

        // 重置表格主体高度
        bodyWrapper.style.height = bodyHeight + 'px'

        // 设置固定列时，也要把固定列里的合计行移至最前面
        if (rightFixedWrapper) {
          let rightFixedBodyWrapper = rightFixedWrapper.getElementsByClassName(
            'el-table__fixed-body-wrapper'
          )[0]
          let rightFixedFooterWrapper = rightFixedWrapper.getElementsByClassName(
            'el-table__fixed-footer-wrapper'
          )[0]
          // 固定列表格行是使用position: absolute;
          // 故使用top、bottom调整合计行位置
          if (rightFixedFooterWrapper) {
            rightFixedFooterWrapper.style.top = headerHeight + 'px'
            rightFixedFooterWrapper.style.bottom = 'auto'
          }
          rightFixedBodyWrapper.style.top =
            footerHeight + headerHeight - (footerWrapper ? 1 : 0) + 'px'
          rightFixedBodyWrapper.style.bottom = '0'
          rightFixedBodyWrapper.style.height = bodyHeight - 10 + 'px'
        }

        if (footerWrapper) {
          // 把合计行移至最前面
          $el.insertBefore(footerWrapper, bodyWrapper)
          // 合并列
          // 合计行无法使用spanMethod合并列
          // 因此采用操作DOM的方式合并 - 除第二列（数据显示列），其它列都设置display: none
          let tds = footerWrapper.getElementsByTagName('td')
          footerWrapper.getElementsByTagName('th')[0].style.display = 'none'
          for (let i = 0, len = tds.length; i < len; i++) {
            tds[i].style.display = 'none'
          }
          let fixedTableFooter = tds[1]
          fixedTableFooter.style.display = ''
          fixedTableFooter.setAttribute('colspan', '9')
        }
      }
    },
    getSummaries({ columns, data }) {
      let { selectionDataAllArr } = this
      return ['', '已选中订单数量: ' + selectionDataAllArr.length]
    },
    // 处理表格单元格显示数据
    detail(key, scoped) {
      let valKey = `$${key}`
      if (scoped[valKey]) return scoped[valKey]
      return this.handleTableCellValue(key, scoped)
    }
  }
}
</script>
<style lang="scss" scoped>
.orderBasePage {
  .skuStyle {
    display: inline-block;
    width: 100px;
  }
  .sku-item {
    border-bottom: 1px solid $border-color;
    padding: 8px 0;
  }
  .sku-item:last-child {
    border-bottom: none;
  }
  ::v-deep {
    .row-grey {
      background-color: #f7f8fa !important;
    }
    .el-dropdown .more-btn {
      color: $--color-primary !important;
    }
  }
  .change-order {
    color: red !important;
  }
}
</style>
