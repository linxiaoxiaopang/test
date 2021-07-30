<template>
  <div class="line inline-block">
    <color-text-btn
      style="display: inline-block"
      type="primary"
      :loading="loading"
      @click="showDrawer"
    >
      <slot> 点击 </slot>
    </color-text-btn>
    <DetailOrEditDrawer
      :title="$attrs.type == 1 ? '编辑' : '查看详情'"
      ref="detailOrEditDrawer"
      :productData="productData"
      style="display: inline-block"
      :dialogVisible.sync="dialogVisible"
      :data="cData"
      :oProData="oProData"
      v-bind="$attrs"
      v-on="$listeners"
    />
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import DetailOrEditDrawer from "./detailOrEditDrawer";
import { list } from "@/api/order/productList";
export default {
  components: {
    DetailOrEditDrawer,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      productData: [],
      cData: {},
      oProData: [],
    };
  },
  methods: {
    async showDrawer({}) {
      this.cData = cloneDeep(this.data);
      try {
        await this.list();
      } catch (err) {}
      this.$nextTick(() => {
        this.dialogVisible = true;
      });
    },
    async list() {
      const { id } = this.data || {};
      this.loading = true;
      try {
        const res = await list({
          orderId: id,
        });
        const { detail, code } = res;
        if ($SUC({ code })) {
          this.$set(this.cData, "productData", detail || []);
          this.oProData = cloneDeep(detail || []);
        }
      } catch (err) {
        console.log(err);
      }
      this.loading = false;
    },
  },
};
</script>
