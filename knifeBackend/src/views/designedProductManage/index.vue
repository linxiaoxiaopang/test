<template>
  <section>
    <BasePicListPage
      :cols="cols"
      :formField="formField"
      :status="1"
      resetUrl="/api/product/back_prim_prod"
    >
      <template v-slot:batchOperation="{ sup_this }">
        <BatchOperation
          class="batch-operation-wrapper"
          style="margin-top: 10px"
          v-p="['image:image:disable']"
        >
          <div class="g-left-operation"></div>
        </BatchOperation>
      </template>

      <template v-slot="{ sup_this }">
        <el-table-column fixed="right" align="center" label="操作" width="80px">
          <template slot-scope="{ row }">
            <span class="watch" @click="onWatch(row)">查看详情</span>
          </template>
        </el-table-column>
      </template>
    </BasePicListPage>
    <watchDialog :visible.sync="show" :product="designedProduct" />
  </section>
</template>

<script>
import BasePicListPage from "../picture/basePicListPage";
import { galleryField as formField } from "./field";
import { detail } from "@/api/product/designed";
import { imageListCols as cols } from "../picture/basePicListPage/module/designedDialog/cols";
import watchDialog from "../designedProductManage/module/watchDialog";

export default {
  components: {
    BasePicListPage,
    watchDialog,
  },
  data() {
    return {
      show: false,
      designedProduct: {},
      cols,
      formField,
    };
  },
  methods: {
    async onWatch(data) {
      const { id } = data;
      await detail({ id }).then(({ detail }) => {
        this.designedProduct = detail;
      });
      this.show = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.watch {
  color: #3841db;
  font-size: 14px;
  cursor: pointer;
}
</style>
