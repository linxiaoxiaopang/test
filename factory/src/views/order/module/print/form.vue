<template>
  <el-row :id="id" class="print-wrapper tablePrint">
    <el-col :span="24">
      <h3>
        <span> 业务员： </span>
        <span style="margin-right: 15px; color: #1890ff">
          {{ data.importUserName }}
        </span>
        <span>订单号：</span>
        <canvas ref="canvas" />
      </h3>
      <h5 v-if="data.remarks"><span> 备注：</span>{{ data.remarks }}</h5>

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
                {{ size || "均码" }}
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
                {{ size1 || "均码" }}
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
    productData: {
      type: Array,
      required: true,
    },
  },
  watch: {
    data: {
      handler() {
        this.createBarcode();
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    tableData() {
      const data = this.productData;
      const tmp1 = [];
      data.map(
        (
          {
            productCount: count,
            productCover: cover,
            productSizeName: size,
            productExternalSkuCode: SKU,
          },
          index
        ) => {
          if (index % 2 == 0) {
            tmp1.push(
              Object.assign(
                {},
                {
                  count,
                  size,
                  cover: cover ? cover : require("@/assets/images/default.png"),
                  SKU,
                }
              )
            );
            return;
          }
          Object.assign(tmp1.slice(-1)[0], {
            SKU1: SKU,
            cover1: cover ? cover : require("@/assets/images/default.png"),
            count1: count,
            size1: size,
          });
        }
      );
      return tmp1;
    },
  },
  methods: {
    createBarcode() {
      const waybill = this.data.expressWaybillCode;
      if (waybill) {
        const { canvas } = this.$refs;
        if (canvas) {
          JsBarcode(canvas, waybill, {
            height: 30,
          });
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.tablePrint {
  position: absolute;
  z-index: 1000;
  clip: rect(0, 0, 0, 0);
}
</style>
