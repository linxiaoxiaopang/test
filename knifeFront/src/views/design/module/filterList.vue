<template>
  <div class="filterListCompoent">
    <Screen label="采购价格" :fields="moneyArr" :value.sync="query.money">
      <MergeInputOfMoney />
    </Screen>
    <Screen label="产品重量" :fields="weightArr" :value.sync="query.weight" />
    <el-checkbox v-model="query.hot">热门</el-checkbox>
    <el-checkbox v-model="query.new">新品</el-checkbox>
  </div>
</template>

<script>
import Screen from "@/components/screen";
import MergeInputOfMoney from "./mergeInputOfMoney";
export default {
  components: {
    Screen,
    MergeInputOfMoney,
  },
  data() {
    return {
      query: {
        money: "所有",
        weight: "所有",
        hot: true,
        new: true,
      },
      moneyArr: ["所有", "1-10元", "10-20元", "20-30元", "30-40元"],
      weightArr: ["所有", "1-100g", "100-200g", "200-300g", "300-400g"],
    };
  },
};
</script>

<style lang="scss" scoped>
.filterListCompoent {
  padding: 20px 15px;
  background: $bg-color;
  .el-checkbox {
    margin-right: 40px;
  }
}
</style>