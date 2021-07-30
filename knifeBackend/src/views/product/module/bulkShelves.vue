<template>
  <div class="line inline-block">
    <el-button type="info" size="mini" class="filter-item" @click="to">
      批量下架
    </el-button>
    <OffShelvesForm
      ref="form"
      v-if="dialogVisible"
      :showSearch="true"
      :dialogVisible.sync="dialogVisible"
      :sup_this="sup_this"
      :cData="cData"
      :isOff="isOff"
      :title="isOff ? '批量下架原型' : '批量上架原型'"
    />
  </div>
</template>
<script>
import cloneDeep from "lodash/cloneDeep";
import OffShelvesForm from "./offShelvesForm";
import { formatPutOnAndOffData } from "@/utils";
export default {
  components: { OffShelvesForm },
  props: {
    sup_this: {
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
      cData: [],
    };
  },
  methods: {
    to() {
      const _this = this.sup_this;
      if (!_this.selectedData.length) {
        this.$message({
          type: "warning",
          message: "请先选择需要的数据，再进行此操作",
        });
        return;
      }
      const data = cloneDeep(_this.selectedData);
      this.cData = formatPutOnAndOffData(data);
      this.dialogVisible = true;
    },
  },
};
</script>
