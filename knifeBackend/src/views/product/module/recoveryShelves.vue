<template>
  <div class="line inline-block">
    <color-text-btn
      :loading="loading"
      type="danger"
      size="mini"
      class="filter-item"
      @click="to"
    >
      恢复上架
    </color-text-btn>
    <RecoveryShelvesForm
      ref="form"
      title="恢复上架"
      v-if="dialogVisible"
      :showSearch="false"
      :isOff="isOff"
      :dialogVisible.sync="dialogVisible"
      :sup_this="sup_this"
      :cData="cData"
      :putUpData="putUpData"
    />
  </div>
</template>
<script>
import cloneDeep from "lodash/cloneDeep";
import RecoveryShelvesForm from "./recoveryShelvesForm";
import { formatPutOnAndOffData } from "@/utils";
import { getProductData as list } from "@/api/product/productApi";
export default {
  components: { RecoveryShelvesForm },
  props: {
    sup_this: {
      type: Object,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    isOff: {
      type: Boolean,
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
