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
          :optionsTypes="[6, 7]"
        ></screeningOrder>
      </template>
      <template v-slot="{ sup_this }">
        <el-table-column fixed="right" align="center" label="操作" width="220px">
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
import { cencelDetailFiled as formField } from '../field'
import { allListClos as cols } from '../cols'
import { CANCEL } from '@/utils/constant'
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
        orderStatus: CANCEL,
        isReturnWaybillChangeRecord: 1,
        orderItems: [
          {
            asc: false,
            column: 'cancel_time'
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
