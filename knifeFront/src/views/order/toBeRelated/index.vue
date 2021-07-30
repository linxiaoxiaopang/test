<template>
  <section>
    <OrderGroupBasePage
      :resetMergeData="resetMergeData"
      :cols="cols"
      :formField="formField"
      :status="1"
      :selection="false"
    >
      <template v-slot="{ sup_this }">
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="100px"
        >
          <template slot-scope="{ row }">
            <gotoDetailBtn label='详情' :row="row" :url="goTourl"></gotoDetailBtn>
          </template>
        </el-table-column>
      </template>
    </OrderGroupBasePage>
  </section>
</template>

<script>
import OrderGroupBasePage from "../module/orderGroupBasePage";
import gotoDetailBtn from '../module/gotoDetailBtn'

import { orderGroupFiled as formField } from "../field";
import { orderGroupClos as cols } from "../cols";
import { WAIT_RELATION } from "@/utils/constant";

export default {
  components: {
    OrderGroupBasePage,
    gotoDetailBtn
  },
  data() {
    return {
      cols,
      formField,
      resetMergeData: {
        orderStatus: WAIT_RELATION,
      },
      goTourl: '/order/relationDetails'
    };
  },
  methods: {

  },
};
</script>

<style></style>
