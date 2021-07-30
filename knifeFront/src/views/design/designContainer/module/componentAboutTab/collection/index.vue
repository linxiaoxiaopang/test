<template>
  <div class="collectionComponent">
    <el-tabs v-model="activeName">
      <el-tab-pane label="所有产品" name="first">
        <Product />
      </el-tab-pane>
      <el-tab-pane label="我的收藏" name="second">
        <Love />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Product from "./module/product";
import Love from "./module/love";
export default {
  components: {
    Product,
    Love,
  },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>

<style lang="scss" scoped>
.collectionComponent {
  height: 100%;
  margin-top: 15px;
  .el-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  ::v-deep {
    .el-tabs__content {
      flex: 1;
      .el-tab-pane {
        height: 100%;
      }
    }
    .el-tabs__item {
      left: 30px;
    }
    .el-tabs__active-bar {
      left: 30px;
    }
  }
}
</style>