<template>
  <div class="proCardComponent">
    <el-image
      style="width: 60px; height: 60px"
      fit="contain"
      :src="data.productShowCover"
    ></el-image>
    <div class="info">
      <div class="title">
        <span>产品名称：</span>
        <span>{{ data.productCnName || '暂无' }}</span>
      </div>
      <div class="i-item">
        <div class="flex">
          <div class="label">SKU：</div>
          <div class="name">{{ data.productCustomSkuCode }}</div>
        </div>
        <div class="flex">
          <div class="label">款式：</div>
          <div class="name">{{ data.productStructName }}</div>
        </div>
        <div class="flex">
          <div class="label">尺码：</div>
          <div class="name">{{ data.productSizeName }}</div>
        </div>
        <div class="flex">
          <div class="label">数量：</div>
          <div class="name">{{ data.productCount }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: []
    },
    productData: {
      type: Object,
      default: {}
    }
  }
}
</script>
<style lang="scss" scoped>
.proCardComponent {
  margin-top: 15px;
  margin-left: 15px;
  display: flex;
  justify-content: flex-start;
  .el-image {
    flex: 0 0 60px;
    margin-right: 15px;
    background-color: $bg-color;
  }
  .info {
    flex: 1;
    .title {
      font-size: #000;
      font-weight: 600;
    }
    .i-item {
      margin-top: 15px;
      display: flex;
      flex-wrap: wrap;
      .label {
        font-weight: 600;
        white-space: nowrap;
      }
      .name {
        font-size: $color-gray;
        margin-right: 15px;
      }
    }
    
  }
}
</style>
