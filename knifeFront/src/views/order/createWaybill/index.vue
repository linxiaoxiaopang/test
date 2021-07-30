<template>
  <section>
    <OrderGroupBasePage :cols="cols"
                        :formField="formField"
                        :status="1"
                        :resetMergeData="resetMergeData"
                        :resetUrl="resetUrl"
    >
      <template v-slot="{ sup_this }">
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="180px"
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

import { orderGroupFiled as formField } from "../field";
import { waybillGroupClos as cols } from "../cols";
import { options } from "./const";

import gotoDetailBtn from '../module/gotoDetailBtn'

export default {
  components: {
    OrderGroupBasePage,
    gotoDetailBtn
  },
  data() {
    const option = options[this.$route.path];
    return {
      cols,
      formField,
      ...option
    };
  },
  methods: {
  }
};
</script>

<style></style>
