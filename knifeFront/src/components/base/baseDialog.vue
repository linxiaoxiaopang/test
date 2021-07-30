<template>
  <el-dialog
    v-el-drag-dialog
    class="dialog-component"
    :visible.sync="visible"
    :append-to-body="
      $attrs['append-to-body'] === undefined ? true : $attrs['append-to-body']
    "
    :width="$attrs.width || '75%'"
    :before-close="onCancel"
    :destroy-on-close="true"
    @open="openHandle"
    @close="closeHandle"
    v-bind="$attrs"
  >
    <template slot="title">
      <slot name="title" :visible="visible">
        <div class="dialog-title">{{ $attrs.title || '提示' }}</div>
      </slot>
    </template>
    <div
      class="dialog-body"
      :style="{
        'max-height': maxHeight,
        'min-height': minHeight,
        height,
        overflowY: 'auto',
        overflowX: 'hidden'
      }"
    >
      <slot>this is commonDialong slot</slot>
    </div>
    <span slot="footer" class="dialog-footer">
      <slot name="footer">
        <!-- <el-button type="primary" @click="onSure">确定</el-button> -->
        <el-button @click="onCancel">取 消</el-button>
      </slot>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    height: String,
    maxHeight: String,
    minHeight: String
  },
  data() {
    return {
      visible: this.dialogVisible
    }
  },
  watch: {
    visible(newVal) {
      this.$emit('update:dialogVisible', newVal)
    },
    dialogVisible(newVal) {
      this.visible = newVal
    }
  },
  methods: {
    openHandle() {
      this.$emit('openHandle')
    },
    closeHandle() {
      this.$emit('closeHandle')
    },
    onSure() {
      this.$emit('onSure')
    },
    onCancel() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-component {
  .dialog-title {
    padding: 15px 20px;
    border-bottom: 1px solid $border-color;
    // background: $blue;
    // color: #fff;
    // background: #fff;
    // border-bottom: 1px solid $border-color;
  }
  ::v-deep {
    .el-dialog {
      border-radius: 4px;
      overflow: hidden;
    }
    .el-dialog__header {
      padding: 0;
    }
    .el-dialog__footer {
      // text-align: center;
      padding-bottom: 10px;
      border-radius: 0 0 10px 10px;
    }
    .el-dialog__header {
      padding: 0;
    }
    .dialog-footer {
      margin-top: none;
      border-top: 0;
    }
    .el-dialog__headerbtn {
      top: 15px;
      .el-dialog__close {
        // color: #fff;
      }
    }
  }
}
</style>
<style lang="scss"></style>
