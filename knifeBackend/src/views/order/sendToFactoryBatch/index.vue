<template>
  <div class="app-container">
    <avue-crud
      ref="crud"
      :option="tableOption"
      :data="tableData"
      :page="tablePage"
      :tableLoading="tableLoading"
      @size-change="sizeChange"
      @current-change="pageChange"
      @search-change="searchChange"
    >
      <template #sendTimeSearchForm="{ form, prop }">
        <SaleDateTime :time.sync="form[prop]" @change="searchChange"></SaleDateTime>
      </template>
      <template #menu="{ row: { id } }">
        <el-button type="text" @click="viewDetails(id)" v-p="['order:order:list']"
          >查看详情</el-button
        >
        <el-divider direction="vertical"></el-divider>
        <el-button
          type="text"
          :loading="exportBtnLoading"
          @click="orderExport(id)"
          v-p="['order:order:export']"
          >导出</el-button
        >
      </template>
    </avue-crud>
  </div>
</template>

<script>
import avueCrud from "@/mixins/avueCrud";
import { tableOption } from "./const";
import { ORDER_UN_EXPORTED } from "@/utils/constant";
import { sendToFactoryBatch as getList } from "@/api/order/batch";
import { orderList, exportForCustoms } from "@/api/order";
import saveAs from "jszip/vendor/FileSaver.js";
import SaleDateTime from "@/components/saleDateTime";

export default {
  mixins: [
    avueCrud({
      tableOption,
      getList,
    }),
  ],
  components: {
    SaleDateTime,
  },
  data() {
    return {
      exportBtnLoading: false,
      resetMergeData: {
        orderItems: [
          {
            asc: false,
            column: "send_time",
          },
          {
            asc: false,
            column: "id",
          },
        ],
      },
    };
  },
  created() {},
  methods: {
    orderExport(id) {
      this.exportBtnLoading = true;
      orderList({
        isReturnRelatedData: 1,
        sendBatchId: id,
      }).then(({ detail }) => {
        const idList = detail.map((item) => item.id);

        if (idList.length === 0) {
          this.$message.warning("该生产批次下无订单！");
          this.exportBtnLoading = false;
          return;
        }

        exportForCustoms({
          idList,
          isCustomsDeclaredExported: ORDER_UN_EXPORTED,
        })
          .then((res) => {
            saveAs(res, "订单");
            this.$message.success("导出成功");
          })
          .finally(() => {
            this.exportBtnLoading = false;
          });
      });
    },
    viewDetails(sendBatchId) {
      this.$router.push({
        path: "/orderManage/sendToFactoryBatch/viewDetails",
        query: {
          sendBatchId,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
