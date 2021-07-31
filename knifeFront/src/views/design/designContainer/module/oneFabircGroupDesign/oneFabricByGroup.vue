<template>
  <div class="fabricByGroupComponent">
    <svg
      v-show="showPosLine"
      width="705"
      height="2"
      class="line"
      stroke-width="3"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
    >
      <line x1="2" y1="0" x2="1700" y2="0" stroke-dasharray="20 20" stroke="#3841DB" />
    </svg>

    <svg
      v-show="showPosLine"
      width="705"
      height="2"
      class="line h-line"
      stroke-width="3"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
    >
      <line x1="2" y1="0" x2="1700" y2="0" stroke-dasharray="20 20" stroke="#3841DB" />
    </svg>

    <vue-fabric
      v-loading="fabricLoading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(233, 236, 243, 0.9)"
      :markerWitdth="canvasSize.w"
      :markerHeight="canvasSize.h"
      :ref="id"
      :id="id"
      :width="width"
      :height="height"
      @mouse:up="mouseUp"
      @mouse:down="mouseDown"
      @after:render="afterRender"
      @object:added="objectAddedHandler"
      @object:modified="modifiedHandler"
      @object:rotating="objectRotating"
      @object:moving="objectMoving"
    ></vue-fabric>
  </div>
</template>

<script>
import { fabricInstanceMixin } from '../../mixins'
import { createRandomNum, getALiThumbnail as getImgDom } from '@/utils'
import { mapMutations } from 'vuex'

import {
  SECURITY,
  MAKER,
  DESIGN_SHOW_AREA_W,
  DESIGN_SHOW_AREA_H,
  DESIGN_AREA_W,
  DESIGN_AREA_H,
  COMPRESS_DESIGN_AN_LI_STR
} from '@/utils/constant'

const MIN_ADSORPTION_NUM = 15

