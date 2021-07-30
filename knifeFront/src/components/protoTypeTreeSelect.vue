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
      data: 'proCategory',
    }),
  },
};
</script>

<style scoped>
  ::v-deep .vue-treeselect__single-value {
    width: 100%;
  }
</style>