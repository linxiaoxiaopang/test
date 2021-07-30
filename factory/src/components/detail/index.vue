<template>
  <span>
    <el-button size="mini" @click="to">产品详情</el-button>
    <DetailForm
      ref="form"
      title="产品详情"
      :info="data"
      :data="swiperData"
      :sup_this="sup_this"
      v-bind="$attrs"
    />
  </span>
</template>
<script>
import DetailForm from "./detailForm";
export default {
  components: { DetailForm },
  props: {
    data: {
      type: Object,
      required: true,
    },
    sup_this: {
      type: Object,
      required: true,
    },
  },
  computed: {
    swiperData() {
      const { order_items = [], ...rest } = this.data;
      const mapData = order_items.map((item) => {
        const { prod_spec, ...itemRest } = item;
        return Object.assign(prod_spec || {}, itemRest, rest);
      });
      return mapData;
    },
  },
  methods: {
    to() {
      const _this = this.$refs.form;
      _this.dialogVisible = true;
    },
  },
};
</script>
