<template>
  <div class="status-tag-component" :class="[type]">
    <div class="txt-wrapper">
      <span class="txt">
        <slot></slot>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "primary",
    },
  },
};
</script>

<style lang="scss" scoped>
.status-tag-component.primary {
  color: $color-primary;
}
.status-tag-component.danger {
  color: $color-danger;
}
.status-tag-component.success {
  color: $color-success;
}
.status-tag-component.warning {
  color: $color-warning;
}

.status-tag-component.info {
  color: $color-info;
}
.status-tag-component {
  .txt-wrapper {
    position: relative;
    padding-left: 12px;
  }
}
.status-tag-component {
  .txt-wrapper::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
  }
  .txt {
      color: $color-gray;
  }
}
</style>