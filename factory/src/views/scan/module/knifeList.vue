<template>
  <div class="knifeListComponent">
    <el-radio-group
      v-model="radio"
      size="small"
      style="margin-top: 15px"
      v-show="qualitySuccess && notTourist"
    >
      <el-radio-button :label="0">隐藏刀版图</el-radio-button>
      <el-radio-button :label="1">显示刀版图</el-radio-button>
    </el-radio-group>

    <el-radio-group
      v-model="radio1"
      size="small"
      style="margin-top: 15px"
      v-show="!qualitySuccess"
    >
      <el-radio-button :label="0">显示质检错误列表</el-radio-button>
    </el-radio-group>

    <el-row :gutter="10" class="cover-list">
      <el-col
        class="cover-col"
        :span="radio && notTourist ? 12 : 6"
        :key="index"
        v-for="(item, index) in domData || []"
      >
        <template v-if="!qualitySuccess && !notTourist">
          <div class="c-row">
            <span class="label"> 应生产件数： </span>
            <span class="text">
              <el-tag type="primary">
                {{ item.count }}
              </el-tag>
            </span>
            <span class="label"> 半质检件数： </span>
            <span class="text">
              <el-tag type="success" v-if="item.count == item.half_pass">
                {{ item.half_pass }}
              </el-tag>
              <template v-else>
                <el-tag type="danger"> {{ item.half_pass }}</el-tag>
                <span class="color-danger" style="margin-left: 10px"
                  >(异常)
                </span>
              </template>
            </span>
            <span class="label"> 全质检件数： </span>
            <span class="text">
              <el-tag type="success" v-if="item.count == item.whole_pass">
                {{ item.whole_pass }}
              </el-tag>
              <template v-else>
                <el-tag type="danger"> {{ item.whole_pass }}</el-tag>
                <span class="color-danger" style="margin-left: 10px"
                  >(异常)
                </span>
              </template>
            </span>
          </div>
        </template>
        <div :class="['cover-item', (!radio || !notTourist) && 'hide-kl']">
          <el-image fit="contain" :src="item.productShowCover"></el-image>
          <div class="name">
            效果图
            <span class="color-danger"> X </span>
            {{ item.productCount }}
          </div>
        </div>
        <div class="cover-item" v-if="radio && notTourist">
          <el-image fit="contain" :src="item.knifeLayoutPath"></el-image>
          <div class="name">刀版图</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    domData: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      radio: 1,
      radio1: 0,
    };
  },
  computed: {
    ...mapGetters({
      userId: "id",
    }),
    notTourist() {
      return this.userId != 46;
    },
    qualitySuccess() {
      console.log(this.domData);
      // return true;
      const batch_group = !!this.domData[0] && this.domData[0].batch_group;
      if (batch_group != 1) {
        return true;
      }
      if (!batch_group) {
        return true;
      }
      const bool = this.domData.every(({ count, half_pass, whole_pass }) => {
        return half_pass === count && whole_pass === half_pass;
      });
      if (!bool) {
        this.errMsg = QUALITYERRORDER;
        this.radio = 1;
      }
      return bool;
    },
  },
};
</script>

<style lang="scss" scoped>
.knifeListComponent {
  .cover-list {
    // margin-top: 15px;
    .cover-col {
      display: flex;
      margin-top: 15px;
      position: relative;
      flex-wrap: wrap;
      .c-row {
        width: 100%;
        border: 1px solid $border-color;
        border-radius: 4px;
        padding: 8px 5px;
        .el-tag {
          font-size: 1.5rem;
        }
      }
    }
    .cover-item.hide-kl {
      padding-top: 100%;
      width: 100%;
    }
    .cover-item {
      position: relative;
      padding-top: 50%;
      width: 50%;
      background: #fff;
      border: 1px solid $border-color;
      .el-image {
        position: absolute;
        top: 3rem;
        bottom: 0;
        left: 0;
        width: 100%;
      }
      .name {
        position: absolute;
        top: 0;
        left: 0;
        line-height: 1.5;
        background: $color-primary;
        background: #188fff5e;
        color: #fff;
        padding: 0 0.5rem;
        width: 100%;
        text-align: center;
        font-size: 2rem;
        // @include overflow;
        border-radius: 4px 4px 0 0;
      }
    }
  }
}
</style>