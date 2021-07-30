<template>
  <TreeSelect
    :selectedValue.sync="value"
    :options="data"
    :defaultExpandLevel="2"
    :normalKeys="{
      id: 'id',
      name: 'name',
    }"
    placeholder="请选择图库类型，默认全部图库分类。"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
import TreeSelect from "@/components/treeSelect";
import { mapGetters } from "vuex";

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
   computed: {
    ...mapGetters({
      data: 'category',
    }),
  },
};
</script>

<style>
</style>