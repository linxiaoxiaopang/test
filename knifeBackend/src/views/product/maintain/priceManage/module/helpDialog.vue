<template>
  <div>
    <el-tooltip
      :enterable="false"
      effect="light"
      placement="bottom"
      content="点击查看计算关系"
      @click.native="handleIconClicked"
    >
      <span><i class="el-icon-question" style="color: blue; font-size: 18px"></i></span>
    </el-tooltip>
    <BaseDialog
      style="text-align: left"
      v-if="showDialog"
      @closeHandle="handleDialogClosed"
      :dialogVisible.sync="showDialog"
      :append-to-body="true"
      :modal-append-to-body="true"
      width="60vw"
      height="360px"
      title="查看计算关系"
      class="base-warpper"
    >
      <div class="example">例如有以下设定：</div>
      <div class="information-warpper">
        <div>初始价格： a 元</div>
        <div class="diff">尺码公差： b 元</div>
        <div class="diff">档位公差： c 元</div>
      </div>
      <el-table :data="priceData" border class="table-border" :header-row-class-name="tableRowClassName">
        <template v-for="({ prop, label }, index) in priceColData">
          <el-table-column v-if="prop == 'size'" :key="index" :prop="prop" :label="label" align="center">
          </el-table-column>
          <el-table-column v-else :key="index" :prop="prop" :label="label" align="center">
            <template v-slot="{ row }">
              <span>{{ row[`${prop}`] }}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <div class="notice-warpper">
        <span class="notice">*</span><span class="notice-information">需要特别注意： a-2b-2c > 0</span>
      </div>
      <template #footer>
        <span></span>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showDialog: false,
      priceData: [
        { size: 'S', price: 'a', price1: 'a-c', price2: 'a-2c' },
        { size: 'M', price: 'a-b', price1: 'a-b-c', price2: 'a-b-2c' },
        { size: 'L', price: 'a-2b', price1: 'a-2b-c', price2: 'a-2b-2c' }
      ],
      priceColData: [
        { prop: 'size', label: '尺码' },
        { prop: 'price', label: '1-9件价格(元)' },
        { prop: 'price1', label: '10-30件价格价格(元)' },
        { prop: 'price2', label: '31+件价格(元)' }
      ]
    }
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'tableHeader'
      } else {
        return
      }
    },
    handleDialogClosed() {
      this.showDialog = false
    },
    handleIconClicked() {
      this.showDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
.base-warpper {
  .example {
    font-weight: bold;
    font-size: 26px;
    margin: 10px 0 30px 0;
    text-align: center;
    color: #333;
  }
  .information-warpper {
    width: 60%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
  }
  .notice-warpper {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    .notice,
    .notice-information {
      color: red;
      font-weight: bold;
      font-size: 20px;
    }
    .notice {
      margin-right: 10px;
      padding-top: 22px;
    }
    .notice-information {
      margin-top: 20px;
    }
  }
  .table-border {
    margin-top: -5px;
    border-left: 1px solid #ebeef5;
  }
  .el-table {
    border-collapse: collapse !important;
    ::v-deep {
      .tableHeader th {
        border: 1px solid #ebeef5 !important;
      }
    }
  }
}
</style>
