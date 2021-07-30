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
          :optionsTypes="[2, 3]"
        ></screeningOrder>
      </template>
      <template v-slot="{ sup_this }">
        <el-table-column fixed="right" align="center" label="操作" width="180px">
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
import { expiredDetailFiled as formField } from '../field'
import { allListClos as cols } from '../cols'
import { EXPIRED } from '@/utils/constant'
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
        isReturnRelatedData: 1,
        orderStatus: EXPIRED,
        isReturnWaybillChangeRecord: 1,
        orderItems: [
          {
            asc: false,
            column: 'express_expire_time'
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
