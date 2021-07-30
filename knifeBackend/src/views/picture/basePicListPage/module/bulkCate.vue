<template>
  <span>
    <el-button type="primary" size="mini" class="filter-item" @click="to">
      批量设置分类
    </el-button>
    <CForm
      ref="form"
      :selectedData="sup_this.selectedData"
      :dialogVisible.sync="dialogVisible"
      :sup_this="sup_this"
      title="批量设置共享状态"
    />
  </span>
</template>
<script>
import CForm from "./cForm";
export default {
  components: { CForm },
  props: {
    sup_this: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {
    to() {
      const _this = this.sup_this;
      if (!_this.selectedData.length) {
        this.$message({
          type: "warning",
          message: "请先选择数据，再进行此操作",
        });
        return;
      }
      this.dialogVisible = true
    },
  },
};
</script>
