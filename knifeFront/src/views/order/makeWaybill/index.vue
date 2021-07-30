<template>
  <section>
    <OrderGroupBasePage :cols="cols" :formField="formField" :status="1" :resetMergeData="resetMergeData">
      <template v-slot="{ sup_this }">
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="180px"
        >
          <template slot-scope="{ row }">
              <waybillUp :sup_this="sup_this" :row="row" v-p="['order:order:batchWaybill']"></waybillUp>
              <gotoDetailBtn label='详情' :row="row" :url="goTourl"></gotoDetailBtn>
          </template>
        </el-table-column>
      </template>
    </OrderGroupBasePage>
  </section>
</template>

<script>
import OrderGroupBasePage from "../module/orderGroupBasePage";

import { orderGroupFiled as formField } from "../field";
import { waybillGroupClos as cols } from "../cols";

import waybillUp from './module/waybillUp'
import gotoDetailBtn from '../module/gotoDetailBtn'

import { WAYBILL_CODE_UPLOADED_NO, WAIT_GENERATE_WAYBILL } from "@/utils/constant";


export default {
  components: {
    OrderGroupBasePage,
    waybillUp,
    gotoDetailBtn
  },
  data() {
    return {
      cols,
      formField,
      goTourl: '/order/waybillDetails',
      resetMergeData: {
        orderStatus: WAIT_GENERATE_WAYBILL,
        isWaybillCodeUploaded: WAYBILL_CODE_UPLOADED_NO,
        isReturnWaybillChangeRecord: 1
      },
    };
  },
  methods: {
  }
};
</script>

<style></style>
