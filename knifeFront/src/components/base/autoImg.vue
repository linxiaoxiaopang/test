<template>
  <div :class="['autoImgComponent', active && 'active']">
    <el-image
      class="active"
      :fit="$attrs.fit || 'contain'"
      :src="src"
      v-bind="$attrs"
      v-on="$listeners"
      crossOrigin="anonymous"
    ></el-image>
    <div class="name" v-if="name">
      {{ name }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    },
    name: {
      type: String
    },
    active: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.autoImgComponent.active {
  box-shadow: 0 0 6px $color-danger inset;
}
.autoImgComponent.active::before {
  content: '已选择';
  position: absolute;
  right: -3px;
  top: 0;
  font-size: 12px;
  color: $color-success;
  z-index: 1;
  background: $color-success;
  color: #fff;
  padding: 4px 3px;
  border-radius: 7px 0px 0px 7px;
  transform: scale(0.6);
}
.autoImgComponent.active {
  .el-image.el-image {
    // background: rgba(0, 0, 0, 0.2);
  }
}
.autoImgComponent {
  position: relative;
  width: 100%;
  padding-top: 100%;
  cursor: pointer;

  .el-image {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border: #f9f9f9 1px solid;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  }
  .name {
    position: absolute;
    bottom: 0;
    height: 1rem;
    width: 100%;
    line-height: 1rem;
    font-size: 12px;
    padding: 0 5px;
    @include overflow;
    color: #fff;
    background: rgba($color: #000000, $alpha: 0.5);
    text-align: center;
    border-radius: 4px 4px 0 0;
  }
}
</style>
