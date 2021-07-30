<template>
  <section>
    <BasePicListPage :cols="cols" :formField="formField" :status="1">
      <template v-slot:batchOperation="{ sup_this }">
        <BatchOperation class="batch-operation-wrapper" style="margin-top: 10px" v-p="['image:image:disable']">
          <div class="g-left-operation">
            <BulkDisable :sup_this="sup_this" />
          </div>
        </BatchOperation>
      </template>

      <template v-slot="{ sup_this }">
        <el-table-column fixed="right" align="center" label="操作" width="100px">
          <template slot-scope="{ row }">
            <Disable
              :data="row"
              :sup_this="sup_this"
              v-p="['image:image:disable', 'image:image:cancel_disable']"
            ></Disable>
          </template>
        </el-table-column>
      </template>
    </BasePicListPage>
  </section>
</template>

<script>
import BasePicListPage from '../basePicListPage'
import { galleryField as formField } from './field'
import { imageListCols as cols } from './cols'
import Disable from '../module/disable'
import BulkDisable from '../module/bulkDisable'

export default {
  components: {
    BasePicListPage,
    Disable,
    BulkDisable
  },
  data() {
    return {
      cols,
      formField
    }
  }
}
</script>

<style></style>
