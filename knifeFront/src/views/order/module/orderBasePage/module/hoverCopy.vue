<template>
  <div class="hover-copy-component" @mouseenter="mouseenter" @mouseleave="mouseleave">
    <slot></slot>
    <div class="copy" v-if="value" v-show="show" v-copy="value">复制</div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String
    }
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    mouseleave() {
      this.show = false
    },
    mouseenter() {
      this.show = true
    }
  }
}
</script>

<style lang="scss" scoped>
.hover-copy-component {
  display: inline-block;
  position: relative;
  .copy {
    text-align: center;
    cursor: pointer;
    background: white;
    display: inline-block;
    width: 35px;
    height: 25px;
    border: solid 1px rgb(220, 223, 230);
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10000;
  }
}
</style>
