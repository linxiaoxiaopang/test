<template>
  <div class="recommendComponent">
    <div class="recommend-title" v-if="hasTitle">推荐产品</div>
    <MultipleViewSwiper :data="data" v-slot="{ scoped }">
      <ProtoCard :data="scoped" :sup_this="sup_this" />
    </MultipleViewSwiper>
  </div>
</template>

<script>
import MultipleViewSwiper from "@/components/multipleViewSwiper";
import ProtoCard from "@/views/design/module/protoCard";
import { initDataMixin } from "@/mixins";

export default {
  mixins: [initDataMixin],
  components: {
    MultipleViewSwiper,
    ProtoCard,
  },
  props: {
    hasTitle: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      sup_this: this,
      url: "/api/prim_prod/selling_prim_product/",
    };
  },
};
</script>

<style lang="scss" scoped>
.recommendComponent {
  margin-top: 30px;
  padding: 0 20px;
  .recommend-title {
    margin-left: -20px;
    margin-bottom: 20px;
  }
  ::v-deep {
    .swiper-button-next,
    .swiper-button-prev {
      margin-top: -50px;
    }
  }
}
</style>