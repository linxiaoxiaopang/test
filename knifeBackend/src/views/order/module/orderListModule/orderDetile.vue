<template>
  <div class="orderDetile">
    <el-button type="text" @click="showOrderDetileDialogVisible"
      >查看详情</el-button
    >
    <el-dialog
      title="订单详情"
      :visible.sync="orderDetileDialogVisible"
      width="50%"
    >
      <div>
        详细信息
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderDetileDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="orderDetileDialog"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orderDetileDialogVisible: false,
      formData1: []
    }
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  methods: {
    orderDetileDialog(){
      this.orderDetileDialogVisible = false
    },
    showOrderDetileDialogVisible(){
      this.orderDetileDialogVisible = true
    }
  }
};
</script>

<style lang="scss" scoped>
.orderDetile {
  display: inline-block;
}
</style>
