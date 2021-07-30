<template>
  <div class="detailCard">
    <div class="cover">
      <div class="pic-wrapper">
        <el-image fit="contain" :src="item.cover | formatUrl"></el-image>
      </div>
    </div>

    <div class="tro">
      <div class="row">
        <span class="label"> 订单: </span>
        <span class="name"> {{ info.order_code }} </span>
      </div>
      <div class="row">
        <span class="label">SKU:</span>
        <span class="name">
          {{ item.SKU }}
        </span>
      </div>
      <div class="row">
        <span class="label"> 尺寸: </span>
        <span class="name">
          {{ item.size && item.size.name }}
        </span>
      </div>
      <div class="row">
        <span class="label"> 数量: </span>
        <span class="name"> x{{ item.count || 0 }} </span>
      </div>

      <div class="row">
        <span class="label"> 物流: </span>
        <span class="name">
          {{ (info.fedex && info.fedex.name) || "暂无物流" }}
        </span>
      </div>
      <div class="row">
        <span class="label"> 日期: </span>
        <span class="name"> {{ parseDay(info.sale_date) }} </span>
      </div>
    </div>
  </div>
</template>

<script>
import { parseDay } from "@/utils";
export default {
  props: {
    info: {
      type: Object,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    item() {
      const { prod_spec = {}, ...rest } = this.data || {};
      return Object.assign(prod_spec || {}, rest);
    },
  },
  methods: {
    parseDay,
  },
};
</script>

<style lang="scss" scoped>
.detailCard {
  display: flex;
  width: 100%;
  padding: 15px;
  border: 1px solid $border-color;
  border-radius: 4px;
  margin-bottom: 15px;
  box-sizing: border-box;
  .cover {
    position: relative;
    flex: 0 0 50%;
  }
  .pic-wrapper {
    position: relative;
    padding-top: 100%;
    border: 1px dashed $border-color;
    .el-image {
      position: absolute;
      top: 0;
      // right: 0;
      // bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  .tro {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-left: 10px;
    flex: 1;
    .row {
      .label {
        padding-right: 5px;
        font-size: 14px;
      }
      .name {
        font-size: 16px;
        word-break: break-all;
        color: $color-primary;
      }
    }
    .row:not(:last-child) {
      margin-bottom: 10px;
    }
  }
}
// .detailCard:hover {
//   box-shadow: 0px 0px 5px 1px rgb(207, 206, 206);
// }
</style>