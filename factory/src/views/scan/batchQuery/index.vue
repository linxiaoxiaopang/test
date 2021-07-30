<template>
  <section class="app-container batchQueryPage">
    <div class="scan-order-title">批量扫描查询运单号</div>
    <eHeader :query="query" :sup_this="sup_this" />
    <commonTable
      :tableLoading="tableLoading"
      :cols="cols"
      :selection="false"
      :infoData="data"
      height="auto"

    >
      <template #waybillHeaderSlot="{ scoped: row }">
        <span>运单号</span>
      </template>
      <template #waybillSlot="{ scoped: row }">
        <template v-if="row.old_orders && row.old_orders.length">
          <div
            style="text-decoration: line-through; margin-top: 5px"
            :key="index"
            v-for="(o, index) in row.old_orders || []"
          >
            {{ o.old_waybill }}
          </div>
          <div style="color: #ff4949">
            {{ row[row.prop] }}
          </div>
        </template>
        <span v-else>
          {{ row[row.prop] }}
        </span>
        <span style="color: #ff4949;">(共{{ totalProduct(row) }}个产品)</span>
        <el-button
          size="mini"
          type="text"
          v-copy="`${row[row.prop]}`"
          v-copy:callback="handleCopied"
        >
          复制
        </el-button>
        
      </template>
      <template #expiration_timeSlot="{ scoped: row }">
        <span :style="expireDirTime(row)" v-if="row.order_status <= 1">
          {{ row.expiration_time && $moment(row.expiration_time).fromNow() }}
        </span>
        <div v-else style="text-align: center">--</div>
      </template>

      <template #order_statusSlot="{ scoped: row }">
        <el-tag
          style="
            max-width: 150px;
            word-break: break-all;
            display: inline-block;
            white-space: normal;
            height: auto;
          "
          :type="tagType(row)"
        >
          {{ status(row) }}
        </el-tag>
      </template>
      <template #sale_dateSlot="{ scoped: row }">
        <span>{{ parseDay(row[row.prop]) }}</span>
      </template>
      <template #delivery_timeSlot="{ scoped: row }">
        <span>{{ parseTime(row[row.prop]) }}</span>
      </template>
      <template #cover="{ scoped: row, scoped: { prop } }">
        <el-image
          style="width: 80px; height: 80px"
          fit="contain"
          :src="row[prop] | formatUrl"
          :preview-src-list="row[prop] | prvFormatUrl"
        />
      </template>
      <template #fedexSlot="{ scoped: row }">
        <el-tag type="primary" v-if="row[row.prop] && row[row.prop].name">
          {{ row[row.prop].name }}
        </el-tag>
        <el-tag type="danger" v-else>
          {{ "暂无物流" }}
        </el-tag>
      </template>
      <template #order_itemsSlot="{ scoped: row }">
        <el-tag
          type="primary"
          size="mini"
          style="margin-right: 5px; margin-bottom: 5px"
          :key="skuItem"
          v-for="skuItem in orderItems(row)"
        >
          {{ skuItem }}
        </el-tag>
      </template>
      <template #remarksSlot="{ scoped: row }">
        <div style="color: red">
          {{ row[row.prop] }}
        </div>
      </template>

      <slot>
        <el-table-column
          label="操作"
          width="250px"
          align="center"
          fixed="right"
    
        >
          <template slot-scope="scoped">
            <Detail :data="scoped.row" :sup_this="sup_this" />
            <el-button type="success" size="mini" @click="print(scoped.$index)"
              >打印彩图</el-button
            >
          </template>
        </el-table-column>
      </slot>
    </commonTable>
    <eForm
      :data="printData"
      id="bulkSearch"
      ref="formTable"
      @imgLoadFinsh="imgLoadFinsh"
    />
  </section>
</template>

<script>
import Detail from '@/components/detail'

import eHeader from "./module/header";
import eForm from "./module/form";

import { orderMixin } from "@/mixins";
import { parseDay } from "@/utils";
import printJS from "print-js";
import {orderListCols as cols} from '@/views/cols'
import { bulkScanSearch } from "@/api/order/orderApi";

export default {
  mixins: [orderMixin],
  components: {
    Detail,

    eHeader,
    eForm,
  },
  data() {
    return {
      cols,
      tableLoading: false,
      query: {},
      data: [],
      loadEnd: false,
      printData: {},
      sup_this: this,
      printObj: {
        printable: "bulkSearch",
        type: "html",
        scanStyles: false,
        maxWidth: "100%",
        documentTitle: "彩图打印单",
        css: ["../../../../static/print.css"],
      },
    };
  },
  computed: {
    orderItems() {
      return (row) => {
        const { order_items = [] } = row || {};
        return  order_items.map(({ count, prod_spec }) => {
          return `${prod_spec && prod_spec.SKU} * ${count}`;
        });
      };
    },

    totalProduct() {
      return (row) => {
        let total = 0;
        const { order_items = [] } = row || {};
        order_items.map(({ count }) => {
          total += isNaN(Number(count)) ? 0 : Number(count);
        });
        return total;
      };
    },
  },
  methods: {
    parseDay,
    print(index) {
      this.printData = this.data[index];
      console.log("this.printData", this.printData);
      if (this.loadEnd) {
        this.$nextTick(() => {
          printJS(this.printObj);
        });
      }
    },
    imgLoadFinsh() {
      this.$nextTick(() => {
        this.loadEnd = true;
        printJS(this.printObj);
      });
    },
    handleCopied() {
      this.$message.success("复制成功");
    },
    async init() {
      this.data = [];
      this.loadEnd = false;
      const expressWaybillCode = [...new Set(this.query.waybill.split(/\r\n|\n|\r/))];
      const { code, detail } = await bulkScanSearch({
        expressWaybillCode,
      });
      if (code >= 100 && code < 300) {
        this.data = detail;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.count {
  color: $color-danger;
}
.dark {
  color: #000;
}
.batchQueryPage {
  min-height: 600px;
  .scan-order-title {
    color: $color-primary;
    text-align: center;
    line-height: 2rem;
    padding-bottom: 1rem;
    font-size: 1.25rem;
    font-size: 35px;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid $border-color;
  }
}
</style>
