<template>
  <div :id="idKey" class="print-wrapper staffTablePrint">
    <div class="flex-wrap-item">
      <div class="content-wrapper">
        <div>工厂名称：{{ data.supplierName }}</div>
        <div>订单数量：{{ data.totalQuantity }}</div>
      </div>
      <div class="qrcode-wrapper">
        <img
          class="barcode"
          ref="productLabelBarcodeCanvas"
          :id="`productLabelBarcodeCanvas`"
        />
        <div>{{ data.batchCode }}</div>
      </div>
    </div>
    <div class="flex"></div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    data: {
      type: Object,
      requird: true,
    },
    idKey: {
      type: String,
      default: "staffTablePrintId",
    },
  },

  methods: {
    getPath(item) {
      return `${item.style.displayImageUrl}`;
    },
  },
};
</script>
<style  scoped>
.staffTablePrint {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  text-align: center;
  width: 1000px;
  clip: rect(0, 0, 0, 0);
}
.flex {
  flex-wrap: wrap;
}
</style>
