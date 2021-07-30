<template>
  <el-pagination
    ref="pagination"
    :class="[comstomClass]"
    :current-page.sync="pagingInfo.page"
    :page-sizes="sizes"
    :page-size="pagingInfo.size"
    :total="total"
    :background="$attrs.background === undefined ? true : $attrs.background"
    :layout="$attrs.layout || 'prev, pager, next, slot'"
    :hide-on-single-page="
      $attrs['hide-on-single-page'] === undefined
        ? true
        : $attrs['hide-on-single-page']
    "
    v-bind="$attrs"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
  >
    <template>
      <slot
        name="layout"
        :scoped="{
          curPage: pagingInfo.page,
          total,
          totalPage: Math.ceil(total / pagingInfo.size),
        }"
      >
        <span>
          <el-input
            :value="goValue"
            @input="inputHandler"
            size="mini"
            style="width: 40px"
          ></el-input>
          <span class="go" @click="go">GO</span>
          <span class="total-page" v-if="showTotal">
            共{{ Math.ceil(total / pagingInfo.size) }}页</span
          >
        </span>
      </slot>
    </template>
  </el-pagination>
</template>
<script>
export default {
  props: {
    comstomClass: {
      type: String,
      default: "defaultClass",
    },
    total: Number,
    showTotal: {
      type: Boolean,
      default: false,
    },
    resetSizes: {
      type: Array,
      default: () => [10, 20, 50],
    },
  },
  data() {
    return {
      goValue: 1,
      pagingInfo: {
        page: 1,
        size: 10,
      },
      sizes: this.resetSizes,
    };
  },
  watch: {
    "pagingInfo.page"(newVal) {
      console.log('newVal', newVal)
      console.log('pagingInfo', this.pagingInfo)
      this.goValue = newVal;
    },
  },
  methods: {
    go() {
      if (!this.goValue) {
        this.goValue = 1;
      }

      this.$set(this.pagingInfo, "page", this.goValue);
      if (this.$refs.pagination) {
        console.log("this.pagingInfo", this.pagingInfo.page);
        //更新上一页,下一页按钮的状态
        this.$nextTick(() => {
          this.$refs.pagination.internalCurrentPage = this.pagingInfo.page;
        });
      }
      this.handleCurrentChange()
      // this.$emit("go", this.goValue);
    },
    inputHandler(val) {
      let num = "";
      if (val === "") {
        this.goValue = "";
        return;
      }
      if (!/^[1-9]\d*$/.test(val)) return;
      num = val;
      num = Math.min(Math.ceil(this.total / this.pagingInfo.size), num);
      this.goValue = num;
    },
    reFreshpage(page) {
      this.pagingInfo.page = page;
    },
    handleSizeChange(val) {
      this.pagingInfo.size = val;
      this.pagingInfo.page = 1;
      this.$emit("refreshTableEventFun", this.pagingInfo);
    },
    handleCurrentChange(val) {
      this.$emit("refreshTableEventFun", this.pagingInfo);
    },
  },
};
</script>
<style lang="scss" scoped>
.defaultClass.el-pagination {
  text-align: center;
  border-top: none;
  padding: 10px 0;
  padding-right: 15px;
}
.el-pagination {
  ::v-deep {
    .btn-prev,
    .btn-next,
    .more.more,
    .number.number {
      border-radius: 50%;
    }
    .el-input--mini .el-input__inner {
      padding: 0;
    }
  }

  .go {
    margin-left: 10px;
    border-radius: 4px;
    color: $color-primary;
    border: 1px solid;
    cursor: pointer;
  }
  .total-page {
    margin-left: 10px;
    font-size: $color-gray;
    font-size: 12px;
    vertical-align: baseline;
    position: relative;
    top: 2px;
  }
}
</style>
