<template>
  <div style="display:inline-block;">
    <el-button type="text" size="mini" class="filter-item" @click="to">
     编辑
    </el-button>
    <EForm
      ref="form"
      v-if="dialogVisible"
      :dialogVisible.sync="dialogVisible"
      :sup_this="sup_this"
      :data="data"
      title="编辑基本信息"
    />
  </div>
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
      this.dialogVisible = true;
    },
  },
};
</script>
