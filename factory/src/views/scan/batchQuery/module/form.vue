<template>
  <el-row :id="id" class="print-wrapper tablePrint">
    <el-col :span="24">
      <h3>
        <span> 业务员： </span>
        <span style="margin-right: 15px; color: #1890ff">
          {{ data && data.create_by_name }}
        </span>
        <span>订单号：</span>
        <canvas ref="canvas" />
      </h3>
      <h5 v-if="data && data && data.remarks">
        <span> 备注：</span>{{ data && data && data.remarks }}
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
              <el-image
                @load="loadEnd"
                @error="loadEnd"
                :src="cover"
                v-if="cover"
              />
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
                @load="loadEnd"
                @error="loadEnd"
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
import { productListCols } from "../../cols";
import {createRandomNum} from '@/utils'
const JsBarcode = require("jsbarcode");
export default {
  props: {
    data: {
      type: Object,
      requird: true,
    },
    sup_this: {
      type: Object,
      default: null,
    },
    id: {
      type: String,
      default: "tablePrint",
    },
  },
  data() {
    return {
      productListCols,
      imgLoadFinishNum: 0
    };
  },
  watch: {
    data: {
      handler(newVal) {
        this.imgLoadFinishNum = 0
        if (!newVal) return;
        if (newVal && newVal.waybill) {
          JsBarcode(this.$refs.canvas, newVal && newVal.waybill, {
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
      const row = this.data || {};
      const { order_items = [] } = row;
      const tmp1 = [];
      order_items.map(({ count, prod_spec }, index) => {
        if (index % 2 == 0) {
          tmp1.push(Object.assign({}, prod_spec, {cover: prod_spec.cover ? `${prod_spec.cover}?id=${createRandomNum()}` : prod_spec.cover }, { count }));
          return;
        }
        const { SKU, cover, size } = prod_spec;
        Object.assign(tmp1.slice(-1)[0], {
          SKU1: SKU,
          cover1: cover ? `${cover}?id=${createRandomNum()}` : cover ,
          count1: count,
          size1: size,
        });
      });
      return tmp1;
    },
  },
  methods: {
    loadEnd() {
      if(++this.imgLoadFinishNum >= this.tableData.length) {
        this.$emit('imgLoadFinsh')
      }
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
