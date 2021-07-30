<template>
  <div class="line inline-block">
    <color-text-btn
      :loading="loading"
      type="danger"
      size="mini"
      class="filter-item"
      @click="to"
    >
      上架
    </color-text-btn>
    <PutUpShelvesForm
      ref="form"
      title="上架"
      v-if="dialogVisible"
      :showSearch="false"
      :dialogVisible.sync="dialogVisible"
      :sup_this="sup_this"
      :cData="cData"
      :putUpData="putUpData"
    />
  </div>
</template>
<script>
import cloneDeep from "lodash/cloneDeep";
import PutUpShelvesForm from "./putUpShelvesForm";
import { formatPutOnAndOffData } from "@/utils";
import { getProductData as list } from "@/api/product/productApi";
export default {
  components: { PutUpShelvesForm },
  props: {
    sup_this: {
      type: Object,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      cData: [],
      putUpData: [],
    };
  },

  methods: {
    async to() {
      const data = [cloneDeep(this.data)];
      await this.getData();
      this.cData = formatPutOnAndOffData(data);
      this.dialogVisible = true;
    },
    async getData() {
      this.loading = true;
      try {
        const { detail, code } =
          (await list({
            id: this.data.id,
          })) || [];
        if ($SUC({ code })) {
          let data = [];
          if (Array.isArray(detail)) {
            data = detail;
          } else {
            data = [detail];
          }
          this.putUpData = data.map((item) => {
            const { sizes = [], prim_struct = [] } = item;
            return {
              sizes: sizes.filter(({ status }) => status == 1),
              prim_struct: prim_struct.filter(({ status }) => status == 1),
            };
          });
        }
      } catch (err) {}
      this.loading = false;
      return true;
    },
  },
};
</script>
