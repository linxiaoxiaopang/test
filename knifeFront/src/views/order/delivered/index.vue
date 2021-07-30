<template>
  <section>
    <OrderBasePage
      :cols="cols"
      :formField="formField"
      :status="1"
      :resetMergeData="resetMergeData"
      ref="OrderBasePage"
    >
      <template #batchOperation="{ sup_this, selectionData }">
        <screeningOrder
          :sup_this="sup_this"
          :selectionData="selectionData"
          :cancelBatchBtn="false"
          :optionsTypes="[4, 5]"
        ></screeningOrder>
      </template>
      <template v-slot="{ sup_this }">
        <el-table-column fixed="right" align="center" label="操作" width="150px">
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
import { deliverDetailFiled as formField } from '../field'
import { deliveredListClos as cols } from '../cols'
import { DELIVER } from '@/utils/constant'
import Operation from '../operation/index'
export default {
  components: {
    OrderBasePage,
    screeningOrder,
    Operation
  },
  data() {
    return {
      cols,
      formField,
      resetMergeData: {
        orderStatus: DELIVER,
        isReturnWaybillChangeRecord: 1,
        orderItems: [
          {
            asc: false,
            column: 'delivery_time'
          },
          {
            asc: false,
            column: 'id'
          }
        ]
      }
    }
  }
}
</script>

<style></style>
