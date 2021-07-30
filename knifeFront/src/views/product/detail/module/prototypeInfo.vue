<template>
  <div class="prototypeInfoComponent">
    <div class="top-info">
      <div class="name-wrapper">
        <div class="name">{{ name }}</div>
        <div class="sub-title">
          <span>
            重量（含包装）：{{
              curSizeData.weight
                ? curSizeData.weight + "克"
                : undefined || "暂无"
            }}
          </span>
          <span> 材质：涤纶 </span>
        </div>
      </div>
      <div class="time-wrapper">
        <div class="time">25小时</div>
        <div class="average">25小时平均发货时效（80%订单）</div>
      </div>
    </div>

    <div class="specifications">
      <div class="s-row money">
        <div class="s-row-label cell">价格</div>
        <div class="cell">￥{{ curSizeData.price }}</div>
        <div class="cell">￥{{ curSizeData.price }}</div>
        <div class="cell">￥{{ curSizeData.price }}</div>
        <div class="cell">￥{{ curSizeData.price }}</div>
      </div>
      <div class="s-row">
        <div class="s-row-label cell">起批量</div>
        <div class="cell">1-4件</div>
        <div class="cell">5-14件5-14件</div>
        <div class="cell">15-29件</div>
        <div class="cell">30+件</div>
      </div>
    </div>
    <div class="label">款式</div>
    <el-tag type="primary">
      {{ structure }}
    </el-tag>
    <div class="label">尺码</div>
    <el-radio-group v-model="size" size="mini">
      <el-radio
        border
        :key="index"
        :label="id"
        v-for="({ size_name, id }, index) in sizes"
        >{{ size_name }}</el-radio
      >
    </el-radio-group>
    <div class="btn-wrapper">
      <el-button type="primary"> 加入购物车 </el-button>
      <i
        :class="['fa', 'fa-heart-o', 'love', love && 'collection']"
        aria-hidden="true"
        @click="collection"
      ></i>
    </div>
    <div class="tip">
      支持全球送达，美国E邮宝运费 ￥ 0.00、同城自提￥ 0.00、国内到付￥ 0.00
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      size: undefined,
      figures: [],
      love: false,
    };
  },
  computed: {
    structure() {
      const { prim_struct: { structure = "" } = {} } = this.data || {};
      return structure;
    },
    name() {
      const { prim_struct: { detail = "" } = {} } = this.data || {};
      return detail;
    },
    sizes() {
      const { prim_prod: { sizes = [] } = {} } = this.data;
      if (!this.size) {
        this.size = sizes[0] && sizes[0].id;
      }
      return sizes;
    },
    curSizeData() {
      if (this.size) {
        return this.findInfoById(this.size, this.sizes || []);
      }
      return {};
    },
  },
  methods: {
    collection() {
      this.love = !this.love;
    },
    findInfoById(id, arr) {
      const data = arr.filter(({ id: itemId }) => {
        return itemId == id;
      });
      return data[0] || {};
    },
    linkToDesign() {
      this.$router.push(
        `/design/designContainer?id=${this.size}&protoId=${this.data.id}&structId=${this.color}`
      );
    },
  },
};
</script>

<style lang="scss" coped>
.prototypeInfoComponent {
  .top-info {
    display: flex;
    justify-content: space-between;
    .name-wrapper {
      flex: 1;
      text-align: left;
      line-height: 28px;
      .name {
        font-size: 20px;
        color: #000;
      }
      .sub-title {
        span {
          color: $color-gray;
          margin-right: 10px;
          font-size: 12px;
        }
      }
    }
    .time-wrapper {
      text-align: center;
      color: $color-primary;
      line-height: 28px;

      .time {
        font-size: 20px;
        font-weight: 600;
      }
      .average {
        font-size: 12px;
      }
    }
  }
  .specifications {
    width: 100%;
    display: table;
    text-align: left;
    background: $bg-color;
    padding: 10px 40px;
    .s-row {
      display: table-row;
      .s-row-label {
        white-space: nowrap;
        width: 80px;
      }
      &.money {
        .cell {
          color: $color-danger;
        }
      }
      .s-row-label,
      .cell {
        height: 26px;
        line-height: 46px;
        font-size: 20px;
        display: table-cell;
        color: #000;
        white-space: nowrap;
        padding-right: 3px;
      }
    }
  }
  .label {
    line-height: 40px;
  }
  .color {
    display: inline-block;
    padding: 5px 10px;
    margin-right: 10px;
    border: 1px solid $border-color;
    border-radius: 5px;
    cursor: pointer;
  }
  .el-radio {
    margin-right: 10px;
  }
  .btn-wrapper {
    .el-button {
      margin: 20px 10px;
      width: 200px;
      margin-left: 0px;
    }
    i {
      position: relative;
      top: 3px;
      font-size: 20px;
      cursor: pointer;
    }
    i.collection {
      color: $color-danger;
    }
  }
  .tip {
    color: $color-gray;
    font-size: 12px;
  }
}
</style>