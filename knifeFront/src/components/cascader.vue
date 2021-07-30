<template>
  <el-cascader
    class="cascaderComponent"
    v-model="value"
    :show-all-levels="false"
    :options="data"
    :props="prop"
    :size="$attrs.size || 'small'"
    :placeholder="$attrs.placeholder || '请选择分类'"
    v-bind="$attrs"
    v-on="$listeners"
  ></el-cascader>
</template>

<script>
import {
  list, //获取图库类别列表
} from "@/api/product/protoCateApi";

export default {
  props: {
    selectedValue: {
      type: [String, Array],
      required: true,
    },
    prop: {
      type: Object,
      default: () => ({
        label: "name",
        value: "id",
        expandTrigger: "hover",
        checkStrictly: true,
        multiple: false,
      }),
    },
  },
  watch: {
    value(newVal) {
      this.$emit("update:selectedValue", newVal);
    },
    selectedValue(newVal) {
      this.value = newVal;
    },
  },
  data() {
    return {
      value: "",
      data: [],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      const { detail, code } = (await list()) || [];
      if ($SUC({ code })) {
        this.data = detail;
        this.delEmptyChildren(this.data);
      }
    },
    delEmptyChildren(data) {
      data.map((item) => {
        const { children } = item;
        if (!children.length) {
          return this.$delete(item, "children");
        }
        this.delEmptyChildren(children);
      });
    },
  },
};
</script>

<style lang="scss">
// .el-cascader-panel .el-radio {
//   width: 100%;
//   height: 100%;
//   z-index: 10;
//   position: absolute;
//   top: 10px;
//   right: 10px;
// }
// .el-cascader-panel .el-radio__input {
//   visibility: hidden;
// }
// .el-cascader-panel .el-cascader-node__postfix {
//   top: 10px;
// }
</style>