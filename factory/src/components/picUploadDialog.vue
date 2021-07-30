<template>
  <BaseDialog
    class="picUploadDialogComponent"
    :width="$attrs.width || '80%'"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template>
      <div class="upload-box">
        <el-upload
          drag
          multiple
          class="upload-demo"
          action="#"
          :disabled="!checked"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="handleChange"
          @click.native="uploadClickHandler"
        >
          <div slot="trigger" class="trigger">
            <div class="el-icon-upload" />
            <span class="tip"
              >将图片拖放到此处上传，或点击<span>上传</span></span
            >
            <div class="tip">
              为了保证图片的正常使用，仅支持30M以内jpg、jpeg、
              png格式图片上传。支持多张图片<span class="light">上传</span>
            </div>
          </div>
        </el-upload>
        <el-checkbox v-model="checked"
          >上博图片威和文字时不得存在涉改涉黄、侵权等违法行为，
          情节严重的将子以封导处理，感谢您的配合。我已经阅读并同意此协议《<router-link
            to="/"
            @click.prevent
          >
            法律声明 </router-link
          >》</el-checkbox
        >
      </div>
    </template>
    <template #footer>
      <span></span>
    </template>
  </BaseDialog>
</template>

<script>
export default {
  data() {
    return {
      checked: true,
    };
  },
  methods: {
    uploadClickHandler() {
      if (!this.checked) {
        this.$message.warning("请先阅读并同意法律声明协议");
      }
    },
    handleChange(file, fileList) {
      this.timer&&clearTimeout(this.timer)
      this.timer =  setTimeout(() => {
        this.$emit("picsReadyHandler", fileList);
        this.$emit("update:dialogVisible", false);
      }, 50);
    },
  },
};
</script>

<style lang="scss" scoped>
.picUploadDialogComponent {
  .trigger {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    padding-bottom: 50px;
    .el-icon-upload {
      display: block;
      font-size: 200px;
      line-height: 1;
    }
    .tip {
      margin-top: 20px;
      word-break: break-all;
      .light {
        color: $color-primary;
      }
    }

    a {
      color: $color-primary;
    }
  }
  .el-checkbox {
    width: 100%;
    position: absolute;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin-top: 10px;
    margin-top: -30px;
  }
  ::v-deep {
    .el-upload {
      width: 100%;
      // height: 40vh;
    }
    .el-upload:focus {
      color: #606266;
    }
    .el-upload-dragger {
      width: 100%;
      height: 100%;
    }
    .el-dialog__body {
      padding: 10px;
    }
    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #606266;
    }
    .el-checkbox__label {
      word-break: break-all;
      white-space: normal;
      position: relative;
      top: -2px;
    }
  }
}
</style>