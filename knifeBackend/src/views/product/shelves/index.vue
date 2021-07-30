<template>
  <section>
    <BaseProductPage :cols="cols" :formField="formField" :resetUrl="resetUrl" :status="1">
      <template v-slot:batchOperation="{ sup_this }">
        <BatchOperation class="batch-operation-wrapper" style="margin-top: 0">
          <div class="g-left-operation">
            <BulkShelves :sup_this="sup_this" :isOff="isOff" v-p="['prim_prod:prim_product:bulk_off']"/>
          </div>
        </BatchOperation>
      </template>
      <template v-slot="{ sup_this }">
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="100px"
        >
          <template slot-scope="{ row }">
            <OffShelves :sup_this="sup_this" :data="row" :isOff="isOff" v-p="['prim_prod:prim_product:bulk_off']"/>
          </template>
        </el-table-column>
      </template>
    </BaseProductPage>
  </section>
</template>

<script>
import BaseProductPage from "../baseProductPage";

import OffShelves from "../module/offShelves";
import BulkShelves from "../module/bulkShelves";
import { shelvesField as formField } from "../field";
import { shelvesCols as cols } from "../cols";
export default {
  name: "shelves",
  components: {
    BaseProductPage,
    OffShelves,
    BulkShelves,
  },
  data() {
    return {
      cols,
      formField,
      isOff: true,
      resetUrl: '/api/prim_prod/prim_product?status=1'
    };
  },
};
</script>

<style>
</style>