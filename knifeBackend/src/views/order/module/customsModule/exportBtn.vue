<template>
  <div class="exportBtn">
    <el-button type="primary" size="mini" class="btn" @click="exportHandler"
      >导出所选</el-button
    >
  </div>
</template>

<script>
import { exportForCustoms } from "@/api/order";
import { ORDER_EXPORTED } from "@/utils/constant";
import saveAs from "jszip/vendor/FileSaver.js";

export default {
  props: {
    selectedData: {
      type: Array,
      required: true,
    },
    sup_this: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async exportHandler() {
      if (!this.selectedData.length) {
        return this.$message.warning("请先选择数据再进行此操作！");
      }
      this.loading = true;
      try {
        const idList = this.selectedData.map(({ id }) => id);
        const res = await exportForCustoms({
          idList,
          isCustomsDeclaredExported: ORDER_EXPORTED,
        });
        saveAs(res, '订单');
        this.$message.success("导出成功");
        this.sup_this && this.sup_this.init();
      } catch (err) {}
      this.loading = false;
    },
  },
};
</script>

<style scoped lang="scss">
.exportBtn {
  height: 50px;
  width: 100%;
  border: 1px solid rgba($color: #000000, $alpha: 0.3);
  border-radius: 5px;
  margin: 20px 0;
  position: relative;
  padding: 11px 0;
  .btn {
    position: absolute;
    right: 20px;
  }
}
</style>
