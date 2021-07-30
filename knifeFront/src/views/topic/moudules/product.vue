<template>
  <div class="product-warpper">
    <div class="center-warpper">
      <div>
        <h2 class="topic-title">200+热门定制产品 全年无淡季</h2>
        <div class="information">行业趋势实时更新，上架产品先人一步</div>
      </div>
      <div class="product-content">
        <div class="productBox" v-for="(item, index) in productList" :key="index">
          <ProtoCard :home="false" :sup_this="sup_this" :data="item" />
        </div>
      </div>
      <div class="button-warpper">
        <el-button type="primary" @click="$router.push('/design/index')">查看全部产品</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { list } from '../api/list'
import ProtoCard from '../../design/module/protoCard.vue'
export default {
  data() {
    return {
      productList: [],
      sup_this: this
    }
  },
  async created() {
    const {
      detail: { results: res }
    } = await list()
    this.productList = res
  },
  components: {
    ProtoCard
  }
}
</script>

<style lang="scss" scoped>
.product-warpper {
  height: 1070px;
  width: 100%;
  background: #fff;
  .center-warpper {
    width: 1200px;
    margin: 0 auto;

    .topic-title {
      text-align: center;
    }
    .information {
      text-align: center;
      margin-bottom: 60px;
      font-size: 20px;
      color: #666666;
    }
    .product-content {
      display: flex;
      flex-wrap: wrap;
      align-content: space-between;
      height: 654px;
      width: 1200px;
      .productBox {
        margin-right: 10px;
        width: 224px;
        height: 322px;
        overflow: hidden;
        box-shadow: 0px 0px 10px 2px rgb(226, 226, 226);
      }
    }
    .button-warpper {
      margin-top: 50px;
      display: flex;
      justify-content: center;
      .el-button {
        width: 158px;
        height: 50px;
      }
    }
  }
}
</style>
