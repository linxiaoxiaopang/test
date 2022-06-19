<template>
  <el-dialog
    width="900px"
    title="确认打印"
    :visible.sync="confirmVisible"
    @closed="onClose"
  >
    <p>确认生成批次，打印清单？</p>
    <template #footer>
      <el-button type="primary" @click="onConfirm"> 确定</el-button>
      <el-button @click="onClose"> 取消 </el-button>
      <list ref="list" idKey="printId" :data="listData" />
    </template>
  </el-dialog>
</template>

<script>
import list from "./list";

export default {
  components: { list },
  props: {
    confirmVisible: {
      type: Boolean,
      default: false,
    },
    selectData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      listData: {},
    };
  },
  methods: {
    onClose() {
      this.$emit("update:confirmVisible", false);
    },

    async onConfirm() {
      console.log("this.$refs.list.$el", this.$refs.list.$el);
      this.$nextTick(() => {
        this.$lodopPrintPdf({
          type: "html",
          printable: this.$refs.list.$el,
          onSuccess: this.onClose
        });
      });
    },
  },
};
</script>

<style scoped>
.el-input {
  width: 240px;
}
</style>
