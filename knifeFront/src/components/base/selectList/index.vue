<template>
  <el-select
    v-model="value"
    :placeholder="$attrs.placeholder || '请选择'"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <el-option
      v-for="item in options"
      :key="item[keyObj.value]"
      :label="item[keyObj.label]"
      :value="item[keyObj.value]"
    >
    </el-option>
  </el-select>
</template>

<script>
import selectOptions from "./selectOptions";
export default {
  props: {
    keyword: {
      required: true,
    },
    keyObj: {
      type: Object,
      default: () => ({ label: "name", value: "id" }),
    },
    menus: {
      type: Array,
      default: () => selectOptions,
    },
  },
  data() {
    return {
      options: this.menus,
      value: this.keyword,
    };
  },
  watch: {
    menus (newVal) {
      if(!newVal) {
        return
      }
      this.options = this.menus
    },
    keyword(newVal) {
      this.value = newVal;
    },
    value(newVal) {
      this.$emit("update:keyword", newVal);
    },
  },
};
</script>

<style>
</style>