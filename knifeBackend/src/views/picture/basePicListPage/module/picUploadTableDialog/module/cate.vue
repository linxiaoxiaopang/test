<template>
  <span>
    <el-button type="text" size="mini" class="filter-item" @click="to">
      设置图片分类
    </el-button>
    <CForm
      v-if="dialogVisible"
      ref="form"
      title="批量设置图片类型"
      :sup_this="sup_this"
      :dialogVisible.sync="dialogVisible"
      :selectedData="[data]"
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
      this.dialogVisible = true;
      const { category, category_name } = this.data;
      this.$nextTick(() => {
        const _this = this.$refs.form;
        _this.form = {
          category,
          category_name: category ? category_name : undefined,
        };
      });
    },
  },
};
</script>
