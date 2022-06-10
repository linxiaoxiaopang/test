<template>
  <div>
    <PrintBtn
      class="btn"
      printable="hello"
      type="html"
      :paperSize="[85.03937007874015, 198.4251968503937]"
    />
    <div class="dom" id="hello">
      <div class="item">hello wrold</div>
      <div class="item">hello wrold 1</div>
    </div>
  </div>
</template>

<script>
import PrintBtn from "./printBtn";
export default {
  components: {
    PrintBtn,
  },
  mounted() {
    document.body.appendChild(document.getElementById("hello"));
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
  top: 0;
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