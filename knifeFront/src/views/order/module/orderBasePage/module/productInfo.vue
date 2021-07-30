<template>
  <div class="order-page-product-info">
    <div class="product-wrapper" v-for="item in data">
      <!-- 未关联产品 -->
      <div class="wrapper haveNotProduct" v-if="!item.productId">
        <span class="mr10">SKU: {{ item['productExternalSkuCode'] }}</span>
        <Relation
          :orderData="orderData"
          :data="item"
          :allData="data"
          :skuList="skuList"
          :sup_this="sup_this"
          v-p="['product:sku_map:relation_sku']"
          v-if="orderData.orderStatus != 29"
        />
      </div>
      <div class="wrapper" v-else>
        <div class="image">
          <el-popover placement="right" trigger="hover" :visible-arrow="false">
            <div slot="reference">
              <el-image :src="item.productShowCover" :z-index="9999" />
            </div>
            <div
              v-if="item.productCnName"
              style="
                height: 40px;
                padding-left: 20px;
                line-height: 40px;
                background: #fff;
                border: 1px solid #e8e8e8;
              "
            >
              {{ item.productCnName }}
            </div>
            <div
              style="
                height: 40px;
                padding-left: 20px;
                line-height: 40px;
                background: #fff;
                border: 1px solid #e8e8e8;
              "
              v-else
            >
              暂无
            </div>
            <el-image
              class="original-im"
              :src="item.productShowCover"
              style="width: 450px; height: 450px"
              :z-index="9999"
            />
          </el-popover>
        </div>
        <div class="info">
          <div>
            <hoverCopy :value="item.productCustomSkuCode" class="text-primary mr20">
              {{ item.productCustomSkuCode || '暂无' }}
            </hoverCopy>
            x
            <el-button type="info" size="mini" circle>{{ item.productCount }}</el-button>
          </div>
          <div :value="item.productCnName">{{ item.productCnName }}</div>
          <div>
            <span>颜色：{{ item.productStructName }}</span>
            <span>尺码：{{ item.productSizeName }}</span>
          </div>
          <div>单价：{{ item.internalUnitPrice }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Relation from './relation'
import HoverCopy from '@/views/order/module/orderBasePage/module/hoverCopy'
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    sup_this: {},
    skuList: {},
    orderData: {}
  },
  components: {
    Relation,
    HoverCopy
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.order-page-product-info {
  .product-wrapper {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    .wrapper {
      display: flex;
      align-items: center;
      .image {
        flex: none;
        width: 100px;
        height: 100px;
        margin-right: 20px;
      }
    }
    .haveNotProduct {
      display: flex;
      align-items: center;
    }
  }
}
</style>
