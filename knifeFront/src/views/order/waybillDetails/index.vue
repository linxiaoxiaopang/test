<template>
  <section>
    <OrderBasePage
      ref="OrderBasePage"
      :cols="cols"
      :formField="formField"
      :status="1"
      :resetMergeData="resetMergeData"
    >
      <template #batchOperation="{ sup_this, selectionData }">
        <screeningOrder
          :sup_this="sup_this"
          @screenValue="changeScreenValue"
          :selectionData="selectionData"
          :optionsTypes="[0, 1]"
        ></screeningOrder>
      </template>
      <template v-slot="{ sup_this }">
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="280px"
        >
          <template slot-scope="{ row, $index }">
            <Print
              :data="row"
              :printId="`print_${$index}`"
              v-p="['order:orderItem:list']"
            />
            <DetailOrEdit
              :sup_this="sup_this"
              :type="1"
              :data="row"
              :fedexData="sup_this.fedexData"
              @submit="$refs.OrderBasePage.init()"
              v-p="['order:orderItem:relevanceUpdate']"
            >
              快速编辑
            </DetailOrEdit>
            <CancelOrder
              :data="row"
              :sup_this="sup_this"
              v-p="['order:order:cancel']"
            />
          </template>
        </el-table-column>
      </template>
    </OrderBasePage>
  </section>
</template>
<script>
import Print from '../module/print'
import DetailOrEdit from '../module/detailOrEdit'
import OrderBasePage from '../module/orderBasePage'
import CancelOrder from '../module/cancelOrder'
import { waybillDetailFiled as formField } from '../field'
import { waybillListClos as cols } from '../cols'
import { WAIT_GENERATE_WAYBILL } from '@/utils/constant'
import screeningOrder from '../module/screeningOrder'
export default {
  components: {
    Print,
    DetailOrEdit,
    CancelOrder,
    OrderBasePage,
    screeningOrder
  },
  data() {
    return {
      cols,
      sup_this: this,
      formField,
      resetMergeData: {
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
    }
  }
}
</script>

<style></style>
