<template>
  <div class="banner-warpper">
    <div class="middle-warpper">
      <div class="font-warpper">
        <div class="on-demand">按需打印 智能分销平台</div>
        <div class="description">
          基于多年传统跨境电商经验，更专业、更适合个性定制的亚马逊、速卖通行业解决方案
        </div>
        <div class="information">
          0库存 . 0启动资金 . 免费设计一键生成 . 无限sku关联上架 .
          1件订单代工代发
        </div>
        <el-button type="primary" @click="$router.push('/login')"
          >开始销售</el-button
        >
        <el-button @click="$router.push('/design/index')">一键设计</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.banner-warpper {
  height: 560px;
  width: 100%;
  min-width: 1200px;
  background-image: url('../images/banner-2560.jpg');
  // background-size: 100%;
  // background-repeat: repeat-x;
  // background-size: contain;

  background-position: center center;
  .middle-warpper {
    .banner {
      height: 100%;
      width: 100%;
    }
    .font-warpper {
      margin-left: 20px;
      padding-top: 128px;
      .el-button--primary:hover {
        background: #3841db;
        opacity: 0.8;
      }
      .on-demand {
        font-size: 36px;
        font-weight: bold;
        color: #ffffff;
        margin-bottom: 41px;
      }
      .description {
        width: 640px;
        height: 50px;
        line-height: 27px;
        letter-spacing: 1.6px;
        font-size: 20px;
        color: #ffffff;
        margin-bottom: 43px;
      }
      .information {
        font-size: 16px;
        font-weight: bold;
        color: #ffffff;
        margin-bottom: 58px;
        letter-spacing: 1.6px;
        .el-button {
          width: 140px;
          height: 46px;
        }
      }
    }
  }
}
</style>
