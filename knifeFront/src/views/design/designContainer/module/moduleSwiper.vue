<template>
  <div class="moduleSwiperComponent">
    <div class="thumbnails">
      <SwiperWrapper
        ref="thumb"
        v-slot="{ scoped: { path, name, indx } }"
        :slideStyle="{
          width: '100%'
        }"
        :swiperData="moduleImgs"
        :defaultSwiperOptions="
          Object.assign(
            {},
            {
              direction: 'vertical',
              autoplay: false,
              pagination: false,
              spaceBetween: 10,
              slidesPerView: 5,
              navigation: false
            },
            this.centerSlide
          )
        "
        @swiperClickHandler="swiperClickHandler"
      >
        <div ref="swipper-item" class="swipper-img-wrapper" :class="[curIndex == indx && 'active']">
          <el-image :key="indx" :src="path | formatUrl('small')" fit="contain"></el-image>
          <div class="page-num">
            <span>{{ indx + 1 }}</span>
            <span>/</span>
            <span>{{ moduleImgs.length }}</span>
          </div>
          <div class="name">
            {{ name }}
          </div>
        </div>
      </SwiperWrapper>
    </div>
  </div>
</template>

<script>
import SwiperWrapper from '@/components/swiperWrapper'

export default {
  components: {
    SwiperWrapper
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    moduleActiveIndex: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      curIndex: this.moduleActiveIndex
    }
  },
  watch: {
    curIndex(newVal) {
      this.$emit('update:moduleActiveIndex', newVal)
    },
    moduleActiveIndex(newVal) {
      this.curIndex = newVal
    }
  },
  computed: {
    moduleImgs() {
      return this.data.map(({ name, design_pic: [{ cover_path }] }) => {
        try {
          return {
            name,
            path: cover_path
          }
        } catch (err) {
          return {
            path: require('@/assets/images/default.png')
          }
        }
      })
    },

    centerSlide() {
      if (this.moduleImgs.length > 5) {
        return {
          centeredSlides: true,
          centeredSlidesBounds: true
        }
      }
      return {}
    }
  },
  methods: {
    swiperClickHandler(swiper) {
      const { clickedIndex } = swiper
      if (clickedIndex === undefined) return
      swiper.slideTo(clickedIndex)
      this.curIndex = clickedIndex
    }
  }
}
</script>

<style lang="scss" scoped>
.moduleSwiperComponent {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff;

  .thumbnails {
    width: 100%;
    padding: 5px;
    .swipper-img-wrapper {
      position: relative;
      width: 100%;
      width: 100%;
      height: 66px;

      transform: scale(0.8);
      border-radius: 4px;
    }
    .el-image {
      width: 100%;
      height: 46px;
      // opacity: 0.8;
    }
    .name {
      width: 80px;
      height: 20px;
      line-height: 1;
      font-size: 12px;
      text-align: center;
      @include overflow;
    }
    .page-num {
      bottom: 25px;
      right: 10px;
      font-size: 12px;
      position: absolute;
      color: $color-danger;
    }
    .swipper-img-wrapper.active {
      transition: 0.25s all;
      box-sizing: border-box;
      border: 1px solid;
      opacity: 1;
      color: $color-primary;
      transform: scale(1);
      .page-num {
        color: inherit;
      }
    }
  }
}
</style>
