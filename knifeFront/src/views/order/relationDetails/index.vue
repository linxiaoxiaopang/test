<template>
  <section>
    <OrderBasePage
      ref="OrderBasePage"
      :resetMergeData="resetMergeData"
      :cols="cols"
      :formField="formField"
      :skuList="skuList"
      :status="1"
      :selection="true"
    >
      <template #batchOperation="{ sup_this, selectionData }">
        <screeningOrder
          :sup_this="sup_this"
          :selectionData="selectionData"
        ></screeningOrder>
      </template>
      <template v-slot="{ sup_this }">
        <el-table-column align="center" label="操作" width="200px">
          <template slot-scope="{ row }">
            <detailOrEdit
              :type="1"
              :isNeedOrderCode="2"
              :data="row"
              :isProTable="false"
              :sup_this="sup_this"
              :fedexData="sup_this.fedexData"
              @submit="$refs.OrderBasePage.init()"
              v-p="['order:order:complexUpdate']"
              >快速编辑</detailOrEdit
            >
            <cancelOrder
              :sup_this="sup_this"
              :data="row"
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
import { WAIT_RELATION } from '@/utils/constant'
import { orderDetailFiled as formField } from '../field'
import { orderListClos as cols } from '../cols'
import detailOrEdit from '../module/detailOrEdit'
import cancelOrder from '../module/cancelOrder'
import screeningOrder from '../module/screeningOrder'
export default {
  components: {
    OrderBasePage,
    detailOrEdit,
    cancelOrder,
    screeningOrder
  },
  data() {
    return {
      cols,
      formField,
      skuList: [],
      resetMergeData: {
        isReturnRelatedData: 1,
        orderStatus: WAIT_RELATION,
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
  }
}
</script>

<style></style>
