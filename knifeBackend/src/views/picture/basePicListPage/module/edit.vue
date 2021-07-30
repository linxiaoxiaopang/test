<template>
  <span style="display:inline-block;">
    <el-button type="primary" size="mini" class="filter-item" @click="to">
      编辑
    </el-button>
    <EForm
      ref="form"
      :dialogVisible.sync="dialogVisible"
      :sup_this="sup_this"
      title="编辑图片"
    />
  </span>
</template>
<script>
import EForm from "./form";
export default {
  components: { EForm },
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
    };
  },
  methods: {
    to() {
      const _this = this.$refs.form;
      this.dialogVisible = true;
      this.$nextTick(() => {
        const { id, category, isShare, title } = this.data || {};
        _this.form = {
          id,
          title,
          category,
          isShare,
        };
      });
    },
  },
};
</script>
