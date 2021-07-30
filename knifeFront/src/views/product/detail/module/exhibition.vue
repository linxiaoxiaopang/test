<template>
  <div class="exhibitionComponent">
    <div class="thumbnails">
      <SwiperWrapper
        ref="thumb"
        v-slot="{ scoped: { thumbnail_path, indx } }"
        :slideStyle="{
          width: '100%',
        }"
        :swiperData="images"
        :defaultSwiperOptions="{
          direction: 'vertical',
          autoplay: false,
          pagination: false,
          spaceBetween: 10,
          slidesPerView: 6,
          navigation: false,
          watchSlidesVisibility: true,
        }"
        @swiperClickHandler="swiperClickHandler"
      >
        <el-image
          :class="[curIndex == indx && 'active']"
          :key="indx"
          :src="thumbnail_path"
          fit="contain"
        ></el-image>
      </SwiperWrapper>
    </div>
    <div class="origin-pic">
      <SwiperWrapper
        v-if="thumbSwiper"
        @slideChangeHandler="slideChangeHandler"
        v-slot="{ scoped: { path, indx } }"
        :slideStyle="{
          width: '100px',
          height: '100%',
        }"
        :swiperData="images"
        :defaultSwiperOptions="{
          autoplay: false,
          pagination: false,
          navigation: false,
          thumbs: {
            swiper: thumbSwiper,
          },
        }"
      >
        <el-image :key="indx" :src="path" fit="contain"></el-image>
      </SwiperWrapper>
    </div>
  </div>
</template>

<script>
import SwiperWrapper from "@/components/swiperWrapper";

export default {
  components: {
    SwiperWrapper,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      curIndex: 0,
      thumbSwiper: undefined,
    };
  },
  computed: {
    images () {
      const {images = []} = this.data || {}
      console.log('images',images)
      return images
    }
  },
  mounted() {
    this.thumbSwiper = this.$refs.thumb && this.$refs.thumb.swiper;
  },
  methods: {
    swiperClickHandler(swiper) {
      const { clickedIndex } = swiper;
      swiper.slideTo(clickedIndex);
      this.curIndex = clickedIndex;
    },
    slideChangeHandler(swiper) {
      const { activeIndex } = swiper;
      this.curIndex = activeIndex;
    },
  },
};
</script>

<style lang="scss" scoped>
.exhibitionComponent {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  .thumbnails {
    flex: 0 0 60px;
    margin-right: 50px;
    .el-image {
      width: 100%;
      height: 66px;
      opacity: 0.2;
      transform: scale(0.8);
      border-radius: 4px;
    }
    .active {
      transition: 0.25s all;
      box-sizing: border-box;
      border: 1px solid #000;
      opacity: 1;
      transform: scale(1);
    }
  }
  .origin-pic {
    width: 540px;
    flex: 1;
    box-sizing: border-box;
    border: 1px solid $border-color;
    .el-image {
      width: calc(100% - 2px);
      height: 100%;
    }
  }
}
</style>