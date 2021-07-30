<template>
  <div :class="['swiper-container', customClass]">
    <swiper :class="['swiperWrapperComponent']" ref="mySwiper" v-bind="$attrs" :options="swiperOptions">
      <swiper-slide :style="slideStyle" v-for="(item, indx) in swiperData" :key="indx">
        <slot
          v-if="!Array.isArray(item)"
          :scoped="{
            ...item,
            indx
          }"
        />
        <slot v-else :scoped="item" />
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
    <div :class="[navigation.nextEl && navigation.nextEl.slice(1)]"></div>
    <div :class="[navigation.prevEl && navigation.prevEl.slice(1)]"></div>
  </div>
</template>

<script>
export default {
  props: {
    customClass: String,
    slideStyle: {
      type: Object,
      default: () => ({})
    },
    swiperData: {
      type: Array,
      default: () => []
    },
    defaultSwiperOptions: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const $this = this //swiper的this指向自己的实例， 重置将vue的this 赋值给$this
    return {
      swiperOptions: {
        ...{
          loop: false,
          loopAdditionalSlides: 3,
          autoplay: {
            delay: 3000,
            disableOnInteraction: false
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          on: {
            click: function () {
              $this.clickHandler(this)
            },
            slideChange: function () {
              $this.slideChangeHandler(this)
            }
          }
        },
        ...this.defaultSwiperOptions
      }
    }
  },
  watch: {
    swiperData() {
      this.swiper.slideTo(1, 1000, false)
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper
    },
    navigation() {
      return this.swiperOptions.navigation || {}
    }
  },
  methods: {
    slidePrev() {
      this.swiper.slidePrev()
    },
    slideNext() {
      this.swiper.slideNext()
    },
    clickHandler(swiper) {
      this.$emit('swiperClickHandler', swiper)
    },
    slideChangeHandler(swiper) {
      this.$emit('slideChangeHandler', swiper)
    }
  }
}
</script>

<style lang="scss" scoped>
.swiper-container {
  width: 100%;
  height: 100%;
  .swiperWrapperComponent {
    // width: 100%;
    // height: 100%;
    box-sizing: border-box;
    cursor: pointer;
  }
  ::v-deep {
    .swiper-button-prev:after,
    .swiper-button-next:after {
      font-size: 25px;
    }
    :focus {
      outline: none;
    }
  }
}
</style>
