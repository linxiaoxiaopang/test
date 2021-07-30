<template>
  <BaseDialog
    height="50vh"
    width="60vw"
    :dialogVisible.sync="dialog"
    :title="title"
  >
    <div class="referenceSizeSettingFormComponent" v-loading="loading">
      <div class="sku-wrapper">
        <div class="label">SKU名称：</div>
        <color-text-btn type="warning">
          {{ info.productExternalSkuCode }}
        </color-text-btn>
      </div>
      <div class="header">
        <!-- <div class="h-row">
          <div class="label">选择款式：</div>
          <selectList
            size="mini"
            placeholder="选择款式"
            filterable
            clearable
            :options="structs"
            :keyword.sync="mergeData.productStructName"
          />
        </div> -->
        <el-input
          clearable
          style="width: 200px"
          size="mini"
          placeholder="请输入原图字搜索"
          suffix-icon="el-icon-search"
          v-model="query.img_title"
        >
        </el-input>
      </div>

      <div class="table-wrapper">
        <CommonTable
          height="100%"
          :selection="false"
          :cols="cols"
          :span-method="spanMethod"
          :infoData="domData"
          :tableLoading="tableLoading"
        >
          <template #mergeSlot="{ scoped }">
            <div class="merge-slot-class">
              <el-image
                style="width: 32px; height: 32px"
                :src="figure(scoped.prod_show_images)"
                fit="contain"
              ></el-image>
              <div>
                {{ scoped.name || "暂无名字" }}
              </div>
            </div>
          </template>

          <slot>
            <el-table-column align="center" label="操作" width="100">
              <template slot-scope="{ row }">
                <ColorTextBtn @click="doRelation(row)" type="primay">
                  确定关联
                </ColorTextBtn>
              </template>
            </el-table-column>
          </slot>
        </CommonTable>
      </div>
    </div>

    <template #footer>
      <PaginationBar
        ref="paginationBar"
        layout="total, prev,slot, next, jumper"
        :hide-on-single-page="false"
        :total="total"
        :page-count="5"
        @refreshTableEventFun="refreshTableEventFun"
      >
        <template #layout="{ scoped: { curPage } }">
          <span style="text-align: center">{{ curPage }}</span>
        </template>
      </PaginationBar>
    </template>
  </BaseDialog>
</template>
<script>
import { relationCols as cols } from "./cols";
import { initDataMixin, commonFromMixin } from "@/mixins";
import cloneDeep from "lodash/cloneDeep";
import {
  PICSIZE,
  WAIT_DISPATCH,
  WAIT_GENERATE_WAYBILL,
} from "@/utils/constant";
import { relationRelationSku as associate } from "@/api/product/knifeApi";
import { orderUpdate } from "@/api/order";
import { orderItemUpdate as edit } from "@/api/order";
import colorTextBtn from "@/components/base/colorTextBtn.vue";
import throttle from "lodash/throttle";

