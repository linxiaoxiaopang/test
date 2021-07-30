<template>
  <div class="formPart">
    <el-form :model="query" inline size="mini">
      <el-form-item label="导出状态">
        <el-select v-model="query.isCustomsDeclaredExported" clearable @change="toQuery">
          <el-option label="未导出" value="0"></el-option>
          <el-option label="已导出" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="导入时间">
        <SaleDateTime :time.sync="time" @change="toQuery"/>
      </el-form-item>
      <el-form-item label="订单号 ">
        <el-input v-model="query.orderCode" placeholder="搜索订单号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="el-icon-search" type="primary" @click="toQuery"
          ></el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import SaleDateTime from "@/components/saleDateTime";
import { commonEheaderMixin } from "@/mixins";
export default {
  mixins: [commonEheaderMixin],
  components: {
    SaleDateTime,
  },
  props: {
    query: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      time: [],
      formField: [{ prop: "importTime" }],
    };
  },
};
</script>

<style scoped lang="scss">
  .formPart {
    margin: 20px 0;
    background-color: #F7F8FA;
    padding: 20px 20px 5px;
    .el-form-item {
      margin-right: 20px;
    }
  }
</style>
