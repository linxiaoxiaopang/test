<template>
  <router-link
    :to="`/design/detail?id=${data.id}`"
    :class="['protoCardComponent', 'hover']"
    @click="linkToDetail"
    v-loading="loading"
  >
    <div class="pic-wrapper">
      <el-image fit="contain" :src="cover + PICSIZE['mid']"></el-image>
      <div class="pic-dialog">
        <i
          v-if="home"
          :class="[
            'fa',
            'love',
            (data.collect && 'el-icon-star-on active') || 'el-icon-star-off'
          ]"
          aria-hidden="true"
          @click.prevent.stop="love"
          v-p="['prim_prod:selling_prim_product:remove_collections']"
        ></i>
        <div v-if="home" class="btn" @click.prevent.stop="design">
          <i class="el-icon-top-right"></i>
          <span>点击开始定制</span>
        </div>
      </div>
    </div>

    <div class="name">
      <span>{{ data.name }}</span>
    </div>
    <div class="money">
      批发：<span>${{ restart }}</span> 起
    </div>
    <div class="colors">
      <div
        class="color-wrapper"
        :key="index"
        :style="{ background: color }"
        v-for="(color, index) in colors.slice(0, 5)"
        @click.prevent.stop="curActive = index"
      >
        <div :class="['color', curActive == index && 'active']"></div>
      </div>
    </div>
  </router-link>
</template>

<script>
import { PICSIZE } from '@/utils/constant'
import collectionPrivateMixin from '../mixins/collectionPrivateMixin'
import { mapMutations } from 'vuex'

export default {
  mixins: [collectionPrivateMixin],
  props: {
    data: {
      type: Object,
      required: true
    },
    sup_this: {
      type: Object,
      required: true
    },
    home: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      PICSIZE,
      curActive: 0
    }
  },
  computed: {
    baseSizeId() {
      const baseSizes = this.data.base_sizes || []
      if (baseSizes.length) {
        return baseSizes[0]
      }
    },
    cover() {
      try {
        const { prim_struct = [] } = this.data
        const { figures } = prim_struct[this.curActive]
        return figures[0].path || require('@/assets/images/default.png')
      } catch (err) {
        return require('@/assets/images/default.png')
      }
    },
    colors() {
      const { prim_struct = [] } = this.data
      return prim_struct.map(({ color_value }) => color_value)
    },
    restart() {
      const { sizes = [] } = this.data
      const allPrice = []
      sizes.map(({ price_confs }) => {
        price_confs.map(({ price }) => {
          allPrice.push(price)
        })
      })

      if (allPrice.length) {
        return Math.min.apply(null, allPrice)
      } else {
        return '0'
      }
    }
  },
  methods: {
    ...mapMutations(['SET_PROTO_OBJ']),
    linkToDetail() {
      this.SET_PROTO_OBJ(this.data)
    },
    design() {
      this.$router.push(
        `/design/designContainer?id=${this.baseSizeId}&protoId=${this.data.id}`
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.protoCardComponent {
  &:hover {
    box-shadow: 0 0 10px 5px $border-color;
  }
  width: 100%;
  position: relative;
  display: block;
  border-radius: 4px;
  margin-bottom: 15px;
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
    .love {
      position: absolute;
      right: 10px;
      top: 8px;
      z-index: 10;
      font-size: 12px;
      color: #fff;
      font-size: 20px;
      color: #000;
      background: #fff;
      border-radius: 2px;
      padding: 2px;
    }
    .el-icon-star-on {
      font-size: 22px;
    }
    .love.active {
      padding: 0;
      color: $--color-primary;
    }
    .el-image {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: #fff;
      border: 1px solid $bg-gray-color;
    }
    .pic-dialog {
      display: none;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.3);
      z-index: 10;
      .btn {
        position: absolute;
        left: 10%;
        bottom: 16px;
        height: 1.5rem;
        line-height: 1.5rem;
        margin: 0 auto;
        width: 120px;
        font-size: 12px;
        text-align: center;
        border-radius: 1rem;
        color: #fff;
        background: rgba($color: #545454, $alpha: 0.7);
        i {
          margin-right: 5px;
          font-size: 18px;
          position: relative;
          bottom: -2px;
        }
      }
    }
    .el-image:hover + .pic-dialog {
      display: block;
    }
    .pic-dialog:hover {
      background: rgba($color: #d1d1d1, $alpha: 0.5);
      display: block;
    }
  }
  .money,
  .name {
    color: #333333;
    font-size: 14px;
    width: 100%;
    height: 2rem;
    line-height: 2rem;
    background: #fff;
    padding: 0 8px;
    @include overflow;
    z-index: 100;
    font-size: 14px;
  }
  .money {
    color: $color-gray;
  }
  .money span {
    font-size: 16px;
  }
  .colors {
    padding: 0 8px;
    padding-bottom: 10px;
    width: 100%;
    overflow: auto;
    white-space: nowrap;
    .color-wrapper {
      position: relative;
      display: inline-block;
      width: 12%;
      white-space: nowrap;
      padding-top: 12%;
      margin-right: 4%;
      margin-bottom: 5px;
    }
    .color {
      top: 0;
      left: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      border: 1px solid $border-color;
    }
    .color.active {
      color: $color-danger;
    }
    // .color + .color {
    //   margin-left: 10px;
    // }
  }
}
</style>
