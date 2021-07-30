<template>
  <section>
    <OrderGroupBasePage
      :cols="cols"
      :formField="formField"
      :status="1"
      :resetMergeData="resetMergeData"
    >
      <template v-slot:batchOperation="{ sup_this }">
        <PushGroup  :sup_this="sup_this" />
      </template>

      <template v-slot="{ sup_this }">
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="150px"
        >
          <template slot-scope="{ row }">
            <Upload :sup_this="sup_this" :data="row" @success="uploadSuccess" v-p="['order:importGroup:uploadWaybill']" />
            <gotoDetailBtn
              label="详情"
              :row="row"
              :url="goTourl"
            ></gotoDetailBtn>
          </template>
        </el-table-column>
      </template>
    </OrderGroupBasePage>
  </section>
</template>

<script>
import OrderGroupBasePage from "../module/orderGroupBasePage";
import Upload from "./module/upload";
import PushGroup from "../module/pushGroup";
import { waitGroupFiled as formField } from "../field";
import { waitGroupClos as cols } from "../cols";

import gotoDetailBtn from "../module/gotoDetailBtn";

import {
  WAYBILL_CODE_UPLOADED_YES,
  ATTACHMENT_UPLOAD,
  WAIT_DISPATCH,
} from "@/utils/constant";
import { orderGroupUpdate } from "@/api/order";

export default {
  components: {
    OrderGroupBasePage,
    Upload,
    gotoDetailBtn,
    PushGroup,
  },
  data() {
    return {
      cols,
      formField,
      goTourl: "/order/waitListDetails",
      resetMergeData: {
        orderStatus: WAIT_DISPATCH,
        isWaybillCodeUploaded: WAYBILL_CODE_UPLOADED_YES,
      },
    };
  },
  methods: {
    uploadSuccess(res, row) {
      row.attachmentFilePath = res.detail;
      row.isAttachmentUploaded = ATTACHMENT_UPLOAD;
      orderGroupUpdate(row).then((res) => {
        console.log("orderGroupUpdate", res);
      });
    },
  },
};
</script>

<style></style>
