<template>
  <div class="step-warpper">
    <div class="middle-warpper">
      <div class="topic-title">四步轻松开启您的跨境电商业务</div>
      <div class="topic-description">只需4步，简单操作，轻松创业</div>
      <div class="svg-warpper">
        <div class="svg-item" v-for="(item, index) in svgList" :key="index">
          <div class="line-warpper">
            <div class="svg-circle-wrapper">
              <div class="svg-circle">
                <el-image class="svg-icon" :src="item.svg"></el-image>
              </div>
            </div>

            <div class="line"></div>
          </div>
          <!-- <div class="line"></div> -->
          <div class="svg-title">{{ item.title }}</div>
          <div class="svg-information">{{ item.information }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      svgList: [
        {
          svg: require('../images/1.svg'),
          title: '个性定制',
          information: '在定制器中以您的设计定制产品'
        },
        {
          svg: require('../images/2.svg'),
          title: '平台同步',
          information: '店铺授权，产品一键关联'
        },
        {
          svg: require('../images/3.svg'),
          title: '订单同步',
          information: '平台订单支付后订单直接同步工厂'
        },
        {
          svg: require('../images/4.svg'),
          title: '生产发货',
          information: '工厂快速响应，货物销往全球'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.step-warpper {
  height: 551px;
  background: #f5f9fe;
  text-align: center;
  .middle-warpper {
    .topic-description {
      font-size: 20px;
      color: #666666;
      margin-bottom: 72px;
    }
    .svg-warpper {
      display: flex;
      justify-content: space-between;
      .svg-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        .line-warpper {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          width: 100%;
          .svg-circle-wrapper {
            padding: 0 20px;
            z-index: 9;
            background: rgb(245, 249, 254);
          }
          .svg-circle {
            width: 74px;
            height: 74px;
            background: #e2e4fc;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            &:hover {
              padding-top: 5px;
              box-shadow: 0px 5px 16px 0px rgba(134, 149, 224, 0.4);
            }
            .svg-icon {
              width: 34px;
              color: #ff414ae4;
            }
          }
          .line {
            position: absolute;
            left: 50%;
            top: 50%;
            // transform: translate(50%, 50%);
            width: 100%;
            height: 1px;
            background: #3e47de;
            opacity: 0.1;
          }
        }
        .svg-title {
          margin: 30px 0 20px 0;
          font-size: 20px;
          font-weight: bold;
          color: #333333;
          display: flex;
        }
        .svg-information {
          color: #333333;
          display: flex;
        }
        &:last-child {
          .line {
            display: none;
          }
        }
      }
    }
  }
}
</style>