let rowId = "";
export default {
  components: { colorTextBtn },
  mixins: [commonFromMixin, initDataMixin],
  props: {
    name: String,
    allData: {
      type: Array,
      required: true,
    },
    orderData: {
      type: Object,
      required: true,
    },
    isAdd: {
      type: Boolean,
      default: true,
    },
    info: {
      type: Object,
      require: true,
    },
    sup_this: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      cols,
      query: {
        img_title: "",
        productStructName: "",
        productCnName: "",
        orderId: this.info.id,
      },
      url: "/api/product/spec_prim_prod/all_prod",
      loading: false,
      structs: [],
    };
  },
  watch: {
    query: {
      handler() {
        this.throttle();
      },
      deep: true,
    },
  },
  computed: {
    domData() {
      const data = cloneDeep(this.data);
      const tmpArr = [];
      data.map((item) => {
        try {
          const { products = [], chinese_name, id: tId } = item;
          products.map((pItem) => {
            const { spec_prods, id: proId, ...rest } = pItem;
            spec_prods.map((item) => {
              tmpArr.push(
                Object.assign(item, { proId, chinese_name, tId }, rest)
              );
            });
          });
        } catch (err) {}
      });
      return tmpArr;
    },
    figure() {
      return (showImgs) => {
        try {
          return `${showImgs[0].path}?${PICSIZE.min}`;
        } catch (err) {
          return require("@/assets/images/logo.png");
        }
      };
    },
  },
  methods: {
    throttle: throttle(
      function () {
        this.init();
      },
      500,
      {
        leading: false,
        trailing: true,
      }
    ),
    spanMethod({ row, column, rowIndex, columnIndex }) {
      const id = row.name;
      let spanNum = 1;
      if (columnIndex == 0) {
        row.rowNum = rowIndex;
        if (rowIndex == 0) {
          rowId = undefined;
        }
      }

      if (columnIndex > 0) return;
      if (rowId == id && row.rowNum == rowIndex) {
        return {
          rowspan: 0,
          colspan: 0,
        };
      }
      rowId = id;
      row.rowNum = rowIndex + 1;
      const data = this.domData;
      for (let i = rowIndex + 1; i < data.length; i++) {
        const item = data[i];
        const itemId = item.name;
        if (rowId == itemId) {
          spanNum++;
        } else {
          break;
        }
      }
      return {
        rowspan: spanNum,
        colspan: 1,
      };
    },
    doRelation(row) {
      const { SKU, id } = row;
      this.$alert(
        `确定外部 SKU:<span style="color: #C03639;">${this.info.productExternalSkuCode}</span>与系统内部SKU：<span style="color: #C03639;">${SKU}</span>匹配关联吗？再次导入 同一SKU时不会再做匹配`,
        "确认",
        {
          confirmButtonText: "确定",
          dangerouslyUseHTMLString: true,
          callback: async (action) => {
            if (action === "confirm") {
              this.loading = true;
              try {
                const params = [
                  { id: id, externalSku: this.info.productExternalSkuCode },
                ];
                const { code, detail } = await associate(params);
                if ($SUC({ code })) {
                  if (!this.info.id) {
                    this.$emit("updateProductExternalSkuCode", SKU);
                    this.$message.success("关联成功");
                    this.dialog = false;
                  } else {
                    await this.edit(SKU);
                  }
                }
              } catch (err) {
                console.log(err);
              }
              this.loading = false;
              return;
            }

            this.$message({
              type: "info",
              message: "已取消",
            });
          },
        }
      );
    },
    async edit(productInternalSkuCode) {
      const isChangeOrder = this.allData.every(
        ({ productInternalSkuCode }) => productInternalSkuCode
      );
      const { expressWaybillCode } = this.orderData;
      const { code } = await edit({
        productInternalSkuCode,
        id: this.info.id,
      });
      if ($SUC({ code })) {
        if (isChangeOrder) {
          const { code: orderCode } = await orderUpdate({
            id: this.orderData.id,
            orderStatus: expressWaybillCode
              ? WAIT_DISPATCH
              : WAIT_GENERATE_WAYBILL,
          });
          if ($SUC({ code: orderCode })) {
            this.$message.success("更新成功");
            this.sup_this && this.sup_this.init();
            this.dialog = false;
          }
        } else {
          this.sup_this && this.sup_this.init();
          this.dialog = false;
        }
        return;
      }
    },
    success() {
      this.$message.success("操作成功");
      this.init();
      this.$nextTick(() => {
        this.dialog = false;
      });
    },
    cancel() {
      this.dialog = false;
    },
    initCallBack() {
      /*this.data = [
        {
          productCnName: "产品名称",
          productStructName: "款式",
          productSizeName: "尺码",
          expressExpireTime: "2021-4-12",
          productExternalSkuCode: "SKU_12420",
        },
        {
          productCnName: "产品名称",
          productStructName: "款式",
          productSizeName: "尺码",
          expressExpireTime: "2021-4-12",
          productExternalSkuCode: "SKU_12420",
        },
        {
          productCnName: "产品名称",
          productStructName: "款式",
          productSizeName: "尺码",
          expressExpireTime: "2021-4-12",
          productExternalSkuCode: "SKU_12420",
        },
        {
          productCnName: "产品名称",
          productStructName: "款式",
          productSizeName: "尺码",
          expressExpireTime: "2021-4-12",
          productExternalSkuCode: "SKU_12420",
        },
        {
          productCnName: "产品名称",
          productStructName: "款式",
          productSizeName: "尺码",
          expressExpireTime: "2021-4-12",
          productExternalSkuCode: "SKU_12420",
        },
        {
          productCnName: "产品名称",
          productStructName: "款式",
          productSizeName: "尺码",
          expressExpireTime: "2021-4-12",
          productExternalSkuCode: "SKU_12420",
        },
        {
          productCnName: "产品名称",
          productStructName: "款式",
          productSizeName: "尺码",
          expressExpireTime: "2021-4-12",
          productExternalSkuCode: "SKU_12420",
        },
        {
          productCnName: "产品名称",
          productStructName: "款式",
          productSizeName: "尺码",
          expressExpireTime: "2021-4-12",
          productExternalSkuCode: "SKU_12420",
        },
        {
          productCnName: "产品名称",
          productStructName: "款式",
          productSizeName: "尺码",
          expressExpireTime: "2021-4-12",
          productExternalSkuCode: "SKU_12420",
        },
        {
          productCnName: "产品名称",
          productStructName: "款式",
          productSizeName: "尺码",
          expressExpireTime: "2021-4-12",
          productExternalSkuCode: "SKU_12420",
        },
      ];*/
    },
  },
};
</script>
<style lang="scss" scoped>
.referenceSizeSettingFormComponent {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 20px;
  .sku-wrapper {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    padding: 10px 20px;
    background-color: $bg-color;
  }
  .header {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    margin-bottom: 15px;
    align-items: center;
    .h-row {
      display: flex;
      align-items: center;
      .label {
        white-space: nowrap;
      }
    }
  }
  .table-wrapper {
    flex: 1;
    overflow: auto;
    .el-table {
      border: 1px solid #ebeef5;
      border-right: none;
      ::v-deep {
        td {
          border-right: none;
        }
      }
    }
    .merge-slot-class {
      position: relative;
      display: flex;
      align-items: center;
      .el-image {
        margin-right: 10px;
        background: $border-color;
      }
    }
  }
}
</style>