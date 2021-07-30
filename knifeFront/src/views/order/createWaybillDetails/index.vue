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
          :logisticsBtn="selectExpressBtn"
        ></screeningOrder>
      </template>
      <template v-slot="{ sup_this }">
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="300px"
        >
          <template slot-scope="{ row, $index }">
            <againApply
              v-if="againApplyBtn"
              :data="row"
              :sup_this="sup_this"
            ></againApply>
            <Print
              :data="row"
              :printId="`print_${$index}`"
              v-p="['order:orderItem:list']"
            />
            <DetailOrEdit
              :sup_this="sup_this"
              :type="1"
              :isNeedOrderCode="isNeedOrderCode"
              :data="row"
              :fedexData="sup_this.fedexData"
              @submit="$refs.OrderBasePage.init()"
              v-p="['order:orderItem:relevanceUpdate']"
            >
              快速编辑
            </DetailOrEdit>
            <!-- <DetailOrEdit
              :type="0"
              :data="row"
              :sup_this="sup_this"
              :fedexData="sup_this.fedexData"
              :menuBtn="false"
              @submit="$refs.OrderBasePage.init()"
            >
              详情
            </DetailOrEdit> -->
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
import againApply from '../module/againApply'
import Print from '../module/print'
import DetailOrEdit from '../module/detailOrEdit'
import OrderBasePage from '../module/orderBasePage'
import CancelOrder from '../module/cancelOrder'
import CancelBatchOrder from '../module/cancelBatchOrder'
import selectExpressCompanyName from '../module/selectExpressCompanyName'
import screeningOrder from '../module/screeningOrder'
import { createWaybillDetailFiled as formField } from '../field'
import { options } from './const'
// console.log('waybillDetailFiled', formField)
export default {
  components: {
    screeningOrder,
    againApply,
    Print,
    DetailOrEdit,
    CancelOrder,
    CancelBatchOrder,
    OrderBasePage,
    selectExpressCompanyName
  },
  data() {
    let option = options[this.$route.path]
    return {
      ...option,
      formField,
      loading: false
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
