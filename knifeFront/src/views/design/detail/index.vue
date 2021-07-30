<template>
  <section class="app-container designDetail">
    <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{path: '/design/index'}">
     <i class="el-icon-d-arrow-left"></i> 返回
    </el-breadcrumb-item>
      <el-breadcrumb-item :key="index" v-for="(name, index) in breadcrumb">
        {{ name }}</el-breadcrumb-item
      >
    </el-breadcrumb>
    <div class="info-wrapper">
      <Exhibition class="exhibition" :data="figures" />
      <PrototypeInfo
        class="prototype-info"
        :data="protoObj"
        :sup_this="sup_this"
        @updateCurPrimStruct="updateCurPrimStruct"
        @getOpenFontData="getOpenFontData"
      />
    </div>
    <ProtoInfoOfRichtextComponent :htmlStr="protoObj.detail" :openData="openData" :data="protoObj"/>
  </section>
</template>

<script>
import Exhibition from "./module/exhibition";
import PrototypeInfo from "./module/prototypeInfo";
import ProtoInfoOfRichtextComponent from "./module/protoInfoOfRichtextComponent";
import MultipleViewSwiper from "@/components/multipleViewSwiper";

import { list } from "@/api/product/protoApi";

export default {
  components: {
    Exhibition,
    PrototypeInfo,
    ProtoInfoOfRichtextComponent,
    MultipleViewSwiper,
  },
  data() {
    return {
      sup_this: this,
      protoObj: {},
      figures: [],
      curPrimStruct: {},
      openData: false
    };
  },
  created() {
    this.init();
  },
  computed: {
    breadcrumb() {
      const { name } = this.protoObj || {};
      if (Object.keys(this.curPrimStruct).length) {
        const { structure = "" } = this.curPrimStruct || {};
        return [name] //[name, structure];
      }
      return [name];
    },
  },
  methods: {
    updateCurPrimStruct(curPrimStruct) {
      const { figures = [] } = curPrimStruct || {};
      this.curPrimStruct = curPrimStruct;
      this.figures = Array.isArray(figures)
        ? figures.map(({ path }) => ({ small: path, mid: path }))
        : [];
    },
    getOpenFontData(data) {
      this.openData = data
    },
    async init() {
      const id = this.$route.query.id;
      if (!id) return this.$router.back();
      const { code, detail } = await list(id);
      if ($SUC({ code })) {
        this.protoObj = detail
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.designDetail {
  margin: 0;
  padding: 30px 200px;
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
      flex: 0 0 550px;
      height: 430px;
    }
    .prototype-info {
      flex: 1;
      margin-left: 80px;
    }
  }
}
</style>
