<template>
  <section>
    <OrderBasePage
      :cols="cols"
      :formField="formField"
      :status="1"
      :searchTypeOptionKey="searchTypeOptionKey"
      :resetMergeData="resetMergeData"
      ref="OrderBasePage"
    >
      <template #batchOperation="{ sup_this, selectionData }">
        <screeningOrder
          :sup_this="sup_this"
          @screenValue="changeScreenValue"
          :selectionData="selectionData"
          :syncDataBtn="resetMergeData.orderStatus === orderStatus.WAIT_DISPATCH"
        >
          <template #orderStatus>
            <div class="order-status-change">
              <div class="item-wrapper">
                <span
                  class="item"
                  :class="{ active: resetMergeData.orderStatus === orderStatus.WAIT_DISPATCH }"
                  @click="changeOrderStatus({ status: orderStatus.WAIT_DISPATCH, sup_this })"
                  >申请成功待排单[{{ orderCount[Number(orderStatus.WAIT_DISPATCH)] }}]</span
                >
                <span
                  class="item"
                  :class="{
                    active:
                      resetMergeData.orderStatus === orderStatus.WAIT_GENERATE_WAYBILL &&
                      resetMergeData.expressWaybillIsCreated === 8
                  }"
                  @click="
                    changeOrderStatus({
                      status: orderStatus.WAIT_GENERATE_WAYBILL,
                      sup_this,
                      expressWaybillIsCreated: 8
                    })
                  "
                  >运单申请中[{{ orderCount[Number(orderStatus.WAYBILL_CREATING)] }}]</span
                >
                <span
                  class="item"
                  :class="{
                    active:
                      resetMergeData.orderStatus === orderStatus.WAIT_GENERATE_WAYBILL &&
                      resetMergeData.expressWaybillIsCreated === 9
                  }"
                  @click="
                    changeOrderStatus({
                      status: orderStatus.WAIT_GENERATE_WAYBILL,
                      sup_this,
                      expressWaybillIsCreated: 9
                    })
                  "
                  >运单申请异常[{{ orderCount[Number(orderStatus.WAYBILL_CREATE_ERROR)] }}]</span
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
import {
  WAIT_DISPATCH,
  WAIT_GENERATE_WAYBILL,
  WAYBILL_CREATING,
  WAYBILL_CREATE_ERROR
} from '@/utils/constant'
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
    searchTypeOptionKey({ resetMergeData: { orderStatus, expressWaybillIsCreated = '' } }) {
      return `${orderStatus}${expressWaybillIsCreated}`
    }
  },
  data() {
    return {
      cols,
      formField,
      orderStatus: {
        WAIT_DISPATCH,
        WAIT_GENERATE_WAYBILL,
        WAYBILL_CREATING,
        WAYBILL_CREATE_ERROR
      },
      resetMergeData: {
        orderStatus: WAIT_DISPATCH,
        expressWaybillIsCreated: '',
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
    changeOrderStatus({ status, sup_this, expressWaybillIsCreated }) {
      this.resetMergeData.orderStatus = status
      this.resetMergeData.expressWaybillIsCreated = expressWaybillIsCreated
      sup_this.searchChange()
    }
  }
}
</script>
