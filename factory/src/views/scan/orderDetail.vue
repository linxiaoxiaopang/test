<template>
  <section class="app-container back-good-page-wrapper orderDetail">
    <div class="back-good-dialog" @click="printPdf" v-html="errMsg" />
    <el-button
      class="back-good-dialog"
      style="margin-top: 80px"
      size="mini"
      type="text"
      v-if="errMsg && errMsg.indexOf('新单号') >= 0"
      v-copy="`${newOrderWaybill}`"
      v-copy:callback="handleCopied"
    >
      复制
    </el-button>
    <div class="scan-order-title" v-if="type == 0">
      {{ ['扫描查询运单号', '出库'][type] }}
    </div>
    <div class="scan-order-title" style="color: red; font-size: 60px" v-if="type == 1">
      {{ ['扫描查询运单号', '出库'][type] }}
    </div>
    <eHeader
      :type="type"
      :query="query"
      :sup_this="sup_this"
      :canFocus="canFocus"
      @takeCompanyId="takeCompanyId"
      @search="search"
    />
    <Consignee :info="info" />
    <commonTable
      class="common-factory-table"
      :tableLoading="tableLoading"
      :cols="cols"
      :selection="false"
      :infoData="data"
      :span-method="spanMethod"
      height="auto"
      size="mini"
    >
      <template #waybillHeaderSlot="{ scoped: row }">
        <!--<span>运单号</span>-->
        <span class="count">({{ totalProduct }})</span>
      </template>
      <template #waybillSlot="{ scoped: row }">
        <template v-if="row.old_orders && row.old_orders.length">
          <div
            style="text-decoration: line-through; margin-top: 5px"
            :key="index"
            v-for="(o, index) in row.old_orders || []"
          >
            {{ o.old_waybill }}
          </div>
          <div style="color: #ff4949">
            {{ row[row.prop] }}
          </div>
        </template>
        <span v-else>
          {{ row[row.prop] }}
        </span>
        <el-button size="mini" type="text" v-copy="`${row[row.prop]}`" v-copy:callback="handleCopied"> 复制 </el-button>
      </template>
      <template #expressExpireTimeSlot="{ scoped: row }">
        <span :style="expireDirTime(row)" v-if="row.expressExpireTime">
          {{ row.expressExpireTime && $moment(row.expressExpireTime).fromNow() }}
        </span>
        <div v-else style="text-align: center">--</div>
      </template>

      <template #order_statusSlot="{ scoped: row }">
        <el-tag
          style="max-width: 150px; word-break: break-all; display: inline-block; white-space: normal; height: auto"
          :type="tagType(row)"
        >
          {{ status(row) }}
        </el-tag>
      </template>
      <template #sale_dateSlot="{ scoped: row, scoped: { index } }">
        <span>{{ parseDay(row[row.prop]) }}</span>
      </template>
      <template #delivery_timeSlot="{ scoped: row, scoped: { index } }">
        <span>{{ parseTime(row[row.prop]) }}</span>
      </template>
      <template #cover="{ scoped: row, scoped: { prop } }">
        <el-image
          style="width: 80px; height: 80px"
          fit="contain"
          :src="row[prop] | formatUrl"
          :preview-src-list="row[prop] | prvFormatUrl"
        />
      </template>
      <template #fedexSlot="{ scoped: row }">
        <el-tag
          type="primary"
          style="max-width: 150px; word-break: break-all; display: inline-block; white-space: normal; height: auto"
        >
          {{ getLabel('expressCompanyId', row[row.prop]) }}
        </el-tag>
      </template>
      <template #dicSlot="{ scoped: row }">
        {{ getLabel(row.prop, row[row.prop]) }}
      </template>
      <template #weightSlot="{ scoped: row }">
        <span style="color: red; font-size: 40px">
          {{ row[row.prop] || '未称重' }}
        </span>
      </template>

      <template #order_itemsSlot="{ scoped: row }">
        <el-tag
          type="primary"
          size="mini"
          style="margin-right: 5px; margin-bottom: 5px"
          :key="skuItem"
          v-for="skuItem in orderItems(row)"
        >
          {{ skuItem }}
        </el-tag>
      </template>
      <template #remarksSlot="{ scoped: row }">
        <div style="color: red">
          {{ row[row.prop] }}
        </div>
      </template>

      <slot>
        <el-table-column
          label="操作"
          width="180px"
          align="center"
          fixed="right"
          v-if="type == 0 && data[0] && (data[0].orderStatus == 1 || data[0].orderStatus == 4)"
        >
          <template slot-scope="{ row }">
            <el-button type="success" size="mini" @click="printJS(printObj)">打印彩图</el-button>
          </template>
        </el-table-column>
      </slot>
    </commonTable>
    <div v-if="showState" class="state">已出库</div>
    <KnifeList v-if="type === 0" :domData="domData" />
    <eForm :data="data" ref="formTable" />

    <WeightForm
      title="称重"
      v-if="weightDialogVisible"
      @success="handleSuccess"
      :cols="cols"
      :data="data"
      :domData="domData"
      :dialogVisible.sync="weightDialogVisible"
      :query="query"
      :weightWaybill="weightWaybill"
      :sup_this="sup_this"
    />
  </section>
