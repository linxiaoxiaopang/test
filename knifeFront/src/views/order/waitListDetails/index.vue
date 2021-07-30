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
        <screeningOrder :sup_this="sup_this" @screenValue="changeScreenValue" :selectionData="selectionData" :syncDataBtn="true"></screeningOrder>
      </template>
      <template v-slot="{ sup_this }">
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="280px"
        >
          <template slot-scope="{ row, $index }">
            <print
              :data="row"
              :printId="`print_${$index}`"
              :fedexData="sup_this.fedexData"
              v-p="['order:orderItem:list']"
            ></print>
            <detailOrEdit
              :sup_this="sup_this"
              :type="1"
              :data="row"
              :fedexData="sup_this.fedexData"
              @submit="$refs.OrderBasePage.init()"
              v-p="['order:orderItem:relevanceUpdate']"
              >编辑</detailOrEdit
            >
            <cancelOrder
              :data="row"
              :sup_this="sup_this"
              :fedexData="sup_this.fedexData"
              v-p="['order:order:cancel']"
            ></cancelOrder>
          </template>
        </el-table-column>
      </template>
    </OrderBasePage>
  </section>
</template>

<script>
import OrderBasePage from '../module/orderBasePage'
import { orderDetailFiled as formField } from '../field'
import { waitListClos as cols } from '../cols'
import detailOrEdit from '../module/detailOrEdit'
import print from '../module/print'
import cancelOrder from '../module/cancelOrder'
import { WAIT_DISPATCH } from '@/utils/constant'
import screeningOrder from '../module/screeningOrder'
export default {
  components: {
    OrderBasePage,
    detailOrEdit,
    print,
    cancelOrder,
    screeningOrder
  },
  data() {
    return {
      cols,
      formField,
      resetMergeData: {
        orderStatus: WAIT_DISPATCH,
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
