<template>
  <div>
    <commonTable
      :cols="cols"
      :selection="false"
      :infoData="data"
      height="auto"
      size="mini"
    >
      <template #waybillHeaderSlot="{ scoped: row }">
        <!--<span>运单号</span>--><span class="count">({{ totalProduct }})</span>
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
        <el-button
          size="mini"
          type="text"
          v-copy="`${row[row.prop]}`"
          v-copy:callback="handleCopied"
        >
          复制
        </el-button>
      </template>
      <template #expressExpireTimeSlot="{ scoped: row }">
        <span :style="expireDirTime(row)" v-if="row.expressExpireTime">
          {{ row.expressExpireTime && $moment(row.expressExpireTime).fromNow() }}
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
      <template #sale_dateSlot="{ scoped: row, scoped: { index } }">
        <span>{{ parseDay(row[row.prop]) }}</span>
      </template>
      <template #delivery_timeSlot="{ scoped: row, scoped: { index } }">
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
        <el-tag type="primary" v-if="row[row.prop]">
          {{ getLabel("expressCompanyId", row[row.prop]) }}
        </el-tag>
        <el-tag type="danger" v-else>
          {{ "暂无物流" }}
        </el-tag>
      </template>
      <template #weightSlot="{ scoped: row }">
        <span style="color: red; font-size: 40px">
          {{ row[row.prop] || "未称重" }}
        </span>
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
      <slot></slot>
    </commonTable>
  </div>
</template>

<script>
import orderMixin from "@/mixins/orderMixin";
import {getLabel} from "@/components/avue/utils/util";

export default {
  mixins: [orderMixin],
  props: {
    cols: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
  },
  computed: {
    domData() {
      const tmpArr = [];
      this.data.map((item) => {
        const { order_items = [], fedex, ...oRest } = item || {};
        order_items.map((sItem) => {
          const { prod_spec, id: itemId, ...rest } = sItem || {};
          tmpArr.push({
            ...Object.assign({}, prod_spec, rest, oRest, { itemId }),
          });
        });
      });
      return tmpArr;
    },
    totalProduct() {
      let total = 0;
      this.domData.map(({ count }) => {
        total += isNaN(Number(count)) ? 0 : Number(count);
      });
      return total;
    },
  },
  methods: {
    getLabel,
    handleCopied(val) {
      this.$message.success("复制成功");
    },
  },
};
</script>

<style>
</style>