</template>

<script>
import eHeader from './module/header'
import eForm from './module/form'
import WeightForm from './module/weightForm'
import KnifeList from './module/knifeList'
import Consignee from './module/consignee'
import orderMixin from '@/mixins/orderMixin'
import { parseDay, createdSpanMethodId } from '@/utils'
import printJS from 'print-js'
import { mapGetters } from 'vuex'
import { orderQueryCols, orderOutCols } from './cols'
import { scanSearch } from '@/api/order/orderApi'
import { CANCEL as PRO_CANCEL_VAL, FINISH as GOOD_BACKED_VAL } from '@/utils/constant'
import { getLabel } from '@/components/avue/utils/util'
import { validatenull } from '@/components/avue/utils/validate'

const ERR_OBJ = {
  3: '订单已经取消',
  4: '取消发货, 已退回公司。',
  5: '取消发货, 已退回公司。'
}
const QUALITYERRORDER = '订单质检状态异常，请查看下面详情！'
let rowId = ''
export default {
  mixins: [orderMixin],
  components: {
    eHeader,
    eForm,
    WeightForm,
    KnifeList,
    Consignee
  },
  data() {
    return {
      showState: false,
      companyId: 0,
      weightDialogVisible: false,
      canFocus: true,
      data: [],
      tableLoading: false,
      query: {},
      params: {},
      weightWaybill: '',
      sup_this: this,
      errMsg: '',
      newOrderWaybill: '',
      type: this.$route.meta.title === '扫描出库' ? 1 : 0,
      printObj: {
        printable: 'tablePrint',
        type: 'html',
        scanStyles: false,
        maxWidth: '100%',
        documentTitle: '彩图打印单',
        css: ['../../../static/print.css']
      }
    }
  },
  watch: {
    weightDialogVisible(newVal) {
      if (newVal == false) {
        this.canFocus = true
        this.weightWaybill = ''
      }
    }
  },
  computed: {
    ...mapGetters({
      roleType: 'type'
    }),

    cols({ type }) {
      return [orderQueryCols, orderOutCols][type]
    },
    info() {
      return this.data[0] || {}
    },
    orderItems() {
      return (row) => {
        const { order_items = [] } = row || {}
        return order_items.map(({ count, prod_spec }) => {
          return `${prod_spec && prod_spec.SKU} * ${count}`
        })
      }
    },
    domData() {
      const tmpArr = []
      this.data.map((item) => {
        const { orderItemDTOList = [], fedex, ...oRest } = item || {}
        orderItemDTOList?.map((sItem) => {
          const { prod_spec, id: itemId, ...rest } = sItem || {}
          tmpArr.push({
            ...Object.assign({}, prod_spec, rest, oRest, { itemId })
          })
        })
      })
      return tmpArr
    },

    totalProduct() {
      let total = 0
      this.domData.map(({ count }) => {
        total += isNaN(Number(count)) ? 0 : Number(count)
      })
      return total
    }
  },
  beforeCreate() {
    // this.$store.dispatch("GetDic", "expressCompanyId");
  },
  methods: {
    getLabel,
    parseDay,
    printJS,
    handleCopied(val) {
      this.$message.success('复制成功')
    },
    printPdf($event) {
      const { enclosure } = this.data[0] || {}
      if ($event.target.nodeName.toLowerCase() === 'button') {
        printJS({
          printable: enclosure,
          type: 'pdf',
          showModal: true
        })
      }
    },
    handleSuccess() {
      this.showState = true
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      const id = createdSpanMethodId(row)
      let spanNum = 1
      if (columnIndex == 0) {
        row.rowNum = rowIndex
        if (rowIndex == 0) {
          rowId = undefined
        }
      }
      if (columnIndex > 6 && columnIndex < 10) return

      if (rowId == id && row.rowNum == rowIndex) {
        return {
          rowspan: 0,
          colspan: 0
        }
      }
      rowId = id
      row.rowNum = rowIndex + 1
      const data = this.domData
      for (let i = rowIndex + 1; i < data.length; i++) {
        const item = data[i]
        const itemId = createdSpanMethodId(item)
        if (rowId == itemId) {
          spanNum++
        } else {
          break
        }
      }
      return {
        rowspan: spanNum,
        colspan: 1
      }
    },
    beforeInit() {
      const query = this.query
      this.params = {}
      const tmpObj = {}
      this.errMsg = ''
      for (let key in query) {
        if (query[key]) {
          tmpObj[key] = query[key]
        }
      }
      if (Object.keys(tmpObj).length) {
        for (let key in tmpObj) {
          this.params[key] = tmpObj[key]
        }
      }
      return true
    },
    async init(expressWaybillCode) {
      const res = await this.initData()
      this.$nextTick(() => {
        this.query.expressWaybillCode = ''
      })
      if (res === 'false_err') {
        return
      }

      if (!expressWaybillCode && this.type == 1) {
        this.scanOut(this.params)
      }
    },
    async initData() {
      if (!(await this.beforeInit())) {
        return
      }
      this.data = []
      const api = [scanSearch, scanSearch]
      try {
        let { detail = {} } = await api[this.type](this.params)
        if (validatenull(detail)) {
          detail = detail || {}
          setTimeout(() => {
            this.$message.error('查无数据')
          })
          return
        }
        const {
          new_order__waybill,
          expressWaybillCode,
          orderStatus,
          old_orders,
          expressWaybillIsUploaded,
          sale_date,
          expressExpireTime
        } = detail

        this.data = [detail]
        if (this.roleType == 3) {
          ERR_OBJ[3] = '订单已经取消生产'
        }
        if (this.type == 1) {
          ERR_OBJ[5] = '取消发货, 已退回公司'
        }
        if (this.type == 0) {
          ERR_OBJ[5] = '退回公司'
        }

        this.errMsg = ERR_OBJ[orderStatus] || ''

        if (this.type == 1) {
          if (orderStatus == PRO_CANCEL_VAL || orderStatus == GOOD_BACKED_VAL) {
            this.data = []
            throw new Error(this.errMsg)
          }
        }
        if (new_order__waybill) {
          this.newOrderWaybill = new_order__waybill
          return (this.errMsg = `此单号为旧单号，新单号为
             <span>${new_order__waybill}</span>`)
        }
        if (+new Date() - +new Date(expressExpireTime) > 0) {
          if (orderStatus == 1) {
            return (this.errMsg = '订单快递时间已经过期！备注完毕后，将货物退回公司！')
          }
        }
        if ((orderStatus == 1 || (orderStatus == 2 && this.type == 1)) && expressWaybillIsUploaded == 1) {
          this.errMsg = `
          <div style="text-align:center;">
           <div>
              注意！此订单为更换单号！
           </div>
              <button
              type="success"
              class="el-button el-button--success"
              size="mini"
              style="font-size: 30px"
              >打印快递面单</button >
          </div>
          `
        }
      } catch (err) {
        const queryBill = this.query.expressWaybillCode
        if (this.roleType == 3 && err == '该订单已取消') {
          err = `“${queryBill}”:订单已经取消生产`
        }
        this.errMsg = `“${queryBill}”${err}`
        return 'false_err'
      }
    },
    search() {
      this.showState = false
    },
    scanOut(params) {
      this.canFocus = false
      this.weightWaybill = params.expressWaybillCode
      // console.log('scanOut', this.weightWaybill, params);

      this.weightDialogVisible = true
    },
    takeCompanyId(data) {
      this.companyId = data
    }
  }
}
</script>
<style lang="scss" scoped>
.scan-order-title {
  color: $color-primary;
  text-align: center;
  line-height: 2rem;
  padding-bottom: 1rem;
  font-size: 1.25rem;
  font-size: 35px;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid $border-color;
}
.back-good-page-wrapper {
  position: relative;
  .back-good-dialog {
    width: 80%;
    text-align: center;
    position: absolute;
    color: #ff4949;
    font-size: 3rem;
    top: 230px;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
    span {
      position: relative;
      color: $color-primary;
      z-index: 10000;
    }
  }
}
.count {
  color: $color-danger;
}
.dark {
  color: #000;
}
.orderDetail {
  min-height: 600px;
}
.state {
  color: red;
  font-weight: bold;
  font-size: 60px;
  margin-top: 40px;
  text-align: center;
}
</style>
