<template>
  <div class="dialog-warpper">
    <el-dialog
      title="查看"
      :visible.sync="visible"
      width="1040px"
      :before-close="handleClose"
    >
      <div class="content-warpper">
        <el-image
          :src="order.thumbnail_path"
          style="width: 100px; height: 100px"
        ></el-image>
        <span class="title">{{ order.title }}</span>
      </div>
      <el-table :data="tableData" border class="table-warpper">
        <el-table-column prop="orderNumber" label="订单号"> </el-table-column>
        <el-table-column prop="way" label="物流方式"> </el-table-column>
        <el-table-column prop="expressNumber" label="运单号"> </el-table-column>
        <el-table-column prop="expressTime" label="物流到期时间"> </el-table-column>
        <el-table-column prop="basicState" label="刀版图状态"> </el-table-column>
        <el-table-column prop="importTime" label="导入时间"> </el-table-column>
        <el-table-column prop="state" label="状态"> </el-table-column>
      </el-table>
      <PaginationBar
        ref="paginationBar"
        @refreshTableEventFun="refreshTableEventFun"
        :total="total"
      />
    </el-dialog>
  </div>
</template>

<script>
//如果有引入initDataMixin这个混入，就需要传url参数，不然会报错
//页面需要引入这个混入的原因是分页器需要知道请求的数据，然后进行分页
import { initDataMixin } from "@/mixins";
export default {
  mixins: [initDataMixin],
  props: {
    visible: {
      type: Boolean,
    },
    order: {
      type: Object,
    },
  },
  data() {
    return {
      url: "/api/product/back_prim_prod",
      tableData: [
        {
          orderNumber: "",
          way: "",
          expressNumber: "",
          expressTime: "",
          basicState: "",
          importTime: "",
          state: "",
        },
      ],
    };
  },
  methods: {
    handleClose() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-table th > .cell {
    color: #595961 !important;
  }
}
.dialog-warpper {
  .table-warpper {
    padding: 0px 24px 10px 24px;
  }
  .content-warpper {
    padding: 22px 0 0 24px;
  }
  ::v-deep {
    .el-dialog__title {
      font-size: 14px;
      color: #1a1a1a;
    }
    .el-dialog__header {
      height: 56px;
      line-height: 56px;
      padding: 0 0 0 22px;
      border: 1px solid #dcdee0;
    }
    .el-dialog__body {
      padding: 0;
    }
  }
  .content-warpper {
    display: flex;
    margin-bottom: 21px;
    .title {
      margin-left: 20px;
      color: #1a1a1a;
    }
  }
}
</style>
