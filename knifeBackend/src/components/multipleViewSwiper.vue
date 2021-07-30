<template>
  <div class="recommendComponent">
    <Swiper
      v-slot="{ scoped, indx }"
      :slideStyle="{
        width: `calc(${(1 / picSize) * 100}% - 30px)`,
        height: '100%',
      }"
      :swiperData="data"
      :defaultSwiperOptions="{
        autoplay: false,
        pagination: false,
        slidesPerView: 'auto',
      }"
    >
      <slot :scoped="{ scoped, indx }"></slot>
    </Swiper>
  </div>
</template>

<script>
import Swiper from "@/components/swiperWrapper";
export default {
  components: {
    Swiper,
  },
  props: {
    picSize: {
      type: Number,
      default: 4,
    },
    data: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.recommendComponent {
  position: relative;
  ::v-deep {
    .swiper-slide {
      margin: 0 15px;
    }
    .swiper-button-prev,
    .swiper-button-next {
      color: $color-gray;
      width: 30px;
      height: 30px;
      border: 1px solid;
      border-radius: 50%;
      background-color: #fff;
    }
    .swiper-button-disabled {
      background: #fff;
      opacity: 1;
      color: rgba(96, 98, 102, 0.3);
    }
    .swiper-button-prev {
      margin-left: -9px;
    }
    .swiper-button-next {
      margin-right: -9px;
    }
    .swiper-button-prev:after,
    .swiper-button-next:after {
      font-size: 12px;
    }
  }
}
</style>