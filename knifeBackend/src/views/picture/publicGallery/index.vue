<template>
  <section>
    <BasePicListPage :cols="cols" :formField="formField" :resetUrl="resetUrl">
      <template v-slot:batchOperation="{ sup_this }">
        <BatchOperation
          class="batch-operation-wrapper"
          style="margin-top: 10px"
        >
          <div class="g-left-operation">
            <UploadImg :sup_this="sup_this" v-p="['image:public_image:create']"/>
            <BulkDisable type="1" :sup_this="sup_this" v-p="['image:public_image:disable']"> 批量下架 </BulkDisable>
          </div>
        </BatchOperation>
      </template>
      <template v-slot="{ sup_this }">
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="280px"
        >
          <template slot-scope="{ row }">
            <ChangeCate :data="row" :sup_this="sup_this" :isPublic="true" v-p="['image:public_image:partial_update']"/>
            <ChangeOriginPic
              :data="row"
              :sup_this="sup_this"
              :isPublic="true"
              v-p="['image:public_image:change_images']"
            />
            <Disable type="1" :data="row" :sup_this="sup_this" v-p="['image:public_image:disable']"></Disable>
          </template>
        </el-table-column>
      </template>
    </BasePicListPage>
  </section>
</template>

<script>
import BasePicListPage from "../basePicListPage";

import { publicGalleryField as formField } from "./field";
import { publicImageListCols as cols } from "./cols";
import UploadImg from "../basePicListPage/module/uploadImg";
import Disable from "../module/disable";
import ChangeCate from "../module/changeCate";
import ChangeOriginPic from "../module/changeOriginPic";
import BulkDisable from "../module/bulkDisable";

export default {
  components: {
    BasePicListPage,
    ChangeOriginPic,
    UploadImg,
    Disable,
    ChangeCate,
    BulkDisable,
  },
  data() {
    return {
      cols,
      formField,
      resetUrl: "/api/image/public_image/",
    };
  },
};
</script>

<style>
</style>