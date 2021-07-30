<template>
  <div class="cateAndSearchComponent">
    <component
      :is="componentName"
      class="cateAndSearchComponent-imageTypeTreeSelect"
      size="mini"
      style="margin-right: 10px"
      ref="imageTypeTreeSelect"
      :selectedValue.sync="query.category"
      :maxHeight="200"
    />
    <el-input
      clearable
      placeholder="搜索名称"
      suffix-icon="el-icon-search"
      v-model="query[searchKey]"
      size="mini"
    >
    </el-input>
  </div>
</template>

<script>
import ProtoTypeTreeSelect from "@/components/protoTypeTreeSelect";
import ImageTypeTreeSelect from "@/components/imageTypeTreeSelect";

export default {
  components: {
    ProtoTypeTreeSelect,
    ImageTypeTreeSelect,
  },
  props: {
    sup_this: {
      type: Object,
      required: true,
    },
    query: {
      type: Object,
      required: true,
    },
    searchKey: {
      type: String,
      default: 'search'
    },
    componentName: {
      tyep: String,
      default: "ProtoTypeTreeSelect",
    },
  },
  watch: {
    query: {
      handler() {
        this.queryTimer && clearTimeout(this.queryTimer);
        this.queryTimer = setTimeout(() => {
          this.toQuery();
        }, 300);
      },
      deep: true,
    },
  },
  methods: {
    toQuery() {
      const _this = this.sup_this;
      _this.page = 1;
      _this.init();
    },
  },
};
</script>

<style lang="scss" scoped>
.cateAndSearchComponent {
  display: flex;
  .el-input {
    flex: 1;
    margin-left: 10px;
  }
}
.cateAndSearchComponent-imageTypeTreeSelect.cateAndSearchComponent-imageTypeTreeSelect {
  ::v-deep {
    .vue-treeselect__control {
      width: 100px;
    }
  }
}
</style>