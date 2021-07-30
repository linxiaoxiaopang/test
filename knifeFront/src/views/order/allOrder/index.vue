<template>
  <section>
    <OrderBasePage
      :cols="cols"
      :formField="formField"
      :status="1"
      :hasOrderState="true"
      :resetMergeData="resetMergeData"
      ref="OrderBasePage"
    >
      <template #batchOperation="{ sup_this, selectionData }">
        <screeningOrder
          :sup_this="sup_this"
          :cancelBatchBtn="hasCancelBatchBtn(sup_this.query)"
          @screenValue="changeScreenValue"
          :selectionData="selectionData"
          :orderImportBtn="true"
        ></screeningOrder>
      </template>
      <template v-slot="{ sup_this }">
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="160px"
        >
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
import screeningOrder from '../module/screeningOrder'
import { orderDetailFiled as formField } from '../field'
import { allListClos as cols } from '../cols'
import Operation from '../operation/index'
import {
  CANCEL,
  IN_PRODUCTION,
  DELIVER,
  EXPIRED,
  RETURN_GOODS
} from '@/utils/constant'

export default {
  components: {
    OrderBasePage,
    screeningOrder,
    Operation
  },

  data() {
    return {
      CANCEL,
      IN_PRODUCTION,
      DELIVER,
      EXPIRED,
      RETURN_GOODS,
      cols,
      formField,
      resetMergeData: {
        orderStatus: '',
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
    hasCancelBatchBtn(query) {
      return (
        ![CANCEL, IN_PRODUCTION, DELIVER, EXPIRED, RETURN_GOODS].includes(
          query.orderStatus
        ) &&
        query.waybillChangeStatusList &&
        !query.waybillChangeStatusList.every((item) => [1, 2].includes(item))
      )
    }
  }
}
</script>

<style></style>
