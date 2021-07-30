<template>
  <div class="app-container recommend">
    <div class="banner">
      <p>banner</p>
    </div>
    <div class="recommend-topic">
      <h3>推荐专题</h3>
      <MultipleViewSwiper :data="topicData" :isActive="true" v-slot="{ scoped: { topic } }">
        <div class="card">
          {{ topic }}
        </div>
      </MultipleViewSwiper>
    </div>
    <div class="my-collect">
      <h3>我的收藏</h3>
      <el-row :gutter="20">
        <el-col :span="3" v-for="(item, index) in collectData" :key="index">
          <el-image :src="item.url" fit="fit"></el-image>
          <p class="class-name">设计名称，限定字段，多余用省略号</p>
          <p class="show-button"><i class="el-icon-edit"></i>点击开始定制</p>
        </el-col>
      </el-row>
    </div>
    <div class="hot-sale">
      <div class="hot-title">
        <h3>热卖新品</h3>
        <p>查看更多</p>
      </div>
      <!-- 热卖图片 -->
      <el-row :gutter="20">
        <el-col :span="4" v-for="(item, index) in hotData" :key="index">
          <el-image :src="item.url" fit="fit"></el-image>
          <p>设计名称，限定字段，多余用省略号1231231231</p>
          <p>
            批发: <span>${{ item.price }}</span> 起
          </p>
          <div class="heibai">
            <div class="hei" :class="{ show: !item.b }"></div>
            <div class="bai" :class="{ show: !item.w }"></div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import MultipleViewSwiper from "@/components/multipleViewSwiper";

export default {
  components: {
    MultipleViewSwiper,
  },
  data() {
    return {
      topicData: [
        { topic: "元旦" },
        { topic: "圣诞节" },
        { topic: "推荐专题名称" },
        { topic: "中秋节" },
        { topic: "春节" },
        { topic: "专题名称" },
        { topic: "小寒" },
        { topic: "七夕节" },
      ],
      collectData: [
        { url: "/img/2.jpg" },
        { url: "/img/2.jpg" },
        { url: "/img/2.jpg" },
      ],
      hotData: [
        { url: "/img/2.jpg", price: 26, w: true, b: true },
        { url: "/img/2.jpg", price: 26, w: true, b: true },
        { url: "/img/2.jpg", price: 26, w: true, b: true },
        { url: "/img/2.jpg", price: 12, w: false, b: true },
        { url: "/img/2.jpg", price: 18, w: false, b: true },
        { url: "/img/2.jpg", price: 26, w: true, b: false },
        { url: "/img/2.jpg", price: 26, w: false, b: true },
        { url: "/img/2.jpg", price: 26, w: true, b: false },
        { url: "/img/2.jpg", price: 26, w: true, b: true },
        { url: "/img/2.jpg", price: 26, w: true, b: true },
        { url: "/img/2.jpg", price: 26, w: true, b: true },
        { url: "/img/2.jpg", price: 26, w: true, b: true },
      ],
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.recommend {
  h3 {
    margin-bottom: 30px;
  }
  .banner {
    background-color: rgba($color-primary, $alpha: 0.6);
    height: 200px;
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    margin-top: 30px;
    p {
      color: white;
      font-size: 24px;
    }
  }
  .recommend-topic {
    margin: 30px 0;
    .card {
      box-sizing: border-box;
      width: 100%;
      border: 1px solid rgba($color: #000000, $alpha: 0.3);
      height: 100px;
      border-radius: 4px;
      text-align: center;
      line-height: 100px;
      display: inline-block;
    }
  }
  .my-collect {
    margin-bottom: 30px;
    .el-row {
      .el-col {
        cursor: pointer;
        position: relative;
        .class-name {
          margin-top: 10px;
          overflow: hidden;
          white-space: nowrap;
          font-size: 12px;
          text-overflow: ellipsis;
        }
        .show-button {
          width: 80%;
          bottom: 30%;
          left: 10%;
          position: absolute;
          height: 2em;
          line-height: 2em;
          text-align: center;
          color: white;
          background-color: rgba(0, 0, 0, 0.3);
          font-size: 12px;
          border-radius: 1em;
          display: none;
        }
      }
      .el-col:hover .show-button {
        display: block;
      }
    }
  }
  .hot-sale {
    .hot-title {
      display: flex;
      justify-content: space-between;
      p {
        font-size: 12px;
        line-height: 21px;
        height: 21px;
        cursor: pointer;
      }
    }
    .el-row {
      .el-col {
        margin-bottom: 20px;
        p {
          font-size: 12px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-top: 10px;
          span {
            // font-weight: 400;
            font-size: 16px;
            list-style: none;
          }
        }
        .heibai {
          .hei,
          .bai {
            display: inline-block;
            width: 25px;
            height: 25px;
            border: 1px solid rgba($color: #000000, $alpha: 0.3);
            margin: 10px 10px 0 0;
            cursor: pointer;
          }
          .hei {
            background-color: black;
          }
          .bai {
            background-color: #fff;
          }
          .show {
            display: none;
          }
        }
      }
    }
  }
}
</style>
