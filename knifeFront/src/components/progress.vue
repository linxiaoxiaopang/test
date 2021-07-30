<template>
  <div class="progressComponent" :style="commonStyle">
    <el-progress
      :type="$attrs.type || 'circle'"
      v-bind="$attrs"
      v-on="$listeners"
    ></el-progress>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    commonStyle: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style lang="scss" scoped>
.progressComponent {
  position: relative;
  width: 100px;
  height: 100px;
  .el-progress {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: rgb(0, 0, 0, 0.5);
    ::v-deep {
      .el-progress-circle {
        width: 100% !important;
        height: 100% !important;
      }
      .el-progress__text {
        color: #fff;
      }
    }
  }
}
</style>