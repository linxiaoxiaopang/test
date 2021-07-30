<template>
  <div class="line inline-block">
    <el-button size="mini" :loading="loading" type="info" @click="to">
     <slot>{{typeText}}</slot>
    </el-button>
    <BulkDisableForm
      ref="form"
      v-if="dialogVisible"
      :title="typeText"
      :dialogVisible.sync="dialogVisible"
      :sup_this="sup_this"
      :cData="data"
      :type="type"
    />
  </div>
</template>
<script>
import BulkDisableForm from "./bulkDisableForm";
import cloneDeep from "lodash/cloneDeep";
import { PIC_ENABLE } from "@/utils/constant";
export default {
  components: { BulkDisableForm },
  props: {
    sup_this: {
      type: Object,
      required: true,
    },
     type: {
      type: [String, Number],
      default: 0,
    },
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      data: [],
    };
  },
  computed: {
    typeText () {
      return this.type== 1 ? '批量下架' : '批量禁用'
    }
  },
  methods: {
    async to() {
      try {
        const _this = this.sup_this;
        const disableData = _this.selectedData.filter(({disable}) => disable == PIC_ENABLE);
        if (!disableData.length) {
          this.$message({
            type: "warning",
            message: "请先选择有效的数据，再进行此操作",
          });
          return;
        }
        this.data = cloneDeep(disableData);
        this.$nextTick(() => {
          this.dialogVisible = true;
        });
      } catch (err) {}
    },
  },
};
</script>
<style lang="scss" scoped>
.el-button {
  background-color: #F5F5F5;
  color: #969799;
  border: 1px solid rgba($color: #969799, $alpha: 0.2)
}
</style>