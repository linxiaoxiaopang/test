<template>
  <el-row :id="id" class="print-wrapper tablePrint">
    <el-col :span="24">
      <h3>
        <span> 业务员： </span>
        <span style="margin-right: 15px; color: #1890ff">
          {{ data && data[0] && data[0].create_by_name }}
        </span>
        <span>订单号：</span>
        <canvas ref="canvas" />
      </h3>
      <h5 v-if="data && data[0] && data[0].remarks">
        <span> 备注：</span>{{ data && data[0] && data[0].remarks }}
      </h5>

      <table>
        <thead>
          <tr>
            <th>图片</th>
            <th>货号</th>
            <th>尺码</th>
            <th>数量</th>
            <th>图片</th>
            <th>货号</th>
            <th>尺码</th>
            <th>数量</th>
          </tr>
        </thead>
        <tbody>
          <tr
            :key="index"
            v-for="(
              { SKU, SKU1, cover, size, cover1, size1, count, count1 }, index
            ) in tableData"
          >
            <td style="width: 120px">
              <el-image :src="cover" v-if="cover" />
            </td>
            <td style="width: 17%">{{ SKU }}</td>
            <td style="width: 10%">
              <span v-if="size !== undefined">
                {{ (size && size.name) || "均码" }}
              </span>
            </td>

            <td style="width: 8%; color: #ff4949">{{ count }}</td>
            <td style="width: 120px">
              <el-image
                :src="cover1 || cover"
                :style="{ opacity: cover1 ? 1 : 0 }"
              />
            </td>
            <td style="width: 17%">{{ SKU1 }}</td>
            <td style="width: 10%">
              <span v-if="size1 !== undefined">
                {{ (size1 && size1.name) || "均码" }}
              </span>
            </td>
            <td style="width: 8%; color: #ff4949">{{ count1 }}</td>
          </tr>
        </tbody>
      </table>
    </el-col>
  </el-row>
</template>
<script>
import { productListCols } from "../cols";
const JsBarcode = require("jsbarcode");
export default {
  props: {
    data: {
      type: Array,
      requird: true,
    },
    sup_this: {
      type: Object,
      default: null,
    },
    id: {
      type: String,
      default: 'tablePrint'
    }
  },
  data() {
    return {
      productListCols,
    };
  },
  watch: {
    data: {
      handler(newVal) {
        if (!newVal) return;
        if (newVal[0] && newVal[0].expressWaybillCode) {
          JsBarcode(this.$refs.canvas, newVal[0] && newVal[0].expressWaybillCode, {
            height: 30,
            // background: "#ccffff"
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    tableData() {
      const data = this.data;
      const row = data[0] || {};
      const { order_items = [] } = row;
      const tmp1 = [];
      order_items.map(({count, prod_spec }, index) => {
        if (index % 2 == 0) {
          tmp1.push(Object.assign({}, prod_spec, {count}));
          return;
        }
        const { SKU, cover, size } = prod_spec;
        Object.assign(tmp1.slice(-1)[0], {
          SKU1: SKU,
          cover1: cover,
          count1: count,
          size1: size,
        });
      });
      return tmp1;
    },
  },
};
</script>
<style lang="scss" scoped>
.tablePrint {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
</style>
