<template>
  <section>
    <OrderGroupBasePage
      :cols="cols"
      :formField="formField"
      :status="1"
      :resetMergeData="resetMergeData"
    >
      <template v-slot="{ sup_this }">
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="100px"
        >
          <template slot-scope="{ row }">
            <gotoDetailBtn
              label="详情"
              :row="row"
              :url="goTourl"
            ></gotoDetailBtn>
          </template>
        </el-table-column>
      </template>
    </OrderGroupBasePage>
  </section>
</template>

<script>
import OrderGroupBasePage from '../module/orderGroupBasePage'
import { orderGroupFiled as formField } from '../field'
import { inProductionGroupClos as cols } from '../cols'
import gotoDetailBtn from '../module/gotoDetailBtn'
import { IN_PRODUCTION } from '@/utils/constant'
export default {
  components: {
    OrderGroupBasePage,
    gotoDetailBtn,
  },
  data() {
    return {
      cols,
      formField,
      goTourl: '/order/inProductDetail',
      resetMergeData: {
        orderStatus: IN_PRODUCTION
      }
    }
  },
  methods: {}
}
</script>

<style></style>
