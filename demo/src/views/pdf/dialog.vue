<template>
  <el-dialog title="提示" :visible.sync="dialog" width="30%">
    <div class="dom" id="hello">
      <div class="item">
        <div id="hl">hello wrold</div>
      </div>
      <div class="item">hello wrold 1</div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialog = false">取 消</el-button>
      <el-button type="primary" @click="print">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import "./lodopPrintPdf";
export default {
  data() {
    return {
      dialog: false,
    };
  },

  methods: {
    print() {
      this.$lodopPrintPdf({
        type: "html",
        printable: document.getElementById("hello"),
        onSuccess() {
          console.log("onSuccess");
          this.dialog = false;
        },
      });
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