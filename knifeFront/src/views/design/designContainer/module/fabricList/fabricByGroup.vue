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
      :markerWitdth="makerWidAndHei.w"
      :markerHeight="makerWidAndHei.h"
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
import { fabricInstanceMixin, copyLayerTileMixin } from '../../mixins'
import { getCanvasDom } from '@/utils'
import { mapMutations } from 'vuex'
import {
  SECURITY,
  MAKER,
  DESIGN_SHOW_AREA_W,
  DESIGN_SHOW_AREA_H,
  DESIGN_AREA_W,
  DESIGN_AREA_H,
  COMPRESS_CHUNK_DESIGN_AN_LI_STR
} from '@/utils/constant'

const MIN_ADSORPTION_NUM = 15

export default {
  inject: ['canvasModifiedHandler'],
  mixins: [fabricInstanceMixin, copyLayerTileMixin],
  props: {
    data: {
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
    canvasBgPic() {
      const tmpArr = []
      const klImages = this.data.kl_images
      klImages.map((img) => {
        if (SECURITY == img.type) {
          return tmpArr.push(img)
        }
      })
      try {
        if (tmpArr[0].img_url) {
          return tmpArr[0]
        }
        return {
          img_url: require('@/assets/images/default.png')
        }
      } catch (err) {
        return {
          img_url: require('@/assets/images/default.png')
        }
      }
    },
    makerPic() {
      const tmpArr = []
      const klImages = this.data.kl_images
      klImages.map((img) => {
        if (MAKER == img.type) {
          return tmpArr.push(img)
        }
      })

      try {
        if (tmpArr[0].img_url) {
          return tmpArr[0]
        }
        return {
          img_url: require('@/assets/images/default.png')
        }
      } catch (err) {
        return {
          img_url: require('@/assets/images/default.png')
        }
      }
    },
    makerWidAndHei() {
      let tmpObj = {
        w: 0,
        h: 0
      }
      const klImages = this.data.kl_images
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
    },
    canvas() {
      return this.$refs[this.id] && this.$refs[this.id]
    }
  },
  methods: {
    ...mapMutations(['SET_FABRIC_OBJECTS']),
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
        .filter((item) => item.type !== 'i-text' && item.type !== 'image' && item.type !== 'group' && item.type !=='rect')
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
      // const types = this.instance.getObjects().map(({ type }) => type);
      // if (types.includes("line")) return;
      // const { width, height } = this.instance.canvas;
      // this.instance.drawDottedline({
      //   x: width / 2,
      //   y: 0,
      //   x1: width / 2,
      //   y1: height,
      //   drawWidth: 1,
      //   offset: 15,
      //   empty: 8,
      //   color: "#3841DB",
      // });

      // this.instance.drawDottedline({
      //   x: 0,
      //   y: height / 2,
      //   x1: width,
      //   y1: height / 2,
      //   drawWidth: 1,
      //   offset: 15,
      //   empty: 8,
      //   color: "#3841DB",
      // });
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
      if (img.width && img.height) {
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

    //获取安全线层相对mark层位置
    getDirMarkToSecurityPos({ markW, markH }) {
      const { left: sL, top: sT, width: sW, height: sH } = this.canvasBgPic
      const { left: mL, top: mT, width: mW, height: mH } = this.makerPic
      const scaleX = sW / mW
      const scaleY = sH / mH
      const securityW = markW * scaleX
      const securityH = markH * scaleY
      const dirL = Math.ceil((mL - sL) * (markW / mW))
      const dirT = Math.ceil((mT - sT) * (markH / mH))
      return {
        dirL,
        dirT,
        width: securityW,
        height: securityH
      }
    },

    async initCanvasBgImg() {
      this.fabricLoading = true
      try {
        this.$nextTick(async () => {
          //初始化一个img对象，设置src获取图片的信息
          const { img_url: securityOverLayPic } = this.canvasBgPic
          const { img_url: makerOverLayPic } = this.makerPic

          const [img, markImg] = await Promise.all([
            getCanvasDom(securityOverLayPic + COMPRESS_CHUNK_DESIGN_AN_LI_STR),
            getCanvasDom(makerOverLayPic + COMPRESS_CHUNK_DESIGN_AN_LI_STR)
          ])

          const {
            w: markW,
            h: markH,
            dirW: markDirW,
            dirH: markDirH
          } = this.getCalcPic({
            img: markImg
          })
          const c = document.createElement('canvas')
          const ctx = c.getContext('2d')

          c.width = DESIGN_SHOW_AREA_W + DESIGN_SHOW_AREA_W
          c.height = DESIGN_SHOW_AREA_H + DESIGN_SHOW_AREA_H

          if(this.makerWidAndHei.w >= this.makerWidAndHei.h) {
             this.canvas.realWidth = markW
            this.canvas.realHeight = markW * this.makerWidAndHei.h / this.makerWidAndHei.w
          } else {
             this.canvas.realWidth = markH * this.makerWidAndHei.w / this.makerWidAndHei.h
          this.canvas.realHeight =markH
          }
          console.log(' this.canvas.realWidth',  this.canvas.realWidth)
          console.log('  this.canvas.realHeight',   this.canvas.realHeight)
          c.setAttribute('id', this.id + 'markImg')
          ctx.drawImage(markImg, markDirW + DESIGN_SHOW_AREA_W / 2, markDirH + DESIGN_SHOW_AREA_H / 2, markW, markH)

          const imgData = ctx.getImageData(
            markDirW + DESIGN_SHOW_AREA_W / 2,
            markDirH + DESIGN_SHOW_AREA_H / 2,
            markW,
            markH
          )

          const data = imgData.data
          for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] == 0) {
              data[i] = 233
              data[i + 1] = 236
              data[i + 2] = 243
              // data[i + 3] = 255;
              data[i + 3] = 230
            } else {
              data[i] = 0
              data[i + 1] = 0
              data[i + 2] = 0
              data[i + 3] = 0
            }
          }

          ctx.fillStyle = 'rgba(233, 236, 243, 0.9)'
          ctx.fillRect(0, 0, c.width, c.height)

          ctx.putImageData(imgData, markDirW + DESIGN_SHOW_AREA_W / 2, markDirH + DESIGN_SHOW_AREA_H / 2)

          //获取安全线层相对mark层位置
          const {
            dirL: sToMDirL,
            dirT: sToMDirT,
            width: securityW,
            height: securityH
          } = this.getDirMarkToSecurityPos({ markW, markH })

          ctx.drawImage(
            img,
            markDirW + DESIGN_SHOW_AREA_W / 2 - sToMDirL,
            markDirH + DESIGN_SHOW_AREA_H / 2 - sToMDirT,
            securityW,
            securityH
          )

          //覆盖层旋转角度
          const angle = this.data.show_rotate || 0

          this.canvas.setOverlayImage(c.toDataURL(), {
            width: c.width,
            height: c.height,
            originX: 'center',
            originY: 'center',
            angle,
            left: c.width / 2 - DESIGN_SHOW_AREA_W / 2,
            top: c.height / 2 - DESIGN_SHOW_AREA_H / 2
          })

          // this.canvas.canvas.setOverlayColor('rgba(233, 236, 243, 0.9)')

          //设置背景色
          this.canvas.setBackgroundColor('rgb(255, 255, 255)')
          this.fabricLoading = false
          //切换设计模式初始化数据
          setTimeout(() => {
            this.initTransfromData()
          }, 100)
        })
      } catch (err) {
        this.fabricLoading = false
        console.log(err)
      }
    },

    initTransfromData() {
      if (!this.oneGroupTransformListData.length) return
      const { groupIndex } = this
      const sourceJson = this.oneGroupTransformListData[groupIndex]
      console.log('sourceJson', sourceJson)
      if (!sourceJson) return
      const instance = this.fabricList[groupIndex]
      const cJson = instance.canvas.toJSON()
      sourceJson.overlayImage = cJson.overlayImage
      instance.canvas.loadFromJSON(sourceJson, (c) => {
        instance.canvas.renderAll()
        const objects = instance.getObjects()
        objects.map(o => {
          if(o.groupType !== undefined) {
            this.baseTile(o.groupType, o, instance)
          }
        })
        
        const os =  instance.canvas.getObjects()
        console.log('os', os)
        // this.canvasModifiedHandler()
      })
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
