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
          @screenValue="changeScreenValue"
          :selectionData="selectionData"
        ></screeningOrder>
      </template>
      <template v-slot="{ sup_this }">
        <el-table-column align="center" label="操作" width="160px">
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
import { IN_DISPATCH } from '@/utils/constant'
import screeningOrder from '../module/screeningOrder'
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
        orderStatus: IN_DISPATCH,
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
    }
  }
}
</script>

<style></style>
