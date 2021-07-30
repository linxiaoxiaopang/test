<template>
  <section>
    <BaseProductPage :cols="cols" :formField="formField" :resetUrl="resetUrl" :status="2">
      <template v-slot="{ sup_this }">
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="180px"
        >
          <template slot-scope="{ row }">
             <RecoveryShelves :sup_this="sup_this" :data="row" prefix="恢复" :isOff="false" v-p="['prim_prod:prim_product:put_on']"/>
          </template>
        </el-table-column>
      </template>
    </BaseProductPage>
  </section>
</template>

<script>
import BaseProductPage from "../baseProductPage";
import RecoveryShelves from "../module/recoveryShelves";
import { unShelvesField as formField } from "../field";
import { unShelvesCols as cols } from "../cols";
export default {
  name: "unShelves",
  components: {
    BaseProductPage,
    RecoveryShelves
  },
  data() {
    return {
      cols,
      formField,
      resetUrl: '/api/prim_prod/prim_product?status=2&sort=-off_time'
    };
  },
};
</script>

<style>
</style>