<template>
  <div class="formPart">
    <el-form size="mini" :model="query" label-width="150" inline>
      <template v-for="({ label, placeholder, model }, index) in orderFormData">
        <el-form-item :key="index" v-if="label == '刀版图状态'" :label="label">
          <el-select v-model="query.isKnifeLayoutCreated" :placeholder="placeholder" clearable @change="toQuery">
            <el-option label="已全部生成" value="1"></el-option>
            <el-option label="未全部生成" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :key="index" v-else-if="label == '导入日期'" :label="label">
          <SaleDateTime :time.sync="time" @change="toQuery" />
        </el-form-item>
        <el-form-item :key="index" v-else-if="label == 'button'">
          <el-button class="el-icon-search" type="primary" style="margin-left: -40px" @click="toQuery"></el-button>
        </el-form-item>
        <el-form-item :key="index" v-else :label="label">
          <el-input :placeholder="placeholder" v-model="query[model]" @keyup.enter.native="toQuery"></el-input>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import SaleDateTime from '@/components/saleDateTime'
import { commonEheaderMixin } from '@/mixins'
export default {
  mixins: [commonEheaderMixin],
  components: {
    SaleDateTime
  },
  props: {
    query: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      time: [],
      formField: [{ prop: 'importTime' }],
      orderFormData: [
        { label: '刀版图状态', placeholder: '请选择' },
        { label: '导入日期' },
        { label: '业务员', placeholder: '输入业务员名称', model: 'userName' },
        // {
        //   label: "产品名称",
        //   placeholder: "输入业产品名称",
        //   model: "productCnName",
        // },
        { label: '订单编号', placeholder: '输入订单编号', model: 'orderCode' },
        {
          label: '运单号',
          placeholder: '输入运单号',
          model: 'expressWaybillCode'
        },
        { label: 'button' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.formPart {
  margin: 20px 0;
  background-color: #F7F8FA;
  padding: 20px 20px 5px;
  .el-form-item {
    margin-right: 50px;
  }
}
</style>
