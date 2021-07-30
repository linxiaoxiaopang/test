<template>
  <div class="sendFactory">
    <el-button
      class="el-button--send"
      @click="showSendFactory"
      v-if="orderStatus == 41"
      >发到工厂</el-button
    >
    <el-dialog
      title="选择供应商"
      :visible.sync="showSendFactoryVisible"
      width="30%"
    >
      <avue-form ref="form"
                 v-model="form"
                 :option="formOption"
      ></avue-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSendFactoryVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendFactory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { sendFactory } from "@/api/order/orderListData";
export default {
  props: {
    orderStatus: {
      type: String,
      required: true,
    },
    factoryData: {
      type: Array,
      required: true,
    },
    sup_this: {
      type: Object,
      required: true,
    },
  },
  data() {
    let formOption = {
      menuBtn: false,
      size: 'medium',
      column: [
        {
          prop: 'supplierId',
          labelWidth: 0,
          span: 24,
          type: 'select',
          rules: [
            {
              required: true,
              message: '供应商必选',
            }
          ]
        }
      ]
    }
    this.$store.dispatch('HandleOption', formOption)
    return {
      showSendFactoryVisible: false,
      supplierOptions: [],
      form: {},
      formOption,
      supplier: "",
    };
  },
  methods: {
    async showSendFactory() {
      if (!this.factoryData.length) {
        this.$message.warning("请先选择数据再进行此操作");
        return false;
      }
      this.showSendFactoryVisible = true;
      this.supplierOptions = await this.$store.dispatch('GetDic', 'supplierId');
    },
    async sendFactory() {
      this.$refs.form.validate(valid => {
        if (valid) {
          sendFactory({ idList: this.factoryData, ...this.form})
            .then(({code}) => {
              if ($SUC({ code })) {
                this.$message.success('发布成功')
                this.sup_this.init();
              } else {
                this.$message.success('发布失败')
              }
              this.showSendFactoryVisible = false
            })
        }
      })
    },
  },
};
</script>

<style lang="scss" scoped></style>
