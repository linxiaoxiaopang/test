<template>
  <div class="productPage app-container">
    <div class="title">
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <p>{{ title }}</p>
          <el-input
            clearable
            class="titleSearch"
            placeholder="尝试'T恤'看看"
            prefix-icon="el-icon-search"
            v-model="query.search"
            size="small"
          ></el-input>
        </el-col>
      </el-row>
    </div>
    <div class="filter-wrapper">
      <div class="l-filter">
        <div class="item">
          <i class="fa fa-thumbs-o-up"></i>
          <span>热门</span>
        </div>
        <div class="item">
          <i class="fa fa-file-text-o"></i>
          <span>最新</span>
        </div>
      </div>
      <div class="r-filter">
        <el-checkbox v-model="checked">全选</el-checkbox>
      </div>
    </div>
    <div v-loading="tableLoading">
      <el-row :gutter="15">
        <el-col :span="4" :key="index" v-for="(item, index) in data">
          <ProCard :data="item" @linkToDetail="linkToDetail(item)" />
        </el-col>
      </el-row>
    </div>
    <div class="shopping-cart">
      <el-button
        :disabled="disabled"
        :type="disabled ? 'info' : 'primary'"
        size="mini"
      >
        加入购物车
      </el-button>
    </div>
    <PaginationBar
      ref="paginationBar"
      @refreshTableEventFun="refreshTableEventFun"
      :total="total"
    />
  </div>
</template>

<script>
import { initDataMixin } from "@/mixins";
import ProCard from "./proCard";
export default {
  mixins: [initDataMixin],
  components: {
    ProCard,
  },
  props: {
    title: String,
    resetUrl: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      url: this.resetUrl,
      checked: false,
      size: 24,
    };
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
    checked(newVal) {
      this.data.map((item) => {
        this.$set(item, "checked", newVal);
      });
    },
  },
  computed: {
    disabled() {
      return !this.data.some(({ checked }) => checked);
    },
  },
  methods: {
    linkToDetail({ id }) {
      this.$router.push(`/product/detail?id=${id}`);
    },
    toQuery() {
      this.page = 1;
      this.init();
    },
  },
};
</script>

<style lang="scss" scoped>
.productPage {
  .title {
    background: rgba($color: #3841db, $alpha: 0.3);
    height: 120px;
    p {
      text-align: center;
      font-size: 15px;
      margin-top: 30px;
    }
    .titleSearch {
      margin-top: 10px;
    }
    ::v-deep {
      .el-input__inner {
        border-radius: 20px;
        font-size: 12px;
      }
    }
  }
  .filter-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px 0;
    .l-filter {
      display: flex;
      .item {
        margin-right: 15px;
        i {
          font-size: 12px;
          margin-right: 10px;
        }
      }
    }
    .r-filter {
      .el-checkbox {
        padding: 5px 10px;
        border: 1px solid $border-color;
      }
    }
  }
  .shopping-cart {
    margin: 20px 0;
    text-align: right;
    .el-button {
      width: 120px;
    }
  }
}
</style>
