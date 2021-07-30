<template>
  <section class="app-container productDesignDetail">
    <div class="info-wrapper">
      <Exhibition class="exhibition" :data="data" />
      <PrototypeInfo
        class="prototype-info"
        :data="data"
        @updateCurPrimStruct="updateCurPrimStruct"
      />
    </div>
    <ProtoInfoOfRichtextComponent label="产品详情" :htmlStr="data.detail" />
    <ProtoInfoOfRichtextComponent label="产品尺码" />
    <ProtoInfoOfRichtextComponent label="产品规格" />
    <div class="recommend">
      <div class="recommend-title">看看这款原型的定制</div>
      <MultipleViewSwiper :data="urls" v-slot="{ scoped: { url } }">
        <el-image class="card" fit="contain" :src="url"></el-image>
      </MultipleViewSwiper>
    </div>
  </section>
</template>

<script>
import Exhibition from "./module/exhibition";
import PrototypeInfo from "./module/prototypeInfo";
import ProtoInfoOfRichtextComponent from "./module/protoInfoOfRichtextComponent";
import MultipleViewSwiper from "@/components/multipleViewSwiper";
import { read } from "@/api/product/publicProApi";

const urls = [
  {
    url: require("@/assets/images/logo.png"),
  },
  {
    url: require("@/assets/images/logo.png"),
  },
  {
    url: require("@/assets/images/logo.png"),
  },
  {
    url: require("@/assets/images/logo.png"),
  },
  {
    url: require("@/assets/images/logo.png"),
  },
  {
    url: require("@/assets/images/logo.png"),
  },
  {
    url: require("@/assets/images/logo.png"),
  },
  {
    url: require("@/assets/images/logo.png"),
  }
];

export default {
  components: {
    Exhibition,
    PrototypeInfo,
    ProtoInfoOfRichtextComponent,
    MultipleViewSwiper,
  },
  data() {
    return {
      urls,
      data: {},
      figures: [],
      curPrimStruct: {},
    };
  },
  created() {
    this.init();
  },
  methods: {
    updateCurPrimStruct(curPrimStruct) {
      const { figures = [] } = curPrimStruct || {};
      this.curPrimStruct = curPrimStruct;
      this.figures = Array.isArray(figures)
        ? figures.map(({ path }) => ({ small: path, mid: path }))
        : [];
    },
    async init() {
      const {code, detail} = await read(this.$route.query.id);
      if($SUC({code})) {
        this.data = detail
        console.log(' this.data',  this.data)
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.productDesignDetail {
  padding: 30px 80px;
  padding-right: 40px;
  .el-breadcrumb {
    font-size: 18px;
    ::v-deep {
      .el-breadcrumb__separator {
        margin: 0 3px;
      }
      .el-breadcrumb__item:last-child {
        .el-breadcrumb__inner {
          color: $color-primary !important;
        }
      }
    }
  }

  .card {
    box-sizing: border-box;
    width: 100%;
    height: 290px;
    border-radius: 4px;
    text-align: center;
    border: 1px solid $border-color;
  }

  .info-wrapper {
    padding-left: 20px;
    margin-top: 20px;
    width: 100%;
    display: flex;
    .exhibition {
      flex: 0 0 650px;
      height: 540px;
    }
    .prototype-info {
      flex: 1;
      margin-left: 80px;
    }
  }
  .recommend {
    margin-top: 30px;
    padding: 0 20px;
    .recommend-title {
      margin-left: -20px;
      margin-bottom: 20px;
    }
  }
}
</style>