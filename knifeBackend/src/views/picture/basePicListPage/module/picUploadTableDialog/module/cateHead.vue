<template>
  <span>
    <el-button type="text" size="mini" class="filter-item" @click="to">
      批量设置
    </el-button>
    <CForm
     v-if="dialogVisible"
      ref="form"
      title="批量设置图片类型"
      :sup_this="sup_this"
      :dialogVisible.sync="dialogVisible"
      :selectedData="sup_this.selectedData"
      v-on="$listeners"
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
      this.dialogVisible = true;

    },
  },
};
</script>
