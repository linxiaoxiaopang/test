<template>
  <span>
    <el-button type="text" size="mini" class="filter-item" @click="to">
      批量设置
    </el-button>
    <SForm
      ref="form"
      :selectedData="sup_this.selectedData"
      :dialogVisible.sync="dialogVisible"
      :sup_this="sup_this"
      title="批量设置共享状态"
      v-on="$listeners"
    />
  </span>
</template>
<script>
import SForm from  './sForm'
export default {
  components: { SForm },
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
