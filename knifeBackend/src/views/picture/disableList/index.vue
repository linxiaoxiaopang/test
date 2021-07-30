<template>
  <section>
    <BasePicListPage
      :resetUrl="resetUrl"
      :cols="cols"
      :formField="formField"
      :status="1"
    >
      <template v-slot="{ sup_this }">
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="100px"
        >
          <template slot-scope="{ row }">
            <Disable :data="row" :sup_this="sup_this" v-p="['image:image:cancel_disable']"></Disable>
          </template>
        </el-table-column>
      </template>
    </BasePicListPage>
  </section>
</template>

<script>
import BasePicListPage from "../basePicListPage";
import { galleryField as formField } from "./field";
import { imageListCols as cols } from "./cols";
import Disable from "../module/disable";

export default {
  components: {
    BasePicListPage,
    Disable
  },
  data() {
    return {
      cols,
      formField,
      resetUrl: "/api/image/image/?disable=1",
    };
  },
};
</script>

<style>
</style>