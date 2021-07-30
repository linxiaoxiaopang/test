<template>
  <div class="checkProShowCanvas">
    <div :class="[curIndex == -1 && 'active']" class="preview-wrapper" @click="documentClick">
      <div ref="preview" :class="['preview', autoPreview && 'auto-preview']">
        <el-image :src="docSrc || ''" @load="load" />
        <div
          @click.stop="groupClick(groupInfo, index)"
          :key="index"
          :class="['group', index == curIndex && 'active']"
          :style="coodStyle"
          v-for="({ groupInfo, ...coodStyle }, index) in coods"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { conversionCoord } from '@/utils'
import { getKnifeReference, baseSizeInfo } from '@/api/product/checkProdApi'
import { MAKER } from '@/utils/constant'
const BOXHEIGHT = 400
export default {
  props: {
    sup_this: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      fLoading: false, //父亲组件数据是否渲染完成
      docSrc: '',
      psdInfo: {},
      coods: [],
      info: {},
      curGroupLayer: {},
      curIndex: -2,
      groupNodes: [],
      boxOption: {}
    }
  },

  mounted() {
    this.initData()
  },

  computed: {
    autoPreview() {
      return !!this.boxOption.height
    }
  },
  methods: {
    load() {
      const { doc, group } = this.psdInfo
      const coods = this.getCoodsToCreateDom(doc, group)
      this.coods = this.setZIndex(coods)
      this.documentClick()
    },

    initDocSrc() {
      this.fLoading = true
      if (this.info) {
        this.docSrc = this.info.check_kl_img
      }
    },

    groupClick(groupInfo, index) {
      if (this.curIndex == index) return
      this.curIndex = index
      try {
        const groups = this.info.groups
        if (!groups.length) return
        const { order: gOrder } = groupInfo
        const info = groups.find(({ order }) => order === gOrder)
        this.$emit('changePartProShowPic', { info, count: groups.length })
      } catch (err) {
        console.log(err)
      }
    },

    documentClick() {
      if (this.curIndex == -1) return
      this.curIndex = -1
      try {
        const groups = this.info.groups
        if (!groups.length) return
        this.$emit('changePartProShowPic', { info: groups, count: groups.length })
      } catch (err) {
        console.log(err)
      }
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

    async baseSizeInfo() {
      const { code, detail } = await baseSizeInfo(this.$route.query.id)
      if ($SUC({ code })) {
        detail.doc = { ...detail.doc, width: detail.doc.kl_image_width, height: detail.doc.kl_image_height }
        detail.group.map((g) => {
          const { base_kl_images } = g
          base_kl_images.some((item) => {
            if (item.type === MAKER) {
              g.width = item.width
              g.height = item.height
              g.left = item.left
              g.top = item.top
              return true
            }
          })
        })
        this.psdInfo = detail
      }
    },

    async getPsdInfo() {
      try {
        const { code, detail } = await getKnifeReference({ protoId: this.$route.query.protoId })
        if ($SUC({ code })) {
          if (detail.length === 0) {
            this.docSrc = require('@/assets/images/default.png')
            this.$emit('updateTipMsg', '请先创建参考图，再进行校验操作！')
          }
          this.info = detail[0]
          if (this.fLoading && !this.docSrc) {
            this.docSrc = this.info && this.info.check_kl_img
          }
        }
      } catch (err) {
        console.log(err)
      }
    },

    getCoodsToCreateDom(document, data) {
      const { height, width } = document
      const boxWidth = width >= height ? this.$refs.preview.offsetWidth : Math.min(BOXHEIGHT, height) * (width / height)

      const tmpArr = data.map((item) => {
        this.boxOption = {}
        const boxOption = this.boxOption
        if (width >= height) {
          boxOption.width = boxWidth
        }
        if (width < height) {
          boxOption.width = boxWidth
          boxOption.height = BOXHEIGHT
        }
        const coord = conversionCoord(item, document, boxOption)
        coord.groupInfo = item
        return coord
      })
      return tmpArr
    },

    async initData() {
      try {
        await this.baseSizeInfo()
        await this.getPsdInfo()
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.checkProShowCanvas {
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
  .preview-wrapper.active {
    outline: 1px solid $color-danger;
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
      max-height: 400px;
      border: 1px solid $border-color;
      cursor: pointer;
      ::v-deep {
        .el-image__inner {
          width: auto;
          height: auto;
          max-width: 100%;
          max-height: 400px;
        }
      }
    }
    .group {
      position: absolute;
      cursor: pointer;
    }
  }
}
</style>
