<template>
  <div class="tab-warpper">
    <div class="middle-warpper">
      <div class="topic-title">行业解决方案 - 针对定制跨境电商的困境</div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="选品难" name="first"> </el-tab-pane>
        <el-tab-pane label="设计难" name="second"> </el-tab-pane>
        <el-tab-pane label="利润低" name="third"> </el-tab-pane>
        <el-tab-pane label="发货难" name="fourth"> </el-tab-pane>
      </el-tabs>
      <swiper
        :slides-per-view="3"
        :space-between="50"
        :options="swiperOptions"
        ref="mySwiper"
        navigation
        :pagination="{ clickable: true }"
        :scrollbar="{ draggable: true }"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
      >
        <swiper-slide v-for="(item, index) in list" :key="index">
          <div class="whole-warpper">
            <div class="first-warpper">
              <el-image class="first-margin" :src="firstImage"></el-image>
              <div class="title">{{ firstTitle }}</div>
              <div class="information">
                {{ firstInformation }}
              </div>
            </div>
            <div class="second-warpper">
              <el-image :src="secondImage"></el-image>
              <div class="title">{{ secondTitle }}</div>
              <div class="information">
                {{ secondInformation }}
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      swiperOptions: {
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        }
      },
      activeName: 'first',
      firstImage: require('../images/1_1.png'),
      firstTitle: '传统电商',
      firstInformation: '先采购后销售，市场产品繁杂，选品备货周期长',
      secondImage: require('../images/1_2.png'),
      secondTitle: '正丁云商',
      secondInformation: '定制品类齐全，热门产品实时更新，先销售后生产，一件代发',
      list: [
        {
          name: 'first',
          firstImage: require('../images/1_1.png'),
          firstTitle: '传统电商',
          firstInformation: '先采购后销售，市场产品繁杂，选品备货周期长',
          secondImage: require('../images/1_2.png'),
          secondTitle: '正丁云商',
          secondInformation: '定制品类齐全，热门产品实时更新，先销售后生产，一件代发'
        },
        {
          name: 'second',
          firstImage: require('../images/1_3.png'),
          firstTitle: '传统电商',
          firstInformation: '定制设计难，专业专制贵',
          secondImage: require('../images/1_4.png'),
          secondTitle: '正丁云商',
          secondInformation: '容易操作的定制器，将您的设计添加到产品，精确设计一键生成'
        },
        {
          name: 'third',
          firstImage: require('../images/1_5.png'),
          firstTitle: '传统电商',
          firstInformation: '亚马逊、速卖通的产品同质化高，短期收益低，试错投入成本大',
          secondImage: require('../images/1_6.png'),
          secondTitle: '正丁云商',
          secondInformation: '个性产品关联上架，销售一件也是批发价，无需备货成本'
        },
        {
          name: 'fourth',
          firstImage: require('../images/1_7.png'),
          firstTitle: '传统电商',
          firstInformation: '工厂不接受小批量订单，质量不稳定，物流运算繁琐',
          secondImage: require('../images/1_8.png'),
          secondTitle: '正丁云商',
          secondInformation: '订单数据直接关联平台工厂，物流渠道运费比对，生产发货一目了然'
        }
      ]
    }
  },
  methods: {
    onSwiper(swiper) {},
    onSlideChange() {
      const currentItem = this.list[this.$refs.mySwiper.$swiper.activeIndex]
      const { firstImage, firstTitle, firstInformation, secondImage, secondTitle, secondInformation } = currentItem
      this.firstImage = firstImage
      this.firstTitle = firstTitle
      this.firstInformation = firstInformation
      this.secondImage = secondImage
      this.secondTitle = secondTitle
      this.secondInformation = secondInformation
      this.activeName = currentItem.name
    },
    handleClick(tab) {
      if (tab.name === 'first') {
        this.$refs.mySwiper.$swiper.activeIndex = 0
      } else if (tab.name === 'second') {
        this.$refs.mySwiper.$swiper.activeIndex = 1
      } else if (tab.name === 'third') {
        this.$refs.mySwiper.$swiper.activeIndex = 2
      } else {
        this.$refs.mySwiper.$swiper.activeIndex = 3
      }
      let dataList = this.list.find((item) => item.name === tab.name)
      const { firstImage, firstTitle, firstInformation, secondImage, secondTitle, secondInformation } = dataList
      this.firstImage = firstImage
      this.firstTitle = firstTitle
      this.firstInformation = firstInformation
      this.secondImage = secondImage
      this.secondTitle = secondTitle
      this.secondInformation = secondInformation
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-tabs__item {
    padding: 0 127px;
    font-size: 20px;
  }
  .el-tabs__nav {
    padding-left: 100px;
  }
  .el-tabs__active-bar {
    left: 100px;
  }
}
.first-warpper,
.second-warpper {
  width: 512px;
  height: 374px;
  box-shadow: 0px 5px 16px 0px rgba(134, 149, 224, 0.2);
  border-radius: 4px;
  .el-image {
    margin-top: 44px;
    margin-left: 113px;
  }
}
.first-warpper {
  margin-right: 47px;
}
.whole-warpper {
  display: flex;
  justify-content: center;
  margin-top: 46px;
  padding-bottom: 40px;
}
.title {
  margin: 42px 0 15px 129px;
  font-size: 22px;
  font-weight: bold;
  color: #333333;
}
.information {
  margin-left: 129px;
  width: 281px;
  font-size: 18px;
  color: #666666;
  line-height: 30px;
}
.tab-warpper {
  height: 706px;
  width: 100%;
  background-image: url('../images/solution-bg.png');
  background-position: center center;
  background-color: #fff;
  .middle-warpper {
    .topic-title {
      padding-bottom: 50px;
      text-align: center;
    }
  }
}
</style>
