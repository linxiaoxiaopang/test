<template>
  <div>
    <!-- <PrintBtn
      class="btn"
      printable="hello"
      type="html"
      :paperSize="[85.03937007874015, 198.4251968503937]"
    /> -->
    <el-button @click="print"> 打印 </el-button>
    <!-- <div class="dom" id="hello">
      <div class="item">
        <div id="hl">
          hello wrold
        </div>
      </div>
      <div class="item">hello wrold 1</div>
    </div> -->
    <Dialog ref="dialog" />

    <ConfirmDialog
      v-if="confirmVisible"
      :confirmVisible.sync="confirmVisible"
      :selectData="tableData"
    />
  </div>
</template>

<script>
import "./lodopPrintPdf";
import Dialog from "./dialog";

import ConfirmDialog from "./confirmDialog";
// import PrintBtn from "./printBtn";
export default {
  components: {
    // PrintBtn,
    Dialog,
    ConfirmDialog,
  },

  data() {
    return {
      confirmVisible: false,
      tableData: [],
    };
  },

  methods: {
    showDialog() {
      this.confirmVisible = true;
    },

    print() {
      this.showDialog();
      return;
      // this.$refs.dialog.dialog = true;
      // this.$lodopPrintPdf({
      //   type: 'html',
      //   printable: document.getElementById('hello')
      // })
    },
  },
};
</script>

<style>
.btn {
  position: absolute;
  z-index: 1;
}
.dom {
  position: fixed;
  left: 0;
  top: 80px;
  width: 85.03pt;
  box-sizing: border-box;
}
.item {
  width: 100%;
  height: 198.4251968503937pt;
  box-sizing: border-box;
}
.item:first-child {
  background: red;
}
.item:nth-child(2) {
  background: green;
}
#hl {
  margin-top: 50px;
  background: yellow;
}
@media screen and (min-resolution: 96dpi) {
  .item {
    color: red !important;
  }
}
@media screen and (resolution: 96dpi) {
  body .item {
    color: #f00 !important;
  }
}
</style>