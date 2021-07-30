<template>
  <div class="kenifeLayer">
    <div class="kenife-layer-content">
      <div class="preview">
        <el-image fit="contain" :src="info.thumbnail || ''" />
        <div
          @click="groupClick(index)"
          :key="index"
          :class="['group', index == curIndex && 'active']"
          :style="coodStyle"
          v-for="(coodStyle, index) in coods"
        ></div>
      </div>
      <div class="layer-list">
        <div class="title">全局信息说明</div>
        <div class="info-wrapper">
          <LayerIntro :data="info.document || {}" />
        </div>
        <div class="title">组信息说明</div>

        <div class="info-wrapper">
          <LayerIntro :data="shakingChild" />
        </div>

        <div class="title">子项信息说明</div>
        <div class="info-wrapper">
          <LayerIntro
            :data="info"
            :key="index"
            v-for="(info, index) in curGroupLayer.children || []"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LayerIntro from "./layerIntro";
import { conversionCoord } from "@/utils";
import cloneDeep from "lodash/cloneDeep";
const BOXWIDTH = 340;
const BOXHEIGHT = 600;
export default {
  components: {
    LayerIntro,
  },
  props: {
    info: {
      required: true,
    },
    sup_this: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      coods: [],
      curGroupLayer: {},
      curIndex: 0,
      groupNodes: [],
    };
  },
  watch: {
    info() {
      this.getPsdInfo();
    },
  },
  mounted() {
    this.getPsdInfo();
  },
  computed: {
    shakingChild() {
      const cloneLayer = cloneDeep(this.curGroupLayer);
      delete cloneLayer.children;
      return cloneLayer;
    },
  },
  methods: {
    groupClick(index) {
      const children = this.info.children || [];
      this.curGroupLayer = children[index];
      this.curIndex = index;
      this.$emit("toggleCurGroupLayer", this.groupNodes[index] || {});
    },
    getPsdInfo() {
      try {
        const { nodes, children = [], document = {} } = this.info || {};
        this.groupNodes = nodes.filter((node) => node.type === "group");
        this.coods = this.getCoodsToCreateDom(
          document,
          children.filter(({ type }) => type === "group")
        );
        this.groupClick(0);
      } catch (err) {
        console.log(err);
      }
    },

    getCoodsToCreateDom(document, data) {
      const tmpArr = data.map((item) => {
        console.log("document", document);
        const { height, width } = document;
        const boxOption = {};
        if (width >= height) {
          boxOption.width = BOXWIDTH;
        }
        if (width < height) {
          boxOption.height = BOXHEIGHT;
        }
        return conversionCoord(item, document, boxOption);
      });
      return tmpArr;
    },
  },
};
</script>

<style lang="scss" scoped>
.kenifeLayer {
  position: relative;

  overflow: auto;
  .kenife-layer-content {
    // display: flex;
    // flex-direction: column;
    box-shadow: 0 0 10px 1px #999;
    padding: 0 10px;

    padding: 5px;
  }
  .preview {
    overflow: hidden;
    .el-image {
      width: 100%;
      border: 1px solid $border-color;
      cursor: pointer;
    }
    .group {
      position: absolute;
      cursor: pointer;
    }
    .group.active {
      outline: 1px solid $color-danger;
    }
  }
  .layer-list {
    border: 1px solid $border-color;

    padding: 0 5px;

    .title {
      line-height: 2rem;
      color: $color-gray;
    }
    .info-wrapper {
      padding: 5px 0;
      background: rgba(18, 19, 36, 0.07);
    }
  }
}
</style>