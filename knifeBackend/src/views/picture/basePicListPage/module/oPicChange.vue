<template>
  <span>
    <el-button type="info" size="mini" class="filter-item" @click="to">
      更换原图
    </el-button>
    <OForm
      ref="form"
      :dialogVisible.sync="dialogVisible"
      :sup_this="sup_this"
      title="更换原图"
    />
  </span>
</template>
<script>
import OForm from "./oForm";
export default {
  components: { OForm },
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
        const { id, category_name, path, title} = this.data || {};
        _this.form = {
          id,
          title,
          category_name,
          path: [{
            url: path
          }],
        };
      });
    },
  },
};
</script>
