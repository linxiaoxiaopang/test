<template>
  <!-- 图片编辑弹出层 -->
  <BaseDialog
    :dialogVisible.sync="dialogVisible"
    width="80vw"
    v-bind="$attrs"
    class="factoryOrderListDetailForm"
  >
    <template>
      <div class="consignee">
        <div class="c-row">
          <span class="label"> 收货人： </span>
          <span class="text">
            {{ info.consignee_name }}
          </span>
            <span class="label"> 业务员： </span>
          <span class="text">
            {{ info.salesman }}
          </span>
          <span class="label"> 固定电话： </span>
          <span class="text">
            {{ info.fixed_phone }}
          </span>
          <span class="label"> 移动电话： </span>
          <span class="text">
            {{ info.mobile_phone }}
          </span>

          <span class="label"> 邮编： </span>
          <span class="text">
            {{ info.postcode }}
          </span>

          <span class="label"> 国家： </span>
          <span class="text">
            {{ info.country }}
          </span>
          <span class="label"> 省份： </span>
          <span class="text">
            {{ info.consignee_province }}
          </span>
          <span class="label"> 城市： </span>
          <span class="text">
            {{ info.consignee_city }}
          </span>
          <span class="label"> 地址： </span>
          <span class="text">
            {{ info.address }}
          </span>
        </div>
      </div>
      <SwiperWrapper
        :slideStyle="{
          position: 'relative',
          width: '25%',
          minWidth: '350px',
        }"
        :defaultSwiperOptions="swiperOption"
        :swiperData="data"
        @slideChangeHandler="slideChangeHandler"
      >
        <template v-slot="{ scoped: swiperItem }">
          <DetailCard :info="info" :data="swiperItem" />
        </template>
      </SwiperWrapper>
    </template>
    <template #footer>
      <span></span>
      <!-- <LoadingBtn @click="dialogVisible = false"> 取消 </LoadingBtn> -->
    </template>
  </BaseDialog>
</template>

<script>
import SwiperWrapper from "@/components/swiperWrapper";
import DetailCard from "./detailCard";
export default {
  components: {
    SwiperWrapper,
    DetailCard,
  },
  props: {
    info: {
      type: Object,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    sup_this: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      dialogVisible: false,
      swiperOption: {
        slidesPerView: "auto",
        autoplay: false,
        // pagination: {},
        // navigation: {},
      },
    };
  },
  methods: {
    slideChangeHandler(swiper) {},
  },
};
</script>

<style lang="scss" scoped>
.factoryOrderListDetailForm {
  .total {
    margin-bottom: 15px;
    span {
      color: $color-primary;
    }
  }
  .consignee {
    margin-bottom: 10px;
    .c-row {
      line-height: 1.5;
      .label:not(:first-child) {
        margin-left: 15px;
      }
      .text {
        font-size: 12px;
        color: $color-primary;
      }
    }
  }
}
</style>