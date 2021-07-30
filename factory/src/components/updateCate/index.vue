<template>
  <div style="display: inline-block">
    <el-button size="mini" type="info" :loading="loading" @click="to">
      {{ isBulk ? "批量修改产品分类" : "修改产品分类" }}
    </el-button>
    <UpdateCateForm
      ref="form"
      v-if="dialogVisible"
      :title="isBulk ? '批量修改产品分类' : '修改产品分类'"
      :dialogVisible.sync="dialogVisible"
      :sup_this="sup_this"
      :data="cData"
    />
  </div>
</template>
<script>
import UpdateCateForm from "./updateCateForm";
import cloneDeep from "lodash/cloneDeep";

export default {
  components: { UpdateCateForm },
  props: {
    sup_this: {
      type: Object,
      required: true,
    },
    data: {
      type: [Array, Object],
      required: true,
    },
    isBulk: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      cData: [],
    };
  },
  methods: {
    async to() {
      if (Array.isArray(this.data)) {
        if (!this.data.length) {
          this.$message({
            type: "warning",
            message: "请先选择需要的数据，再进行此操作",
          });
          return;
        }
      }
      if (Array.isArray(this.data)) {
        this.cData = cloneDeep(this.data);
      } else {
        this.cData = [cloneDeep(this.data)];
      }
      this.$nextTick(() => {
        this.dialogVisible = true;
      });
    },
  },
};
</script>
