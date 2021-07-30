<template>
  <section>
    <BaseProductPage :cols="cols" :formField="formField" :resetUrl="resetUrl" :status="0">
      <template v-slot="{ sup_this }">
        <el-table-column fixed="right" align="center" label="操作" width="100px">
          <template slot-scope="{ row }">
            <PutUpShelves :sup_this="sup_this" :data="row" v-p="['prim_prod:check_perfect_info:create']" />
          </template>
        </el-table-column>
      </template>
    </BaseProductPage>
  </section>
</template>

<script>
import BaseProductPage from '../baseProductPage'
import { waitShelvesField as formField } from '../field'
import { waitShelvesCols as cols } from '../cols'
import PutUpShelves from '../module/putUpShelves'
export default {
  name: 'waitShelves',
  components: {
    BaseProductPage,
    PutUpShelves
  },
  data() {
    return {
      cols,
      formField,
      resetUrl: '/api/prim_prod/prim_product?status=0'
    }
  },
  methods: {}
}
</script>

<style></style>
