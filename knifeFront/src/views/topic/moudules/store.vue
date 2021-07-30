<template>
  <div class="store-warpper">
    <div class="middle-warpper">
      <div class="topic-title">平台产品一键关联，多店铺管理上架无忧</div>
      <div class="topic-description">产品数据轻松同步，热门产品销往全球</div>
      <div class="image-group">
        <div class="image-border">
          <el-image
            fit="contain"
            :src="require('../images/amazon.png')"
          ></el-image>
        </div>
        <div class="image-border">
          <el-image
            fit="contain"
            :src="require('../images/alil.png')"
          ></el-image>
        </div>
        <div class="image-border">
          <el-image
            fit="contain"
            :src="require('../images/api.png')"
          ></el-image>
        </div>
        <div class="image-border">
          <el-image
            fit="contain"
            class="forwarding-icon"
            :src="require('../images/forwarding.svg')"
          ></el-image>
          <span class="forwarding">敬请期待</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.store-warpper {
  min-width: 1200px;
  height: 525px;
  text-align: center;
  background: #fff;
  .middle-warpper {
    width: 1200px;
    margin: 0 auto;
    .topic-description {
      margin-bottom: 79px;
    }
    .image-group {
      display: flex;
      align-items: center;
      justify-content: center;
      .image-border {
        width: 277px;
        height: 150px;
        background: #ffffff;
        box-shadow: 0px 5px 16px 0px rgba(134, 149, 224, 0.2);
        border-radius: 4px;
        margin-right: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
          padding-top: 10px;
          box-shadow: 0px 5px 16px 0px rgba(134, 149, 224, 0.4);
        }
        .forwarding-icon {
          width: 28px;
          height: 28px;
          margin-right: 11px;
        }
        .forwarding {
          font-size: 22px;
          color: #666666;
        }
      }
    }
  }
}
</style>
