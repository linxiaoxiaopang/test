<template>
  <div class="orderDetile">
    <el-dialog
      title="产品详情"
      :visible.sync="orderDetailDialogVisible"
      width="800px"
    >
      <div>
        <div class="border-left-2">收货和物流信息</div>
        <table width="100%" border="1" cellspacing="0" cellpadding="0" class="custom-table table-form mt15">
          <colgroup>
            <col width="18%">
            <col width="32%">
            <col width="18%">
            <col width="32%">
          </colgroup>
          <tr>
            <td>收货人:</td>
            <td>{{ data.consigneeName }}</td>
            <td>收货人电话:</td>
            <td>{{ data.consigneeContactPhone }}</td>
          </tr>
          <tr>
            <td>收货人手机号码:</td>
            <td>{{ data.consigneeContactMobilePhone }}</td>
            <td>国家:</td>
            <td>{{ data.consigneeCountryCode }}</td>
          </tr>
          <tr>
            <td>州/省:</td>
            <td>{{ data.consigneeProvince }}</td>
            <td>城市:</td>
            <td>{{ data.consigneeCity }}</td>
          </tr>
          <tr>
            <td>物流方式:</td>
            <td>{{ data.$expressCompanyId }}</td>
            <td>运单号:</td>
            <td>{{ data.expressWaybillCode }}</td>
          </tr>
          <tr>
            <td>邮编:</td>
            <td>{{ data.consigneePostcode }}</td>
            <td>收货地址:</td>
            <td>{{ data.consigneeDetailAddress }}</td>
          </tr>
        </table>
      </div>
      <div class="mt20">
        <div class="border-left-2">
          <span class="mr15">产品信息</span>
          <span class="mr15">订单号: {{ data.orderCode }}</span>
          <span class="mr15">导入时间: {{ data.importTime }}</span>
        </div>
        <avue-crud ref="crud"
                   :data="orderItemList"
                   :option="orderOption"
                   :page="page"
                   @size-change="sizeChange"
                   @current-change="pageChange"
        >
          <template #productCnName="{ row }">
            <div class="flex-middle align-center">
              <div class="flex-middle">
                <el-image :src="row.productShowCover" style="width: 50px; height: 50px;" class="h100 mr5">
                  <div slot="error">
                    <img src="@/assets/images/default.png" width="50" height="50" alt="" class="block">
                  </div>
                </el-image>
                <div class="nowrap">
                  <div>{{ row.productCnName }}</div>
                </div>
              </div>
            </div>
          </template>
        </avue-crud>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orderDetailDialogVisible: false,
      orderOption: {
        menu: false,
        pageSizes: [4],
        column: [
          {
            label: '商品信息',
            prop: 'productCnName',
            slot: true,
            width: 180
          },
          {
            label: 'SKU',
            prop: 'productInternalSkuCode',
          },
          {
            label: '单价',
            prop: 'unitPrice',
          },
          {
            label: '质量',
            prop: 'unitNetWeight',
          },
          {
            label: '款式',
            prop: 'productStructName',
          },
          {
            label: '尺码',
            prop: 'productSizeName',
          },
          {
            label: '数量',
            prop: 'productCount',
          },
        ]
      },
      page: {
        pageIndex: 1,
        pageSize: 4,
        total: 0,
      },
    }
  },
  props: {
    visible: {
      type: Boolean,
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    },
  },
  computed: {
    orderItemList({ data: { orderItemDTOList = [] }, page: { pageIndex, pageSize } }) {
      return orderItemDTOList?.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
    }
  },
  watch: {
    data: {
      handler() {
        this.page = {
          pageIndex: 1,
          pageSize: 4,
          total: this.data.orderItemDTOList.length,
        }
      },
      deep: true
    },
    visible: {
      handler(n) {
        this.orderDetailDialogVisible = n;
      },
      immediate: true
    },
    orderDetailDialogVisible(n) {
      this.$emit("update:visible", n)
    }
  },
  methods: {
    pageChange(e) {
      this.page.pageIndex = e;
    },
    sizeChange(e) {
      this.page.pageIndex = 1;
      this.page.pageSize = e;
    },
  }
};
</script>

<style lang="scss" scoped>
.orderDetile {
  display: inline-block;
}

// 订单详情 - 弹窗
.custom-table {
  border-collapse: collapse;
  text-align: center;
  border-color: #EBEEF5;

  td {
    padding: 8px;
  }
  tr,td {
    border-color: #EBEEF5;
  }
}
.table-form {
  td:nth-child(2n-1) {
    background-color: #f7f8fa;
    font-weight: bold;
  }
}

.border-left-2 {
  padding-left: 5px;
  border-left: 2px solid $color-primary;
}
</style>
