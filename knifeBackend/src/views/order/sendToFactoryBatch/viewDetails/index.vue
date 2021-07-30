<template>
    <div class="app-container">
        <avue-crud ref="crud"
                   :option="tableOption"
                   :data="tableData"
                   :page="tablePage"
                   :tableLoading="tableLoading"
                   @size-change="sizeChange"
                   @current-change="pageChange"
                   @search-change="searchChange"
        >
            <template #menu="{ row }">
                <changeStateBtn :data="row" :sup_this="sup_this" v-p="['order:order:update']"></changeStateBtn>
                <el-divider direction="vertical"></el-divider>
                <el-button type="text" @click="viewDetails(row)">查看详情</el-button>
            </template>
        </avue-crud>

        <order-detail :visible.sync="orderDetailDialogVisible" :data="orderDetailData"></order-detail>
    </div>
</template>

<script>
  import avueCrud from "@/mixins/avueCrud";
  import { tableOption } from "./const";
  import { orderList as getList } from "@/api/order";
  import changeStateBtn from "@/views/order/module/orderListModule/changeStateBtn";
  import orderDetail from "@/views/order/orderDetail";

  export default {
    components: {
      changeStateBtn,
      orderDetail,
    },
    mixins: [
      avueCrud({
        tableOption,
        getList,
      })
    ],
    data() {
      return {
        sup_this: this,
        resetMergeData: {
          sendBatchId: this.$route.query.sendBatchId,
          isReturnRelatedData: 1,// 是否返回订单orderItemDTOList：0不返回，1返回
        },
        orderDetailDialogVisible: false,
        orderDetailData: {},
      }
    },
    created() {
    },
    methods: {
      viewDetails(row) {
        this.orderDetailData = row;
        this.orderDetailDialogVisible = true
      },
    }
  };
</script>

<style lang="scss" scoped></style>
