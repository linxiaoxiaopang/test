<template>
  <div class="colorComponent">
    <div class="title">顔色</div>
  <ColorSketchPicker v-model="value" :class="['sketch-picker', customClass]" :disableAlpha="true" />
  </div>
</template>

<script>
import ColorSketchPicker from '@/components/colorSketchPicker'
export default {
  components: {
    ColorSketchPicker,
  },
  props: {
    customClass: String,
    colors: {
      type: [Object, String],
      default: '#ffffff'
    },
  },

  data() {
    return {
      // value: '#FFAF4141',
      value: this.colors,
    };
  },
  watch: {
    value: {
      handler(newVal) {
        this.$emit("onColorChange", newVal);
        // this.$emit('update:colors', newVal.hex)
        this.$emit('update:colors', newVal.rgba)
      },
      deep: true,
    },
  
  },
};
</script>

<style lang="scss" scoped>
.colorComponent {

  .title {
    text-align: left;
    margin-bottom: 10px;
    color: $color-gray;
  }
  .sketch-picker {
    width: 100%;
    box-sizing: border-box;
  }
  ::v-deep {
    .vc-sketch {
      box-shadow: none;
    }
  }
}
</style>