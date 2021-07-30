<template>
  <div class="recommendComponent">
    <Swiper
      v-slot="{ scoped }"
      :isActive = "isActive"
      :slideStyle="{
        width: 'calc(20% - 30px)',
        height: '100%',
      }"
      :swiperData="data"
      :defaultSwiperOptions="{
        autoplay: false,
        pagination: false,
        slidesPerView: 'auto',
      }"
    >
      <slot :scoped="scoped"></slot>
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
    data: {
      type: Array,
      required: true,
    },
    isActive: Boolean
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
      color: white;
      font-weight: 600;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: rgba($color: #000000, $alpha: 0.1);
    }
    .swiper-button-disabled {
      opacity: 1;
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