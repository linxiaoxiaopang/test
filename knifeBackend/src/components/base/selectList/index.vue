<template>
  <el-select
    v-model="value"
    :placeholder="$attrs.placeholder || '请选择'"
    :clearable="$attrs.clearable === undefined ? true : $attrs.clearable"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <el-option
      v-for="(item, index) in options"
      :key="index"
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
  created() {
    this.initOption();
  },
  watch: {
    menus(newVal) {
      if (!newVal) {
        return;
      }
      this.options = this.menus;
    },
    keyword(newVal) {
      this.value = newVal;
      if (Array.isArray(newVal) && typeof newVal[0] === "object") {
        let valueKey = this.keyObj.value;
        this.value = newVal.map((item) => item[valueKey]);
      }
    },
    value(newVal) {
      this.$emit("update:keyword", newVal);
    },
  },
  methods: {
    initOption() {
      if (this.$attrs.options) {
        this.options = this.$attrs.options;
      }
    },
  },
};
</script>

<style></style>
