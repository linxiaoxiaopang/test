<template>
  <div class="background">
    <div class="middle-warpper">
      <div class="title">
        <h2 class="topic-title">智能柔性供应链，订单同步工厂直接生产</h2>
        <p>多年深入跨境制造经验，超100000＋订单好评质量看得见</p>
      </div>
      <div class="main-warpper">
        <div class="img-waper first">
          <img src="../images/support-first.jpg" alt="" />
          <p>超14000平米制造工厂，轻松应对高峰期</p>
        </div>
        <div class="img-waper">
          <img src="../images/support-second.jpg" alt="" />
          <p>柔性生产，极速响应，订单状态一目了然</p>
        </div>
      </div>
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
.background {
  height: 718px;
  width: 100%;
  background-color: #f5f9fe;
  background-image: url('../images/support-bg.png');
  background-position: center center;
  .middle-warpper {
    height: 718px;
    overflow: hidden;
    .title {
      width: 100%;
      .topic-title {
        text-align: center;
      }
      p {
        color: #666666;
        font-size: 20px;
        text-align: center;
      }
    }
    .main-warpper {
      width: 100%;
      margin-top: 80px;
      display: flex;
      justify-content: center;
      .first {
        margin-right: 60px;
      }
      .img-waper {
        width: 429px;
        img {
          width: 100%;
          height: 312px;
        }
        p {
          width: 100%;
          margin-top: 20px;
          color: #333;
          font-size: 18px;
          text-align: center;
        }
      }
    }
  }
}
</style>
