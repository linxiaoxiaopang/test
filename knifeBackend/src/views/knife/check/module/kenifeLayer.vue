<template>
  <div class="kenifeLayer">
    <div class="preview-wrapper">
      <div :class="['preview', autoPreview && 'auto-preview']">
        <el-image :src="info.thumbnail || ''" />
        <div
          @click="groupClick(index)"
          :key="index"
          :class="['group', index == curIndex && 'active']"
          :style="coodStyle"
          v-for="(coodStyle, index) in coods"
        ></div>
      </div>
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
        <LayerIntro :data="info" :key="index" v-for="(info, index) in curGroupLayer.children || []" />
      </div>
    </div>
  </div>
</template>

<script>
import LayerIntro from './layerIntro'
import { conversionCoord } from '@/utils'
import cloneDeep from 'lodash/cloneDeep'
const BOXWIDTH = 340
const BOXHEIGHT = 600
export default {
  components: {
    LayerIntro
  },
  props: {
    info: {
      required: true
    },
    sup_this: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      coods: [],
      curGroupLayer: {},
      curIndex: 0,
      groupNodes: [],
      boxOption: {}
    }
  },
  watch: {
    info() {
      this.getPsdInfo()
    }
  },
  mounted() {
    this.getPsdInfo()
  },
  computed: {
    shakingChild() {
      const cloneLayer = cloneDeep(this.curGroupLayer)
      delete cloneLayer.children
      return cloneLayer
    },
    autoPreview() {
      return !!this.boxOption.height
    }
  },
  methods: {
    groupClick(index) {
      const children = this.info.children || []
      this.curGroupLayer = children[index]
      this.curIndex = index
      this.$emit('toggleCurGroupLayer', this.groupNodes[index] || {})
    },
    setZIndex(coods = []) {
      for (let i = 0; i < coods.length; i++) {
        let zIndex = 0
        const { height, width } = coods[i]
        for (let j = 0; j < coods.length; j++) {
          const { height: h, width: w } = coods[j]
          if (parseFloat(height) * parseFloat(width) <= parseFloat(h) * parseFloat(w)) {
            zIndex++
          }
        }
        coods[i].zIndex = zIndex
      }
      return coods
    },

    getPsdInfo() {
      try {
        const { nodes, children = [], document = {} } = this.info || {}
        this.groupNodes = nodes.filter((node) => node.type === 'group')
        const coods = this.getCoodsToCreateDom(
          document,
          children.filter(({ type }) => type === 'group')
        )
        console.log('coods', coods)
        this.coods = this.setZIndex(coods)
        this.groupClick(0)
      } catch (err) {
        console.log(err)
      }
    },

    // getCoodsToCreateDom(document, data) {
    //   const tmpArr = data.map((item) => {
    //     return conversionCoord(item, document, {
    //       width: BOXWIDTH,
    //     });
    //   });
    //   return tmpArr;
    // },
    getCoodsToCreateDom(document, data) {
      const tmpArr = data.map((item) => {
        const { height, width } = document
        this.boxOption = {}
        const boxOption = this.boxOption
        if (width >= height) {
          boxOption.width = BOXWIDTH
        }
        if (width < height) {
          boxOption.width = BOXWIDTH
          boxOption.height = BOXHEIGHT
        }
        return conversionCoord(item, document, boxOption)
      })
      console.log('tmpArr', tmpArr)
      return tmpArr
    }
  }
}
</script>

<style lang="scss" scoped>
.kenifeLayer {
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 10px 1px #999;
  padding: 0 10px;
  height: 100%;
  padding: 5px;
  .preview-wrapper {
    padding: 5px 0;
    font-size: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .preview {
    position: relative;
    display: inline-block;
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
  .auto-preview {
    width: auto;
    .el-image {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 600px;
      border: 1px solid $border-color;
      cursor: pointer;
      ::v-deep {
        .el-image__inner {
          width: auto;
          height: auto;
          max-width: 100%;
          max-height: 600px;
        }
      }
    }
    .group {
      position: absolute;
      cursor: pointer;
    }
  }
  .layer-list {
    flex: 1;
    border: 1px solid $border-color;
    overflow-y: auto;
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
