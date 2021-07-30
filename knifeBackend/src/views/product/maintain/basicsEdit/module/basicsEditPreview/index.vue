<template>
  <div class="line inline-block">
    <el-button @click="to">
      预览
    </el-button>
    <previewDialog
      ref="form"
      v-if="dialogVisible"
      :dialogVisible.sync="dialogVisible"
      :sup_this="sup_this"
      title="预览"
      v-bind="$attrs"
    />
  </div>
</template>
<script>
import previewDialog from "./previewDialog"

export default {
  components: { previewDialog },
  props: {
  
  },
  data() {
    return {
      sup_this: this,
      dialogVisible: false
    }
  },
  methods: {
    to() {
      this.dialogVisible = true
      this.$nextTick(() => {
      
      })
    },
  },
};
</script>
