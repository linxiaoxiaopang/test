<template>
  <el-input
    class="searchBoxComponent"
    v-model="value"
    :placeholder="$attrs.placeholder || '请选择'"
    prefix-icon="fa fa-search"
    style="width: 340px"
    :clearable="$attrs.clearable === undefined ? true : $attrs.clearable"
    @keyup.enter.native="toQuery"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template #append>
      <div class="append" @click="toQuery">搜索</div>
    </template>
  </el-input>
</template>

<script>
export default {
  props: {
    keyword: {
      required: true,
    },
  },
  data() {
    return {
      value: this.keyword,
    };
  },
  watch: {
    keyword(newVal) {
      this.value = newVal;
    },
    value(newVal) {
      this.$emit("update:keyword", newVal);
    },
  },
  methods: {
    toQuery() {},
  },
};
</script>

<style lang="scss" scoped>
.searchBoxComponent {
  ::v-deep {
    .el-input__prefix {
      margin-left: 10px;
    }
    .el-input__inner {
      border-radius: 20px 0 0 20px;
      padding-left: 40px;
      border-right: none;
      border-color: $color-primary;
    }
    .el-input-group__append {
      background-color: $color-primary;
      color: #fff;
      border-radius: 0 20px 20px 0;
      border-color: $color-primary;
      padding: 0;
      .append {
        padding: 0 15px;
        height: 38px;
        line-height: 38px;
        cursor: pointer;
      }
    }
  }
}
</style>