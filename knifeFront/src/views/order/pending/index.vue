<template>
  <section>
    <OrderBasePage
      :cols="cols"
      :formField="formField"
      :status="1"
      :resetMergeData="resetMergeData"
      :searchTypeOptionKey="searchTypeOptionKey"
      ref="OrderBasePage"
    >
      <template #batchOperation="{ sup_this, selectionData }">
        <screeningOrder
          :sup_this="sup_this"
          @screenValue="changeScreenValue"
          :selectionData="selectionData"
          :logisticsBtn="resetMergeData.orderStatus === orderStatus.WAIT_GENERATE_WAYBILL"
          :orderImportBtn="true"
        >
          <template #orderStatus>
            <div class="order-status-change">
              <div class="item-wrapper">
                <span
                  class="item"
                  :class="{
                    active: resetMergeData.orderStatus === orderStatus.WAIT_GENERATE_WAYBILL
                  }"
                  @click="changeOrderStatus(orderStatus.WAIT_GENERATE_WAYBILL, sup_this)"
                  >待申请运单[{{ orderCount[orderStatus.WAYBILL_NOT_CREATE] }}]</span
                >
                <span
                  class="item"
                  :class="{ active: resetMergeData.orderStatus === orderStatus.WAIT_RELATION }"
                  @click="changeOrderStatus(orderStatus.WAIT_RELATION, sup_this)"
                  >需关联产品订单[{{ orderCount[Number(orderStatus.WAIT_RELATION)] }}]</span
                >
              </div>
            </div>
          </template>
        </screeningOrder>
      </template>
      <template v-slot="{ sup_this }">
        <el-table-column fixed="right" align="center" label="操作" width="280px">
          <template slot-scope="{ row, $index }">
            <Operation :sup_this="sup_this" :row="row" :index="$index" />
          </template>
        </el-table-column>
      </template>
    </OrderBasePage>
  </section>
</template>

<script>
import OrderBasePage from '../module/orderBasePage'
import { orderDetailFiled as formField } from '../field'
import { allListClos as cols } from '../cols'
import { WAIT_RELATION, WAIT_GENERATE_WAYBILL, WAYBILL_NOT_CREATE } from '@/utils/constant'
import screeningOrder from '../module/screeningOrder'
import { mapGetters } from 'vuex'
import Operation from '../operation/index'

export default {
  components: {
    OrderBasePage,
    screeningOrder,
    Operation
  },
  computed: {
    ...mapGetters(['orderCount']),
    searchTypeOptionKey({ resetMergeData: { orderStatus } }) {
      if (orderStatus === WAIT_GENERATE_WAYBILL) {
        return WAYBILL_NOT_CREATE
      }
      return orderStatus
    }
  },
  data() {
    return {
      WAYBILL_NOT_CREATE,
      cols,
      formField,
      orderStatus: {
        WAIT_RELATION,
        WAIT_GENERATE_WAYBILL,
        WAYBILL_NOT_CREATE
      },
      resetMergeData: {
        expressWaybillIsCreated: 0,
        orderStatus: WAIT_GENERATE_WAYBILL,
        isReturnWaybillChangeRecord: 1,
        orderItems: [
          {
            asc: false,
            column: 'id'
          },
          {
            asc: false,
            column: 'import_time'
          }
        ]
      }
    }
  },
  methods: {
    changeScreenValue(data) {
      this.$set(this.resetMergeData, 'orderItems', data)
    },
    changeOrderStatus(status, sup_this) {
      this.resetMergeData.orderStatus = status

      if (status === WAIT_GENERATE_WAYBILL) {
        this.resetMergeData.expressWaybillIsCreated = 0
      } else {
        delete this.resetMergeData.expressWaybillIsCreated
      }

      sup_this.searchChange()
    }
  }
}
</script>
