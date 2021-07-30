<template>
  <div class="mergeInputOfMoneyComponent">
    <el-input
      size="mini"
      placeholder="价格"
      v-model="value1"
      style="width: 120px"
    >
      <el-button slot="append"> 元 </el-button>
    </el-input>
    <span>-</span>
    <el-input
      size="mini"
      placeholder="价格"
      v-model="value2"
      style="width: 120px"
    >
      <el-button slot="append"> 元 </el-button>
    </el-input>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value1: "",
      value2: "",
    };
  },
};
</script>

<style lang="scss" scoped>
.mergeInputOfMoneyComponent {
  .el-input {
    font-size: 12px;
  }
  span {
    display: inline-block;
    padding: 0 15px;
  }
  ::v-deep {
    .el-input-group__append {
      background: transparent;
      padding-left: 10px;
      padding-right: 10px;
    }
  }
}
</style>