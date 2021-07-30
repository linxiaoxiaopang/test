<template>
  <el-upload
          :action="action"
          :show-file-list="showFileList"
          :auto-upload="true"
          :http-request="requestHandler"
          :on-success="handleSuccess"
          :on-preview="handlePreview"
          v-bind="$attrs"
  >
    <slot>
      <el-button type="primary">点击上传</el-button>
    </slot>
  </el-upload>
</template>

<script>
  import { orderGroupFileUpload } from "@/api/system/file";

export default {
  props: {
    action: {
      type: String,
      default: ''
    },
    showFileList: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {

    };
  },
  methods: {
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
    handleSuccess(res, file, fileList) {
      console.log(res, file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    requestHandler(info) {
      console.log(info);
    },
  },
};
</script>

<style lang="scss">
  .img-edit-dialog {
    .el-col {
      margin-bottom: 20px;
    }
  }
</style>