export default {
  inject: ['canvasModifiedHandler', 'prodShowSwiperRunCalc'],
  mixins: [fabricInstanceMixin],
  props: {
    info: {
      type: Object,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    groupIndex: {
      type: [Number, String],
      requried: true
    }
  },
  data() {
    return {
      fabricLoading: true,
      width: DESIGN_SHOW_AREA_W,
      height: DESIGN_SHOW_AREA_H,
      showPosLine: false,
      pointer: {
        x: 0,
        y: 0
      }
    }
  },

  mounted() {
    this.initCanvasBgImg()
  },
  computed: {
    data() {
      return this.info.base_kl_groups || []
    },
    //mark图
    chartPath() {
      try {
        const {
          design_pic: [{ chart_path }]
        } = this.info
        return chart_path
      } catch (err) {
        return require('@/assets/images/default.png')
      }
    },

    canvasBgPics() {
      return this.data.map((item) => {
        const tmpArr = []
        const klImages = item.kl_images
        klImages.map((img) => {
          if (SECURITY == img.type) {
            return tmpArr.push(img)
          }
        })
        return tmpArr[0].img_url
          ? `${tmpArr[0].img_url}?rand=${createRandomNum()}`
          : require('@/assets/images/default.png')
      })
    },

    makerPics() {
      return this.data.map((item) => {
        const tmpArr = []
        const klImages = item.kl_images
        klImages.map((img) => {
          if (MAKER == img.type) {
            return tmpArr.push(img)
          }
        })
        return tmpArr[0].img_url || require('@/assets/images/default.png')
      })
    },

    makerWidAndHeis() {
      return this.data.map((item) => {
        let tmpObj = {
          w: 0,
          h: 0
        }
        const klImages = item.kl_images
        klImages.map((img) => {
          if (MAKER == img.type) {
            const { width, height } = img || {}
            tmpObj = {
              w: width,
              h: height
            }
          }
        })
        return tmpObj
      })
    },

    canvas() {
      return this.$refs[this.id] && this.$refs[this.id]
    },

    canvasSize() {
      try {
        const { height: dH, width: dW } = this.info
        return {
          w: dW,
          h: dH
        }
      } catch (err) {
        return {
          w: DESIGN_SHOW_AREA_W,
          h: DESIGN_SHOW_AREA_H
        }
      }
    }
  },
  methods: {
    ...mapMutations(['SET_FABRIC_OBJECTS']),

    getCanvasBgPic() {},

    afterRender(objects) {
      this.SET_FABRIC_OBJECTS({ objects, groupIndex: this.groupIndex })
    },

    modifiedHandler() {
      // this.canvasModifiedHandler();
      console.log('modifiedHandler')
    },
    objectAddedHandler() {
      console.log('objectAddedHandler')
      // this.canvasModifiedHandler();
    },
    mouseDown(e) {
      this.pointer = e.pointer
      this.pointer.existActiveObject = !!this.getActiveObject()
      //点击Group图层自动选中img图层
      this.groupMoveToImgLayer(e)
    },

    //点击Group图层自动选中img图层
    groupMoveToImgLayer(e) {
      const { type, id } = e.target || {}
      if (type === 'group') {
        const c = this.instance.canvas
        const layerId = id.replace('Group', '')
        const willSelectLayer = c.getObjects().find((o) => o.id === layerId)
        willSelectLayer && c.setActiveObject(willSelectLayer)
      }
    },

    needToRender(dP, uP) {
      const { x: dx, y: dy, existActiveObject } = dP
      const { x: ux, y: uy } = uP
      return (dx !== ux || dy !== uy) && existActiveObject
    },

    mouseUp(e) {
      if (!this.needToRender(this.pointer, e.pointer)) {
        return
      }
      this.adsorption()
      this.toggleShowPosLine(false)
      const willMoveObjs = this.canvas
        .getObjects()
        .filter((item) => item.type !== 'i-text' && item.type !== 'image' && item.type !== 'group')
      willMoveObjs.map((o) => {
        this.instance.remove(o)
      })
      this.canvasModifiedHandler()
    },

    adsorption() {
      const { abs } = Math

      if (this.showPosLine) {
        const activeObject = this.getActiveObject()
        const { left: cL, top: cT } = this.instance.canvas.getCenter()
        const { top, right, bottom, left, width: oWidth, height: oHeight } = this.getPos()
        if (abs(left - cL) <= MIN_ADSORPTION_NUM) {
          activeObject.setOptions({
            left: cL + oWidth / 2
          })
        }

        if (abs(right - cL) <= MIN_ADSORPTION_NUM) {
          activeObject.setOptions({
            left: cL - oWidth / 2
          })
        }

        if (abs(top - cT) <= MIN_ADSORPTION_NUM) {
          activeObject.setOptions({
            top: cT + oHeight / 2
          })
        }
        if (abs(bottom - cT) <= MIN_ADSORPTION_NUM) {
          activeObject.setOptions({
            top: cT - oHeight / 2
          })
        }
      }
    },

    getPos() {
      const activeObject = this.getActiveObject()
      const { left, top, width, height } = activeObject.getBoundingRect(true, true)
      return {
        top,
        right: left + width,
        bottom: top + height,
        left,
        width,
        height
      }
    },

    toggleShowPosLine(bool) {
      this.showPosLine = bool
    },
    objectMoving() {
      this.toggleShowPosLine(true)
    },

    objectRotating(option) {
      const {
        target: { angle }
      } = option
      const objects = this.canvas.getObjects()
      const textboxArr = objects.filter(({ type }) => {
        return type === 'textbox'
      })
      textboxArr[0] &&
        textboxArr[0].setOptions({
          text: parseInt(angle) + '°'
        })
    },

    getCalcPic({ w, h, img }) {
      let dirW = 0,
        dirH = 0
      if (img instanceof Image) {
        w = img.width
        h = img.height
      }
      const ratio = Math.min(w, h) / Math.max(w, h)
      const bool = w > h
      if (bool) {
        w = DESIGN_AREA_W
        h = w * ratio
      } else {
        h = DESIGN_AREA_H
        w = h * ratio
      }

      dirW = (DESIGN_SHOW_AREA_W - w) / 2
      dirH = (DESIGN_SHOW_AREA_H - h) / 2
      return { w, h, dirW, dirH }
    },

    async getAllImageDom() {
      let tmpObj = {}
      const bgPArr = this.canvasBgPics.map((src, index) => {
        return getImgDom(src).then((bgImg) => {
          if (!tmpObj.bgImgs) {
            tmpObj.bgImgs = []
          }
          tmpObj.bgImgs[index] = bgImg
          return bgImg
        })
      })

      const mkPArr = this.makerPics.map((src, index) => {
        return getImgDom(src).then((mkImg) => {
          if (!tmpObj.mkImgs) {
            tmpObj.mkImgs = []
          }
          tmpObj.mkImgs[index] = mkImg
          return mkImg
        })
      })

      await Promise.all([...bgPArr, ...mkPArr])
      return tmpObj
    },

    clearMarkerPoint(ctx, imageData, x, y) {
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] == 0) {
          data[i] = 233
          data[i + 1] = 236
          data[i + 2] = 243
          data[i + 3] = 230
        } else {
          data[i] = 0
          data[i + 1] = 0
          data[i + 2] = 0
          data[i + 3] = 0
        }
      }
      ctx.putImageData(imageData, x, y)
    },

    async createDocumentCanvas({ coverDom }) {
      const {
        w,
        h,
        dirW: dDirW,
        dirH: dDirH
      } = this.getCalcPic({
        img: coverDom
      })

      const c = document.createElement('canvas')
      c.id = `fabric_${createRandomNum()}`
      c.width = DESIGN_SHOW_AREA_W
      c.height = DESIGN_SHOW_AREA_H
      const ctx = c.getContext('2d')

      ctx.drawImage(coverDom, dDirW, dDirH, w, h)
      const imgData = ctx.getImageData(dDirW, dDirH, w, h)
      ctx.fillStyle = 'rgba(233, 236, 243, 0.9)'
      ctx.fillRect(0, 0, c.width, c.height)
      ctx.putImageData(imgData, dDirW, dDirH)
      // this.clearMarkerPoint(ctx, coverDom, dDirW, dDirH)
      //   const x = l * scaleX + dDirW
      //   const y = t * scaleY + dDirH

      //  const { l, t } = this.getPosByDocument(coverDom, index)
      //   const drawW = mkImg.width * scaleX
      //   const drawH = mkImg.height * scaleY
      //   const x = l * scaleX + dDirW
      //   const y = t * scaleY + dDirH
      //   ctx.drawImage(mkImg, x, y, drawW, drawH)
      //   const imageData = ctx.getImageData(x, y, drawW, drawH)
      //   markerPoints.push({
      //     imageData,
      //     x,
      //     y
      //   })

      // markerPoints.map(({ imageData, x, y }) => {
      //   this.clearMarkerPoint(ctx, imageData, x, y)
      // })

      // bgImgs.map((bgImg, index) => {
      //   const { l, t } = this.getPosByDocument(SECURITY, index)
      //   const drawW = bgImg.width * scaleX
      //   const drawH = bgImg.height * scaleY
      //   const x = l * scaleX + dDirW
      //   const y = t * scaleY + dDirH
      //   ctx.drawImage(bgImg, x, y, drawW, drawH)
      // })
      return {
        base64: c.toDataURL(),
        w,
        h,
        dDirW,
        dDirH
      }
    },

    getPosByDocument(type, index) {
      const data = this.data.map((item) => {
        let tmpObj = {
          l: 0,
          t: 0
        }
        const klImages = item.kl_images
        klImages.map((img) => {
          if (type == img.type) {
            const { left, top } = img || {}
            tmpObj = {
              l: left,
              t: top
            }
          }
        })
        return tmpObj
      })
      return data[index] || { l: 0, t: 0 }
    },

    async initCanvasBgImg() {
      this.fabricLoading = true
      //获取psd中每个组安全线的img列表和marker的列表
      // const { bgImgs, mkImgs } = await this.getAllImageDom()
      const coverDom = await getImgDom(this.chartPath + COMPRESS_DESIGN_AN_LI_STR)
      console.log('this.info', this.info)
      const { base64, dDirW, dDirH, w, h } = await this.createDocumentCanvas({
        coverDom
      })

        console.log('this.info', this.info)
        if(this.info.width >= this.info.height) {
             this.canvas.realWidth = 450
            this.canvas.realHeight = 450 * this.info.height / this.info.width
          } else {
             this.canvas.realWidth = 450 * this.info.width / this.info.height
              this.canvas.realHeight =450
          }
        console.log(' this.canvas.realWidth',  this.canvas.realWidth)
        console.log(' this.canvas.realHeight',  this.canvas.realHeight)

      //运行一次效果图计算
      // this.prodShowSwiperRunCalc()
      this.$emit('canvasLoadend')

      this.canvas.setOverlayImage(base64, {
        left: 0,
        top: 0
      })

      this.canvas.setBackgroundColor('rgb(255, 255, 255)')
      this.fabricLoading = false
    },

    adaption() {
      const width = this.$refs.fabricWrapper.offsetWidth
      const canvas = this.canvas.canvas
      if (this.isFullSreen) {
        canvas.setZoom(width / this.width)
        canvas.setHeight(canvas.getHeight() * (width / this.width))
        canvas.setWidth(canvas.getWidth() * (width / this.width))
      } else {
        canvas.setHeight(this.originHeight)
        canvas.setWidth(this.originWidth)
        canvas.setZoom(1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fabricByGroupComponent {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  ::v-deep {
    .el-icon-loading {
      font-size: 35px;
    }
  }
  .line {
    position: absolute;
    z-index: 1000;
    display: inline-block;
    // height: 0;
    // height: 100%;
    // background: $color-primary;
    // border-left: 2px dashed $color-primary;
    opacity: 0.7;
  }
  .h-line {
    transform: rotate(90deg);
  }
}
</style>
