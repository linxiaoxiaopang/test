<template>
  <div class="designBgColorComponent">
    <Color :colors.sync="value" @onColorChange="setBackgroundColor"/>
  </div>
</template>

<script>
import Color from "@/components/color";
import { fabricInstanceMixin } from "../../mixins";
export default {
  inject: ["canvasModifiedHandler"],
  mixins: [fabricInstanceMixin],
  components: {
    Color,
  },
  data() {
    return {
      value: "rgb(255, 255, 255)",
    };
  },
  methods: {
    setBackgroundColor() {
      let color = this.value;
      if (!this.instance) return;
      const rgb =
        typeof color === "string"
          ? color
          : `rgb(${color.r}, ${color.g}, ${color.b})`;

      this.instance.setBackgroundColor(rgb);
      this.canvasModifiedHandler();

      this.SET_FABRIC_NO_UPDATE(true);
      setTimeout(() => {
        this.SET_FABRIC_NO_UPDATE(false);
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.designBgColorComponent {
  margin-top: 30px;
  padding: 0 10px;
  .el-button {
    margin-top: 20px;
    margin-left: 50%;
    width: 150px;
    transform: translateX(-50%);
  }
}
</style>