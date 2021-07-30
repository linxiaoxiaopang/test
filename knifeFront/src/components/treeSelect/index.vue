<template>
  <treeselect
    :class="[size == 'mini' && 'mini']"
    v-model="value"
    :options="options"
    :normalizer="normalizer"
    :defaultExpandLevel="$attrs.defaultExpandLevel || Infinity"
    v-bind="$attrs"
    v-on="$listeners"
    @select="selectHandler"
  />
</template>

<script>
// import the component
import Treeselect from "@riophae/vue-treeselect";
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  // register the component
  components: { Treeselect },
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    size: {
      type: String,
      default: "mid",
    },
    normalKeys: {
      type: Object,
      defalut: () => ({
        id: "id",
        name: "name",
      }),
    },
    selectedValue: [Number, String, Object],
    name: String,
  },

  data() {
    return {
      // define the default value
      value: null,
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
  methods: {
    selectHandler(node) {
      this.$emit("update:name", node.name);
      this.$emit("selectNodeHandler", node);
    },
    //格式化options的字段
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node[this.normalKeys.id],
        label: node[this.normalKeys.name],
        children: node.children,
      };
    },
  },
};
</script>
<style lang="scss">
.mini {
  .vue-treeselect__control {
    line-height: 26px;
    height: 26px;
    width: 150px;

    .vue-treeselect__input {
      font-size: 12px;
    }
    .vue-treeselect__placeholder {
      line-height: 26px;
      font-size: 12px;
    }
  }

  .vue-treeselect__menu-container {
    width: 150px !important;
    font-size: 12px !important;
  }
  .vue-treeselect__single-value {
    font-size: 12px;
     height: 26px;
    width: 150px;
  }
  .vue-treeselect__single-value {
    line-height: 26px;
  }
}
.vue-treeselect__control {
  line-height: 36px;
}
.vue-treeselect__label {
  color: $color-gray;
  font-weight: normal;
}
.vue-treeselect--has-value .vue-treeselect__multi-value {
  line-height: 20px;
}
</style>