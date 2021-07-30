<template>
  <div class="selectAllComponent">
    <el-checkbox :value="checked" @change="changeHandler">全选</el-checkbox>
    <span class="char">|</span>
    <span>已选择{{ selectedCount }}个，</span>
    <span>共{{ data.length }}个。</span>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  computed: {
    checked() {
      return this.data.length && this.data.every(({ checked }) => checked);
    },
    selectedCount() {
      return this.data.filter(({ checked }) => checked).length;
    },
  },
  methods: {
    changeHandler(bool) {
      console.log(bool);
      this.$emit("changeHandler", bool);
    },
  },
};
</script>

<style lang="scss" scoped>
.selectAllComponent {
  display: flex;
  margin: 30px 0 25px 0;
  align-items: center;
  font-size: 14px;
  color: $color-gray;
  .char {
    padding: 0 10px;
  }
}
</style>