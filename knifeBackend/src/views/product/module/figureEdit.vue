<template>
  <div class="line inline-block">
    <el-button
      icon="el-icon-edit-outline"
      type="text"
      size="mini"
      class="filter-item"
      @click="to"
    >
      编辑图片
    </el-button>
    <FigureForm
      ref="form"
      :dialogVisible.sync="dialogVisible"
      :sup_this="sup_this"
      title="编辑图片"
    />
  </div>
</template>
<script>
import FigureForm from "./figureForm";
import cloneDeep from "lodash/cloneDeep";

export default {
  components: { FigureForm },
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
        const { curIndex = 0, prim_struct = [] } = cloneDeep(this.data) || {};
        const { id: struct, structure, figures = [] } =
          prim_struct[curIndex] || {};
        _this.form = {
          struct,
          structure,
          path: figures,
        };
        _this.oForm = cloneDeep(_this.form)
      });
    },
  },
};
</script>
