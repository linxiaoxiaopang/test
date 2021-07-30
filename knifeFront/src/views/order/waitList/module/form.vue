<template>
  <BaseDialog :dialogVisible.sync="dialog" width="350px" :title="title">
    <template>
      <BaseForm
        ref="form"
        label-width="60px"
        :cols="formField"
        :form="form"
        :formVisible="dialog"
      >
        <template #attachmentFilePathSlot="{ scoped: { prop } }">
          <div class="common-filed-img-uploadbar-wrapper">
            <el-progress
              v-if="showUploadBar"
              type="circle"
              :color="customColors"
              :percentage="percentage"
            ></el-progress>
            <FileUpload
              class="fileUpload"
              ref="imgUpload"
              action="#"
              :limit="1"
              :files.sync="form[prop]"
            >
            </FileUpload>
          </div>
          <span style="color: #ff4949">请上传小于100M的面单文件</span>
        </template>
      </BaseForm>
    </template>
    <template #footer>
      <LoadingBtn type="primary" @click="doSubmit"> 确认 </LoadingBtn>
      <LoadingBtn @click="cancel"> 取消 </LoadingBtn>
    </template>
  </BaseDialog>
</template>
<script>
import FileUpload from "@/components/fileUpload/fileUpload";
import { uploadBarMixin, commonFromMixin } from "@/mixins";
import { enclosureFiled as formField } from "./field";
// import { uploadFile } from "@/api/order/orderListUp";
import { orderGroupFileUpload,systemFileUpload } from "@/api/system/file";
import { orderGroupUpdate } from "@/api/order";
import JSZip from "jszip";
export default {
  mixins: [uploadBarMixin, commonFromMixin],
  components: {
    FileUpload,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      formField,
      dialog: this.dialogVisible,
      form: {
        attachmentFilePath: [],
      },
    };
  },

  methods: {
    // async doSubmit() {
    //   const valid = await this.$refs["form"].validate();
    //   if (!valid) return;
    //   const attachment = this.form.attachmentFilePath[0];
    //   const { name = "" } = attachment || {};
    //   const whiteName = ["zip", "rar", "ZIP", "RAR"];
    //   const suffix = name.slice(name.lastIndexOf(".") + 1);
    //   const formatName = name.slice(0, name.lastIndexOf(".")) + ".zip";
    //   if (!whiteName.includes(suffix)) {
    //     const zip = new JSZip();
    //     zip.file(name, attachment);
    //     this.form.attachmentFilePath = await zip
    //       .generateAsync({ type: "blob" })
    //       .then(function (content) {
    //         return [new File([content], formatName, { type: "zip" })];
    //       });
    //   }
    //   await this.doEdit();
    // },
    async doSubmit() {
      const valid = await this.$refs["form"].validate();
      if (!valid) return;
      const attachment = this.form.attachmentFilePath[0];
      const { name = "" } = attachment || {};
      const whiteName = ["zip", "ZIP"];
      const suffix = name.slice(name.lastIndexOf(".") + 1);
      if (!whiteName.includes(suffix)) {
        return this.$message.warning('请上传.zip的压缩文件')
      }
      await this.doEdit();
    },
    async getUploadPath() {
      const formData = new FormData();
      formData.append("file", this.form.attachmentFilePath[0]);
      formData.append("id", this.form.id);
      const { code, detail } = await orderGroupFileUpload({
        data: formData,
        onUploadProgress: this.progressFunc,
      });
      if ($SUC({ code })) {
        return detail;
      }
      return false;
    },
    async doEdit() {
      const { id } = this.form;
      const path = await this.getUploadPath();
      if (!path) return;
      const { code } = await orderGroupUpdate({
        attachmentFilePath: path,
        id,
      });
      if ($SUC({ code })) {
        this.sup_this && this.sup_this.init();
        this.$message.success("操作成功");
      }
    },
  },
};
</script>