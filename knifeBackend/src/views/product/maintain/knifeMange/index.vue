<template>
  <section>
    <BaseProductPage :cols="cols" :formField="formField" :resetUrl="url">
      <template #tips>
        <el-alert title="上架的尺码无法修改 psd 文件" type="warning" show-icon> </el-alert>
      </template>
      <template>
        <el-table-column fixed="right" align="center" label="操作" width="140px">
          <template slot-scope="{ row }">
            <PsdBtn :data="row" v-if="row.sizes && row.sizes.length" v-p="['create_kl_prod:create']" />
          </template>
        </el-table-column>
      </template>
    </BaseProductPage>
  </section>
</template>

<script>
import BaseProductPage from '../../baseProductPage'
import PsdBtn from './module/psdBtn'

import { knifeMangeField as formField } from '../../field'
import { knifeMangeCols as cols } from '../../cols'
export default {
  name: 'knifeMange',
  components: {
    BaseProductPage,
    PsdBtn
  },
  data() {
    return {
      cols,
      formField,
      url: '/api/prim_prod/prim_prod_info/'
    }
  }
}
</script>

<style lang="scss" scoped>
.el-alert {
  margin-top: -20px;
  margin-bottom: 20px;
}
</style>
