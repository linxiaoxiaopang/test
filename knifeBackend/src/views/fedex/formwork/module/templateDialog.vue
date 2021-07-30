<template>
  <el-dialog
    title="运费模板设置"
    width="612px"
    :visible.sync="show"
    class="dialog-warpper"
    :before-close="handleClose"
  >
    <div>您确定要停用该物流模板： {{ templateData.templateName }}?</div>
    <div v-if="templateData.shippingMethodList" style="margin-top: 15px">
      以下物流渠道将会停用(需重新选择物流模板启用): {{ disabledTemplate }}
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCanceled">取 消</el-button>
      <el-button :loading="loading" type="primary" @click="handleConfirmed()"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
    },
    templateData: {
      type: Object,
    },
  },
  computed: {
    disabledTemplate() {
      const disabled = this.templateData.shippingMethodList.map((item) => {
        return item;
      });
      return disabled.join("、 ");
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    handleClose() {
      this.handleCanceled();
    },
    handleCanceled() {
      this.$emit("update:show", false);
      this.$message.info("您已取消删除");
    },
    handleConfirmed() {
      this.$emit("handleForbidden");
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-warpper {
  ::v-deep {
    .el-dialog__title {
      font-size: 14px;
      color: #1a1a1a;
    }
    .el-dialog__header {
      height: 52px;
      line-height: 52px;
      padding: 0 0 0 24px;
      border: 1px solid #dcdee0;
    }
  }
}
</style>
