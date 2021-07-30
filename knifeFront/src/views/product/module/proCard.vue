<template>
  <div :class="['proCardComponent', 'hover']" @click="linkToDetail">
    <div class="pic-wrapper">
      <el-checkbox v-model="data.checked" @change="changeHandler" />
      <el-image fit="contain" :src="cover + PICSIZE['mid']"></el-image>
    </div>

    <div class="name">
      <span
        >{{ data.detail }}</span
      >
    </div>
    <div class="money">
      批发：<span>${{ restart }}</span> 起
    </div>
  </div>
</template>

<script>
import { PICSIZE } from "@/utils/constant";

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      PICSIZE,
    };
  },
  computed: {
    cover() {
      const { images = [] } = this.data || {};
      return (
        (images[0] && images[0].path) || require("@/assets/images/default.png")
      );
    },

    restart() {
      const {
        prim_prod: { sizes = [] },
      } = this.data;
      const prices = sizes.map(({ price }) => {
        return Number(price);
      });
      return Math.min(...prices) === Infinity ? 1 : Math.min(...prices);
    },
  },
  methods: {
    changeHandler() {
      this.$emit("changeHandler");
    },
    linkToDetail() {
      this.$emit("linkToDetail", this.data);
    },
  },
};
</script>

<style lang="scss" scoped>
.proCardComponent {
  &:hover {
    box-shadow: 0 0 10px 5px $border-color;
  }
  width: 100%;
  position: relative;
  border-radius: 4px;
  padding-bottom: 15px;
  margin-bottom: 15px;
  border: 1px solid $border-color;
  transition: transform 0.5s;
  overflow: hidden;
  cursor: pointer;
  .pic-wrapper {
    position: relative;
    padding-top: 100%;
    .el-checkbox {
      position: absolute;
      top: 10px;
      left: 10px;
    }
    .el-image {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: $bg-gray-color;
      border: 1px solid $bg-gray-color;
    }
  }
  .money,
  .name {
    font-size: 12px;
    width: 100%;
    height: 1.5rem;
    line-height: 2rem;
    background: #fff;
    padding: 0 8px;
    @include overflow;
    z-index: 100;
    font-size: 14px;
    color: $color-gray;
  }
  .name {
    font-size: 12px;
  }
  .money span {
    font-size: 18px;
  }
}
</style>