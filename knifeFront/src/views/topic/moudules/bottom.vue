<template>
  <div class="bottom-warpper">
    <div class="middle-warpper">
      <el-image fit="contain" class="logo" :src="require('../images/logo.svg')"></el-image>
      <div class="copyright">Copyright @正丁云商平台 All Rights Reserved. 福建正丁网络科技有限公司版权所有</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  components: {}
}
</script>

<style lang="scss" scoped>
.bottom-warpper {
  height: 84px;
  background: #333333;
  .middle-warpper {
    line-height: 84px;
    display: flex;
    align-items: center;
    justify-content: center;
    .copyright {
      font-size: 14px;
      color: #ffffff;
      margin-left: 60px;
    }
    .logo {
      width: 100px;
      height: 25px;
      .image {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
