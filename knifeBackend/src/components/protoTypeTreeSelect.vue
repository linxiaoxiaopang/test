<template>
  <TreeSelect
    :selectedValue.sync="value"
    :options="data"
    :defaultExpandLevel="2"
    :normalKeys="{
      id: 'id',
      name: 'name',
    }"
    :placeholder="$attrs.placeholder || '请选择分类'"
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
    selectedValue: {
      handler(newVal) {
        this.value = newVal;
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters({
      data: 'proCategory',
    }),
  },
};
</script>

<style>
</style>