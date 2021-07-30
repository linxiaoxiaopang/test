<template>
  <el-button
    size="mini"
    class="color-btn-component"
    type="text"
    :class="type"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot></slot>
  </el-button>
</template>

<script>
export default {
  props: {
    type: String,
    default: "primary",
  },
};
</script>

<style lang="scss" scoped>
.color-btn-component.primary {
  color: $color-primary;
}
.color-btn-component.danger {
  color: $color-danger;
}
.color-btn-component.success {
  color: $color-success;
}
.color-btn-component.warning {
  color: $color-warning;
}

.color-btn-component.info {
  color: $color-info;
}
</style>