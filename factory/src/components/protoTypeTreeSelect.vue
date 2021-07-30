<template>
  <TreeSelect
    :selectedValue.sync="value"
    :options="data"
    :defaultExpandLevel="2"
    :normalKeys="{
      id: 'id',
      name: 'name',
    }"
    :placeholder="$attrs.placeholder || '请选择分类，默认为“默认分类”。'"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
import TreeSelect from "@/components/treeSelect";

import {
  list, //获取图库类别列表
} from "@/api/product/protoCateApi";

export default {
  components: {
    TreeSelect,
  },
  props: {
    selectedValue: [Array, Number, String, Object],
  },
  data() {
    return {
      value: "",
      data: [],
    };
  },
  watch: {
    value(newVal) {
      this.$emit("update:selectedValue", newVal);
    },
    selectedValue(newVal) {
      this.value = newVal;
    },
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      const { detail, code } = (await list()) || [];
      if ($SUC({ code })) {
        this.data = detail;
        this.$emit('dataLoadEnd', detail)
      }
    },
  },
};
</script>

<style>
</style>