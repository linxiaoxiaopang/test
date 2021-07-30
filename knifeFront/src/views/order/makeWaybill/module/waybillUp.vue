<template>
  <div class="waybillUp line">
    <XlsxTable style="display: inline-block" @on-select-file="selectExcelData">
      <color-text-btn type="primary"> 上传运单号 </color-text-btn>
    </XlsxTable>
    <BaseDialog
      title="导入订单预览"
      :dialogVisible.sync="waybillUpDialogVisible"
      width="50%"
      append-to-body
    >
      <waybillTable :data="data" :statusInfo="statusInfo"></waybillTable>

      <template #footer>
        <el-button
          type="primary"
          @click="doImport"
          :class="[
            !!(!statusInfo.succesCount && statusInfo.failCount) &&
              'is-disabled',
          ]"
        >
          确认导入
        </el-button>
        <el-button :loading="loading" @click="waybillUpDialogVisible = false">
          取消
        </el-button>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import XlsxTable from "@/components/xlsxTable";
import waybillTable from "./waybillUpTable";
import { orderList, batchWaybill, orderGroupUpdate } from "@/api/order";
import { ORDER_KEYS, WAIT_DISPATCH } from "@/utils/constant";
import { changeArrKey } from "@/utils/common";
import { validatenull } from "@/components/avue/utils/validate";

export default {
  components: {
    waybillTable,
    XlsxTable,
  },
  props: {
    row: {
      type: Object,
      default() {
        return {};
      },
    },
    sup_this: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      data: [],
      changeData: [],
      orderData: [],
      errData: [],
      loading: false,
      waybillUpDialogVisible: false,
    };
  },
  computed: {
    statusInfo() {
      const data = this.data;
      const uploadedCount = data.length;
      const succesCount = data.filter(({ 订单号, 运单号 }) => 订单号 && 运单号)
        .length;
      const failCount = uploadedCount - succesCount;
      const failUploadedCount = 0;
      return {
        uploadedCount,
        succesCount,
        failCount,
        failUploadedCount,
      };
    },
  },
  watch: {
    waybillUpDialogVisible(newVal) {
      if (!newVal) {
        this.resetData();
      }
    },
  },
  methods: {
    resetData() {
      this.data = [];
      this.changeData = [];
      this.orderData = [];
      this.errData = [];
    },
    selectExcelData(excelData) {
      const { body = [] } = excelData;
      this.data = body;
      this.changeData = changeArrKey(this.data, ORDER_KEYS);
      this.uploadWaybill();
      this.showWaybillUpDialogVisible();
    },
    showWaybillUpDialogVisible() {
      this.waybillUpDialogVisible = true;
    },
    waybillUpDialog() {
      // console.log(this.data);
      this.waybillUpDialogVisible = false;
    },
    doImport() {
      const { failCount, uploadedCount } = this.statusInfo;
      if (failCount) {
        return this.$message.warning(
          "存在解析失败订单，请修改后再上传运单号！"
        );
      }
      if (!uploadedCount) {
        return this.$message.warning(
          "上传文件不能为空，请修改后再上传运单号！"
        );
      }
      if (this.errData.length) {
        return this.$message.error(`${this.errData.join("，")}`);
      }
      this.loading = true;
      this.orderData.map((item) => {
        item.orderStatus = WAIT_DISPATCH;
      });
      batchWaybill({
        list: this.orderData,
      })
        .then((res) => {
          if ($SUC(res)) {
            this.$message.success("操作成功");
            this.sup_this && this.sup_this.init();
          }
          return res;
        })
        .finally(() => {
          this.waybillUpDialogVisible = false;
          this.loading = false;
        });
    },
    check(data, otherData) {
      let tmpObj = {};
      let codeObj = {};
      let errData = this.errData;
      data.map(({ orderCode, expressWaybillCode }) => {
        if (!tmpObj[expressWaybillCode]) {
          tmpObj[expressWaybillCode] = [];
        }
        if (!tmpObj[expressWaybillCode].includes(orderCode)) {
          tmpObj[expressWaybillCode].push(orderCode);
        }
      });
      for (let key in tmpObj) {
        if (tmpObj[key].length > 1) {
          errData.push(`${key}运单号对应${tmpObj[key].join("，")}多个订单号`);
        }
      }
      data.map(({ orderCode, expressWaybillCode }) => {
        if (!codeObj[orderCode]) {
          codeObj[orderCode] = [];
        }
        if (!codeObj[orderCode].includes(expressWaybillCode)) {
          codeObj[orderCode].push(expressWaybillCode);
        }
      });

      for (let key in codeObj) {
        if (codeObj[key].length > 1) {
          errData.push(`${key}订单号对应${codeObj[key].join("，")}多个运单号`);
        }
      }
      if (errData.length) return;
      let codes = Object.values(tmpObj);
      let orderCodes = [];
      codes.map((item) => {
        item.map((code) => orderCodes.push(code));
      });
      otherData.map((item) => {
        const { orderCode } = item;
        const fIndex = orderCodes.findIndex((code) => code == orderCode);
        if (fIndex == -1) {
          this.errData.push(`缺少${orderCode}的运单`);
        }
        console.log("data", data);
        const expressWaybillCodeItem = data.filter(
          (item) => item.orderCode === orderCodes[fIndex]
        );
        if (
          Array.isArray(expressWaybillCodeItem) &&
          expressWaybillCodeItem.length
        ) {
          item.expressWaybillCode = expressWaybillCodeItem[0]&&expressWaybillCodeItem[0].expressWaybillCode;
        }
      });
    },
    uploadWaybill() {
      let data = this.changeData.map((item) => item.orderCode);
      orderList({
        orderGroupId: this.row.id,
      }).then((res) => {
        this.orderData = res.detail;
        this.check(this.changeData, this.orderData);
      });
    },
  },
};
</script>

<style scoped lang="scss">
.waybillUp {
  display: inline-block;
  margin-right: 10px;
}
</style>
