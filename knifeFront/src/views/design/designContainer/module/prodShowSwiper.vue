<template>
  <div class="prodShowSwiperComponent">
    <div class="title preview" @click="preview">全局预览</div>
    <div class="design-swiper-container">
      <SwiperWrapper
        v-loading="picWrapperLoading"
        ref="swiperWrapper"
        v-slot="{ scoped: { base64Pic, white_show, indx, loading } }"
        :slideStyle="{
          width: '100%',
          height: '100%'
        }"
        :swiperData="primShowImgs[curIndex] || []"
        :defaultSwiperOptions="{
          autoplay: false
        }"
      >
        <!-- <div class="img-wrapper">
          <Magnifier
            v-loading="loading"
            width="308px"
            height="308px"
            @load="load(primShowImgs[curIndex][indx])"
            :picUrl="base64Pic || white_show"
          />
        </div>-->

        <div class="img-wrapper">
          <Magnifier width="248px" height="248px" :picUrl="base64Pic || white_show" />
        </div>
      </SwiperWrapper>
    </div>

    <div
      :style="{ 'background-color': color }"
      :class="['color', curIndex == index && 'active']"
      :key="index"
      v-for="(color, index) in colors"
      @click="toggleCurIndex(index)"
    ></div>
  </div>
</template>

<script>
import SwiperWrapper from '@/components/swiperWrapper'
import Magnifier from '@/components/magnifier'
import { mapGetters, mapMutations } from 'vuex'
import { fabricInstanceMixin,copyLayerTileMixin1 } from '../mixins'
import { getURLBlod, file2Content, getImgData, getUUID } from '@/utils'
//引入worker-loader
import Worker from './calcBetterProShow22.worker.js'
// import Worker from './calcBetterProShow_big1.worker.js'
// import Worker from './calcBetterProShow_bigbig2.worker.js'
import { initShowImageMapxy } from './initcalc.js'
import {
  MAKER,
  DESIGN_SHOW_AREA_W,
  DESIGN_SHOW_AREA_H,
  DESIGN_AREA_W,
  DESIGN_AREA_H,
  DESIGN_PROPORTION,
  COMPRESS_MAX_LONG_STR,
  INIT_GTOUP_INFO_FORM
} from '@/utils/constant'

export default {
  mixins: [fabricInstanceMixin,copyLayerTileMixin1],
  components: {
    SwiperWrapper,
    Magnifier
  },
  props: {
    protoObj: {
      type: Object,
      required: true
    },
    knifeData: {
      type: Array,
      required: true
    },

    //一键定制信心
    quickDesignData: {
      type: Array,
      default: true
    },

    proShowData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      curIndex: 0,
      picWrapperLoading: false,
      primShowImgs: [],
      whiteShows: [],
      shadowShows: [],
      showMarks: [],
      allShowMarks: [],
      cloneCanvas: [],
      workers: [],
      klMaskImgs: [],
      klMaskByOneDesignImgs: [] //一键定制mask
    }
  },
  watch: {
    primShowImgs: {
      handler(newVal) {
        this.$emit('updatePreviewData', newVal)
      },
      deep: true,
      immediate: true
    }
  },

  computed: {
    ...mapGetters(['previewShow', 'devicePixelRatio']),

    colors() {
      const { prim_struct } = this.protoObj || []
      return (prim_struct || []).map(({ color_value }) => {
        return color_value
      })
    },
    swiperCurIndex() {
      const { swiperWrapper } = this.$refs
      if (!swiperWrapper) return -1
      const { activeIndex } = swiperWrapper.swiper
      return activeIndex
    },

    allQuickDesignGroups() {
      const tmpArr = []
      this.quickDesignData.map(({ base_kl_groups = [] }) => {
        base_kl_groups.map((g, index) => {
          tmpArr.push(g)
        })
      })
      return tmpArr
    },

    klMasksData() {
      const tmpArr = []
      if (!this.isOneGroupDesign) {
        this.knifeData.map(({ kl_images }) => {
          kl_images.map((kl_image) => {
            const { type } = kl_image
            if (type == MAKER) {
              tmpArr.push(kl_image)
            }
          })
        })
      } else {
        let num = -1
        this.quickDesignData.map(({ base_kl_groups = [] }) => {
          base_kl_groups.map(({ kl_images }, index) => {
            num++
            tmpArr[num] = []
            kl_images.map((kl_image, sIndex) => {
              const { type } = kl_image
              if (type == MAKER) {
                tmpArr[num].push(kl_image)
              }
            })
          })
        })
      }

      return tmpArr
    }
  },
  methods: {
    ...mapMutations(['UPDATE_PREVIEW_SHOW', 'UPDATE_ONE_GROUP_DESIGN_LAYER_POS_DATA']),

    initCloneCanvas(num) {
      const tmpArr = []
      for (let i = 0; i < num; i++) {
        const f = new fabric.Canvas(getUUID() + '', {
          preserveObjectStacking: true,
          width: DESIGN_SHOW_AREA_W,
          height: DESIGN_SHOW_AREA_H,
          enableRetinaScaling: true
        })
        tmpArr.push(f)
      }
      this.cloneCanvas = tmpArr
    },

    preview() {
      this.UPDATE_PREVIEW_SHOW(true)
    },

    load(item) {
      this.$set(item, 'loading', false)
    },

    createImgByJson() {
      this.jsonToImgTimer && clearTimeout(this.jsonToImgTimer)
      this.jsonToImgTimer = setTimeout(() => {
        if (this.instance) {
          this.updateArrProShowByWhiteShows()
        }
      }, 200)
    },

    getCurSwiperProShow(index, sIndex) {
      if (this.swiperCurIndex == -1) return null
      try {
        return this.primShowImgs[index][sIndex]
      } catch (err) {
        return null
      }
    },

    resetSwiper() {
      try {
        const { swiperWrapper } = this.$refs
        if (!swiperWrapper) return
        swiperWrapper.swiper.slideTo(0, 0, false)
      } catch (e) {
        return false
      }
    },

    //获取clip参数
    getClipPos({ rW, rH, cW, cH }) {
      if (rW === undefined) {
        rW = cW
      }
      if (rH === undefined) {
        rH = cH
      }
      // const cW = DESIGN_SHOW_AREA_W;
      // const cH = DESIGN_SHOW_AREA_H;
      const l = (cW - rW) / 2
      const w = cW - l * 2
      const t = (cH - rH) / 2
      const h = cH - t * 2
      return {
        t,
        l,
        w,
        h
      }
    },

    //存在多少张效果图，开几个线程。每个线程处理一张效果图
    initWorkers() {
      if (this.workers.length) return
      const whiteShows = this.whiteShows
      const workers = []
      whiteShows.map((arr, index) => {
        workers[index] = []
        if (Array.isArray(arr)) {
          arr.map(() => {
            const worker = new Worker()
            workers[index].push(worker)
          })
        }
      })
      this.workers = workers
    },

    //销毁其他线程
    destroyWorkers() {
      if (!this.workers.length) return
      this.workers.map((arr) => {
        arr.map((worker) => {
          if (worker) {
            worker.terminate()
          }
        })
      })
      this.workers = []
    },

    getTransformationByPsdDocument({ mW, mH, cW, cH, cL, cT, index }) {
      const {
        module: { width: dW, height: dH },
        group: { quick_design_left: mL, quick_design_top: mT }
      } = this.getModuleByGroupIndex(index)

      try {
        const scaleX = cW / dW
        const scaleY = cH / dH
        const wRadio = mW / dW
        const hRadio = mH / dH
        return {
          scaleX: wRadio,
          scaleY: hRadio,
          l: mL * scaleX,
          t: mT * scaleY,
          w: cW * wRadio,
          h: cH * hRadio,
          pW: mW,
          pH: mH
        }
      } catch {
        return {
          scaleX: 1,
          scaleY: 1
        }
      }
    },

    // getTransformationByPsdDocument({ mW, mH, mT, mL, cW, cH, cL, cT }) {
    //   const { kl_image_height: dH, kl_image_width: dW } =
    //     this.psdDocumentInfo || {}
    //   try {
    //     const scaleX = cW / dW
    //     const scaleY = cH / dH
    //     const wRadio = mW / dW
    //     const hRadio = mH / dH
    //     return {
    //       scaleX: wRadio,
    //       scaleY: hRadio,
    //       l: mL * scaleX,
    //       t: mT * scaleY,
    //       w: cW * wRadio,
    //       h: cH * hRadio,
    //       pW: mW,
    //       pH: mH
    //     }
    //   } catch {
    //     return {
    //       scaleX: 1,
    //       scaleY: 1
    //     }
    //   }
    // },

    formatCarefulJson (c, json) {
      const oObjects = c.getObjects()
      const os = json.objects
      os.map((o, index) => {
        if (o.type === 'group') {
          if (!oObjects[index + 1]) return
          const { scaleX, scaleY } = oObjects[index + 1]
          const gs = o.objects
          gs.map((g) => {
            g.scaleX = scaleX
            g.scaleY = scaleY
          
          })
        } else {
          if (oObjects[index]) {
            const { scaleX, scaleY } = oObjects[index]
            o.scaleX = scaleX
            o.scaleY = scaleY
          }
        }
      })
    },

    createGroupToRotate(canvas, index) {
      //旋转角度
      let angle = 0
      if (this.isOneGroupDesign) {
        angle = this.allQuickDesignGroups[index] && this.allQuickDesignGroups[index].quick_design_rotate
      } else {
        angle = (this.knifeData[index] && this.knifeData[index].show_rotate) || 0
      }
      if (!angle) return
      const os = canvas.getObjects()
      const circle = new fabric.Circle({
        radius: 5000,
        left: DESIGN_SHOW_AREA_W / 2,
        top: DESIGN_SHOW_AREA_H / 2,
        originX: 'center',
        originY: 'center'
      })

      const g = new fabric.Group([circle, ...os], {
        angle: -angle,
        originX: 'center',
        originY: 'center'
      })

      // console.log('g', g)

      // g.ungroupOnCanvas()
      canvas.remove(g)
    },

      calcRealPosByGgroupObj(group, gLayer) {
      const mGroup = group.calcTransformMatrix(true)
      const mObject = gLayer.calcTransformMatrix(true)
      fabric.util.qrDecompose(mGroup)
      fabric.util.qrDecompose(mObject)
      const mTotal = fabric.util.multiplyTransformMatrices(mGroup, mObject)
      const ce = new fabric.Point(0, 0)
      const p = fabric.util.transformPoint(ce, mTotal)
      return p
    },

    getRotatePoint ({rX, rY, oX, oY, angle}) {
        const {PI, cos, sin} = Math
        const rotate = PI/180 * -angle
        let x = (rX - oX) * cos(rotate) - (rY - oY) * sin(rotate) + oX
        let y = (rY - oY) * cos(rotate) + (rX - oX) * sin(rotate) + oY
        console.log(x, y)
        const dirX = x - rX
        const dirY = y - rY
        console.log(dirX, dirY)
        return {
            dirX,
            dirY
        }
    },
    
    transformToCanvasCenter (layer) {
      const {floor} = Math
      const [cX, cY] = [DESIGN_SHOW_AREA_W /2, DESIGN_SHOW_AREA_W /2]
      const { scaleX, scaleY, left, top, width, height, groupHorizontal, groupVertical, groupType } = layer
      console.log('groupHorizontal, groupVertical, groupType', groupHorizontal, groupVertical, groupType)
      const [lW, lH] = [width*scaleX , height*scaleY]
      // const [lX, lY] = [left + lW / 2, top + lH  / 2]
      const [lX, lY] = [left, top]
      const hYymbolDirection = cX >= lX ? 1 : -1  
      const vYymbolDirection = cY >= lY ? 1 : -1  
      let xStep = lW + hYymbolDirection * groupHorizontal
      let yStep = lH + vYymbolDirection * groupVertical
      if(groupType == 2) {
         xStep = xStep + hYymbolDirection * groupHorizontal
      }
      if(groupType == 3) {
         yStep = yStep  + vYymbolDirection * groupVertical
      }
      const [moveX, moveY] = [floor((cX - lX) / xStep) * xStep, floor((cY - lY) / yStep) * yStep]
      console.log('moveX, moveY', moveX, moveY)
      return {moveX, moveY}
    },

    formatObjectsData(source, assign) {
      const keys = Object.keys(INIT_GTOUP_INFO_FORM)
      keys.forEach((key) => {
        assign[key] = source[key]
      })
    },

    oneGroupDesignToChunkDesign (instanceIndex) {
      var t0 = performance.now()

      const {
          l,
          t,
          w,
          h,
          moveL,
          moveT,
          scaleX,
          scaleY,
          oRadio,
          cL,
          cT
        } = this.getTransformation(instanceIndex)
        const canvas =
          this.getOnGroupDesiginInstanceByIndex(instanceIndex).canvas
        const json = canvas.toJSON()

        const objects = json.objects
        const iObjects = canvas.getObjects()
        for(let i = objects.length; i--; i>=0 ) {
         
          const layer = objects[i]
          const index = i

          
           if (layer.type === 'group') {
            if (!objects[index + 1]) return

            this.formatObjectsData(iObjects[index + 1], objects[index + 1])

            

            // objects[index + 1].left += moveX
            // objects[index + 1].top += moveY

            const { scaleX:lScaleX, scaleY: lScaleY, left, top, width, height } = objects[index + 1]
            
            objects[index].isDelete = true
             let { x, y } = iObjects[index + 1].getCenterPoint()
            
            const dirMoveL =
              (1 / oRadio) * moveL + (x - cL) * (1 / oRadio - 1)
            const dirMoveT =
              (1 / oRadio) * moveT + (y - cT) * (1 / oRadio - 1)
              // layer.objects = [layer.objects[0]]
             const gs = layer.objects

                   
              layer.left = layer.left+dirMoveL
              layer.top = layer.top+dirMoveT
            gs.map((g, gIndex) => {
            
              g.scaleX = lScaleX
              g.scaleY = lScaleY
              g.left =  (g.left * scaleX) 
              g.top = (g.top * scaleY) 
              
              
              
            })
            const {width: gW, height:gH, scaleX: gScaleX, scaleY: gScaleY, left: gL, top: gT} = layer
            const {width: i0W, height: i0H, scaleX: i0ScaleX, scaleY: i0ScaleY, left: i0L, top: i0T} = gs[0]
            const {width: curW, height: curH, scaleX: curScaleX, scaleY: curScaleY, left: curL, top: curT} = objects[index + 1]
          
            //  const gPos ={
            //    x: gL + gW * gScaleX / 2,
            //    y: gT + gH * gScaleY / 2,
            //  }

              const gPos ={
               x: gL,
               y: gT,
             }

            //  const cPos = {
            //     x: i0L + i0W * i0ScaleX / 2,
            //    y: i0T +  i0H * i0ScaleY / 2,
            //  }

             const cPos = {
                x: i0L,
               y: i0T,
             }

            //   const curPos = {
            //     x: curL + curW * curScaleX / 2,
            //    y: curT + curH * curScaleY / 2,
            //  }
            const curPos = {
                x: curL,
               y: curT,
             }
            const {moveX, moveY} = this.transformToCanvasCenter(objects[index + 1]) 
             console.log('curPos', curPos)
             console.log('gPos', gPos)
              layer.left = parseInt(layer.left + (curPos.x - (cPos.x + gPos.x))) + moveX
              layer.top =  parseInt(layer.top + (curPos.y - (cPos.y + gPos.y))) + moveY
              console.log('layer.left',layer.left)
              console.log('layer.top',layer.top)
            
            // console.log('gs', gs.length)
          }  else {
            
             let { x, y } = iObjects[index].getCenterPoint()
            const dirMoveL =
              (1 / oRadio) * moveL + (x - cL) * (1 / oRadio - 1)
            const dirMoveT =
              (1 / oRadio) * moveT + (y - cT) * (1 / oRadio - 1)

            layer.scaleX = iObjects[index].scaleX * scaleX
            layer.scaleY = iObjects[index].scaleY * scaleY
            layer.left = iObjects[index].left + dirMoveL
            layer.top = iObjects[index].top + dirMoveT
            layer.id = iObjects[index].id
          }

        }
        
       var t1 = performance.now()
       console.log('t1-t0', t1-t0)
        // console.log('json', json)
        // json.objects = json.objects.filter(({isDelete}) =>!isDelete)
        return json
           
    },

     getTransformation(instanceIndex) {
      let canvas = this.getOnGroupDesiginInstanceByIndex(instanceIndex).canvas

      const { left: cL, top: cT } = canvas.getCenter()
      const { max } = Math
  
      const {
        module: { width: dW, height: dH }
      } = this.getModuleByGroupIndex(instanceIndex)

      const {
        l,
        t,
        w,
        h,
        scaleX: iScaleX,
        scaleY: iScaleY,
        pW,
        pH
      } = this.oneGroupDesignLayerPosData[instanceIndex]

      let oRadio = max(w, h) / DESIGN_AREA_W
      const scale = max(pW, pH) / max(dW, dH)
      const moveL = cL - (l + w / 2)
      const moveT = cT - (t + h / 2)

      let scaleX = 1 / scale
      let scaleY = 1 / scale

      return { l, t, w, h, moveL, moveT, scaleX, scaleY, oRadio, cL, cT }
    },


    getRealWidthAndHeight ({pW, pH}) {
      let realWidth = 0 , realHeight = 0
      if(pW >= pH) {
          realWidth = DESIGN_AREA_W
          realHeight = DESIGN_AREA_W * pH / pW
        } else {
          realWidth = DESIGN_AREA_H * pW / pH
          realHeight = DESIGN_AREA_H
        }
         return {
          realWidth, realHeight
        }

    },

    async getComputedData(whiteShowArr, index) {
      const t0 = performance.now()
      whiteShowArr.map(async (white_show, sIndex) => {
        const computedData = {}
        computedData.white_show = white_show
        computedData.shadow_show = this.shadowShows[index][sIndex]
        computedData.show_image_mapxy =
          this.allShowImageMapxy && this.allShowImageMapxy[index] && this.allShowImageMapxy[index][sIndex]
        computedData.data = []
        try {
          let klMasksData = this.klMasksData

          if (this.isOneGroupDesign) {
            let tmp = []
            this.klMasksData.map((data) => {
              data.map((item) => {
                tmp.push(item)
              })
            })
            klMasksData = tmp
          }
          const pArr = klMasksData.map(async (klMasksItem, k) => {
            computedData.data[k] = {}
            let { left, top, width, height, img_url } = klMasksItem
            const kl_mask = {
              left,
              top,
              width,
              height,
              img_url
            }
            // if(this.isOneGroupDesign) {
            //   const {
            //     module: { width: dW, height: dH },
            //     group: { quick_design_left: mL, quick_design_top: mT }
            //   } = this.getModuleByGroupIndex(k)
            //   width = dW
            //   height = dH

            // }

            

            computedData.data[k].kl_mask = kl_mask

            if (this.isOneGroupDesign) {
              computedData.data[k].klMaskImg = this.klMaskByOneDesignImgs[k]
            } else {
              computedData.data[k].klMaskImg = this.klMaskImgs[k]
            }

            computedData.data[k].front_design = await new Promise(async (resolve) => {
              let fabricListItem = this.fabricList[k]

              if (this.isOneGroupDesign) {
                fabricListItem = this.getOnGroupDesiginInstanceByIndex(k)
              }

              let {realWidth, realHeight} = this.getRealWidthAndHeight({pW: width, pH: height})

              //获取 realWidth和realHeight
              // if(realWidth === undefined || realHeight === undefined) {
              //     await new Promise(resolve => {
              //       let timer = setInterval(() => {
              //         realWidth = fabricListItem.realWidth
              //         realHeight = fabricListItem.realHeight
              //     if(realWidth&&realHeight) {
              //       clearInterval(timer)
              //       resolve(true)
              //     }
                  
              //   }, 20)
              //   })
              
              // }

              const oObjects = fabricListItem.getObjects()
              let json = fabricListItem.canvas.toJSON()
              if(this.isOneGroupDesign) {
                //获取转换之后的json
               json = this.oneGroupDesignToChunkDesign(k)
              } else {
                // this.formatCarefulJson(fabricListItem, json)
              }

              console.log('json1111', json)
              
              this.cloneCanvas[k].loadFromJSON(json, () => {
                const c = this.cloneCanvas[k]

                //计算旋转后的图片
                this.createGroupToRotate(c, k)

                // const mWRadio = width / realWidth
                // const mHRadio = height / realHeight
                // const radio = Math.max(mWRadio, mHRadio)

                let { radio } = this.getCalcRadio({
                  w: width,
                  h: height,
                  rW: realWidth,
                  rH: realHeight,
                  size: Math.max(white_show.width, white_show.height)
                })

                

                //存在复制情况下scaleX，scaleY精度不够
                // if(!this.isOneGroupDesign) {
                //    const os = c.getObjects()
                //   os.map((o, index) => {
                //     if (o.type === 'group') {
                //       if (!oObjects[index + 1]) return
                //       const { scaleX, scaleY } = oObjects[index + 1]
                //       const gs = o.getObjects()
                //       gs.map((g) => {
                //         g.setOptions({
                //           scaleX,
                //           scaleY
                //         })
                //       })
                //     } else {
                //       if (oObjects[index]) {
                //         const { scaleX, scaleY } = oObjects[index]
                //         o.setOptions({
                //           scaleX,
                //           scaleY
                //         })
                //       }
                //     }
                //   })
                // }
               
                //新增解决浏览器放大缩小的问题
                // const devicePixelRatio =  window.devicePixelRatio
                const devicePixelRatio = this.devicePixelRatio
                c.setZoom(radio / devicePixelRatio)
                c.setHeight(fabricListItem.canvas.getHeight() * radio / devicePixelRatio)
                c.setWidth(fabricListItem.canvas.getWidth() * radio / devicePixelRatio)


                c.overlayImage = null
                // const { t, l, w, h } = this.getClipPos({
                //   cW: DESIGN_SHOW_AREA_W,
                //   cH: DESIGN_SHOW_AREA_H,
                //   rW: realWidth,
                //   rH: realHeight
                // })

                const { t, l, w, h } = this.getClipPos({
                  cW: DESIGN_SHOW_AREA_W * radio,
                  cH: DESIGN_SHOW_AREA_H * radio,
                  rW: realWidth * radio,
                  rH: realHeight * radio
                })

                c.renderAll()

                let wRadio = width / w
                let hRadio = height / h
            
                // let data = []
                // if (this.isOneGroupDesign) {
                //   const {
                //     scaleX: iScaleX,
                //     scaleY: iScaleY,
                //     l: iL,
                //     t: iT,
                //     w: iW,
                //     h: iH
                //   } = this.getTransformationByPsdDocument({
                //     mW: kl_mask.width,
                //     mH: kl_mask.height,
                //     mT: top,
                //     mL: left,
                //     cW: w,
                //     cH: h,
                //     cL: l,
                //     cT: t,
                //     index: k
                //   })
                //   wRadio = wRadio / iScaleX
                //   hRadio = hRadio / iScaleY

                //   const { round, ceil } = Math
                //   try {
                  
                //     data = c.getContext('2d').getImageData(round(iL + l), round(iT + t), round(iW), round(iH))

                //        // const data1 =  c.getContext('2d').getImageData(0, 0, c.width, c.height)
                // //   console.log('data1', data1)
                //   //  let c1 = document.createElement('canvas')
                //   //   const ctx = c1.getContext('2d')
                //   //  c1.width =iW
                //   // c1.height = iH
                 
                //   // ctx.putImageData(c.getContext('2d').getImageData(0, 0, 700 * radio, 700 * radio), 0, 0)
                //   // ctx.putImageData(c.getContext('2d').getImageData(0, 0, c.width, c.height), 0, 0)
                //   // ctx.putImageData(data, 0, 0)
                //             //  const base64 = c1.toDataURL()
                //   // const base64 = c.toDataURL()
                //   // console.log('base64',base64)


                //   } catch(err) {
                //     console.log(err)
                //     data = {
                //       data: [],
                //       width: 0,
                //       height: 0
                //     }
                //   }
                // } else {
                //   const { round } = Math
                //   try {
                  
                //   // const devicePixelRatio =  window.devicePixelRatio


                //   // data = c.getContext('2d').getImageData(round(l * devicePixelRatio), round(t * devicePixelRatio), parseInt(w/devicePixelRatio), parseInt(h * devicePixelRatio))
                //   // data = c.getContext('2d').getImageData(round(l * devicePixelRatio), round(t * devicePixelRatio), parseInt(w*devicePixelRatio), parseInt(h * devicePixelRatio))
                //   data = c.getContext('2d').getImageData(round(l ), round(t ), round(w), round(h ))

                //   //   wRadio = wRadio / devicePixelRatio
                //   // hRadio = hRadio / devicePixelRatio

                // // const data1 =  c.getContext('2d').getImageData(0, 0, c.width, c.height)
                // //    let c1 = document.createElement('canvas')
                // //     const ctx = c1.getContext('2d')
                // //    c1.width =w
                // //   c1.height = h
               
                //   // ctx.putImageData(c.getContext('2d').getImageData(0, 0, 700 * radio, 700 * radio), 0, 0)
                //   // ctx.putImageData(c.getContext('2d').getImageData(0, 0, c.width, c.height), 0, 0)
                //   // ctx.putImageData(data, 0, 0)
                //   //            const base64 = c1.toDataURL()
                //   // const base64 = c.toDataURL()
                //             //  console.log('base64', base64)
                //   } catch(err) {
                //      console.log(err)
                //       data = {
                //       data: [],
                //       width: 0,
                //       height: 0
                //     }
                //   }
                 
                // }
                const { round } = Math
                console.log('round(l), round(t), round(w), round(h)', round(l), round(t), round(w), round(h))
                const data = c.getContext('2d').getImageData(round(l), round(t), round(w), round(h))

                 let c1 = document.createElement('canvas')
                    const ctx = c1.getContext('2d')
                   c1.width =data.width
                  c1.height = data.height
                 
                  // ctx.putImageData(c.getContext('2d').getImageData(0, 0, 700 * radio, 700 * radio), 0, 0)
                  // ctx.putImageData(c.getContext('2d').getImageData(0, 0, c.width, c.height), 0, 0)
                  ctx.putImageData(data, 0, 0)
                             const base64 = c1.toDataURL()
                  // const base64 = c.toDataURL()
                  console.log(`base64_${k}`, base64)
                kl_mask.wRadio = wRadio
                kl_mask.hRadio = hRadio
                data.cols = data.width
                data.rows = data.height
                resolve(data)
              })
            })
            // calcShowImage(
            //   white_show,
            //   shadow_show,
            //   front_design,
            //   show_image_mapxy,
            //   kl_mask
            // )
          })

          await Promise.all(pArr)
          // //运行worker
          const t1 = performance.now()
        //   console.log('t1', t1)
        //   console.log('t1 - t0', t1 - t0)
        //  console.log('main t', (new Date()).getTime()) 
          this.runWoker(index, sIndex, computedData)
          // this.getProShowBase64(white_show, index, sIndex)
        } catch (err) {
          console.log('err', err)
        }
      })
    },

    //计算合适的比率
    getCalcRadio({ w, h, rW, rH, size }) {
      const { max } = Math
      const maxSize = max(size, w, h)
      // return {
      //   radio:  max(w, h) / max(rW, rH)
      // }
      if (w >= h) {
        if (maxSize === size) {
          return {
            radio: w / rW,
            klWRadio: w / rW,
            klHRadio: h / rH
          }
        } else {
          return {
            radio: size / rW,
            klWRadio: size / rW,
            klHRadio: (size * h) / w / h
          }
        }
      } else {
        if (maxSize === size) {
          return {
            radio: h / rH,
            klWRadio: w / rW,
            klHRadio: h / rH
          }
        } else {
          return {
            radio: size / rH,
            klWRadio: (size * w) / h / w,
            klHRadio: size / rH
          }
        }
      }
    },

    //运行其他线程
    async runWoker(index, sIndex, cdata) {
      // let { white_show, shadow_show, data, show_image_mapxy } = cdata
      // data.map(async (item) => {
      //   let { kl_mask, front_design, klMaskImg } = item

      //   kl_mask.klMaskImg = klMaskImg
      //   return calcShowImage(
      //     white_show,
      //     shadow_show,
      //     front_design,
      //     show_image_mapxy,
      //     kl_mask
      //   )
      // })
      // this.getProShowBase64(white_show, index, sIndex)
      // calcShowImage(
      //   white_show,
      //   shadow_show,
      //   front_design,
      //   show_image_mapxy,
      //   kl_mask
      // )
      let worker = this.workers[index][sIndex]
      worker.postMessage(cdata)
      worker.onmessage = (evt) => {
        // evt.data.cols = evt.data.width
        // evt.data.rows = evt.data.height
        worker.terminate()
        this.workers[index][sIndex] = null
        this.getProShowBase64(evt.data, index, sIndex)
      }
    },

    async updateArrProShowByWhiteShows() {
      this.destroyWorkers()
      //线程开启
      this.$nextTick(() => {
        this.initWorkers()
        this.whiteShows.map(async (whiteShowArr, index) => {
          this.getComputedData(whiteShowArr, index)
        })
      })
    },

    //获取计算后的base64图片
    getProShowBase64(show_image, index, sIndex) {
      const curData = this.getCurSwiperProShow(index, sIndex)
      this.$set(curData, 'base64Pic', show_image)
    },

    //当前款式加loading
    loadingCurStruct(index, sIndex, bool = true) {
      if (this.curIndex == index) {
        this.$set(this.getCurSwiperProShow(index, sIndex), 'loading', bool)
      }
    },

    //更新一键定制的图层信息
    updateOneGroupPosData() {
      if (!this.isOneGroupDesign) {
        this.UPDATE_ONE_GROUP_DESIGN_LAYER_POS_DATA([])
        return
      }
      const tmpArr = []
      let num = -1
      this.quickDesignData.map((item, index) => {
        const { base_kl_groups = [] } = item
        const { realWidth, realHeight } = this.fabricList[index]
        const { t, l, w, h } = this.getClipPos({
          cW: DESIGN_SHOW_AREA_W,
          cH: DESIGN_SHOW_AREA_H,
          rW: realWidth,
          rH: realHeight
        })

        base_kl_groups.map((group, sIndex) => {
          num++
          const data = this.klMasksData[num]
          data.map((klMasksItem) => {
            const { left, top, width, height } = klMasksItem
            const {
              scaleX,
              scaleY,
              l: iL,
              t: iT,
              w: iW,
              h: iH,
              pW,
              pH
            } = this.getTransformationByPsdDocument({
              mW: width,
              mH: height,
              mT: top,
              mL: left,
              cW: w,
              cH: h,
              cL: l,
              cT: t,
              index: num
            })

            tmpArr.push({
              scaleX,
              scaleY,
              l: iL + l,
              t: iT + t,
              w: iW,
              h: iH,
              pW,
              pH
            })
          })
        })
      })
      this.UPDATE_ONE_GROUP_DESIGN_LAYER_POS_DATA(tmpArr)
    },

    //效果图数据加载完成后运行算法
    async runCalc() {
      if (this.picWrapperLoading === true) {
        await new Promise((resolve) => {
          let timer = setInterval(() => {
            if (this.picWrapperLoading == false) {
              clearInterval(timer)

              resolve(true)
            }
          }, 30)
        })
      }
      this.picWrapperLoading == true
      //更新一键定制的图层信息
      this.updateOneGroupPosData()

      this.updateArrProShowByWhiteShows()
    },

    //初始化设计器需要用到的数据
    async initPrimShowImgs() {
      this.picWrapperLoading = true
      this.primShowImgs = []
      this.proShowData.map((curProShowData) => {
        if (!curProShowData) return {}
        const { prim_show_groups } = curProShowData
        const curPrimShowImgs = ((prim_show_groups && prim_show_groups[0]) || {}).prim_show_img || []

        curPrimShowImgs.map((item) => (item.structId = curProShowData.id))
        this.primShowImgs.push(curPrimShowImgs)
      })
      const pArr = [
        //初始化white_show图片
        this.initWhiteShows(this.primShowImgs),
        //初始化阴影图片
        this.initshadowShow(this.primShowImgs),
        //初始化json和json对应的图片
        this.initShowMarks(this.proShowData),
        //初始化对应的Masks
        this.initKlMaskImgs()
      ]
      await Promise.all(pArr)
      this.initAllShowImageMapxy()
      //数据加载完后运行算法
      this.picWrapperLoading = false
      if (!this.isOneGroupDesign) {
        //运算计算效果图
        this.runCalc()
      }
    },

    initAllShowImageMapxy() {
      const allShowImageMapxy = this.whiteShows.map((whiteShowArr, index) => {
        return whiteShowArr.map((white_show, sIndex) => {
          return initShowImageMapxy({
            show_img: white_show,
            showMarks: this.allShowMarks[index][sIndex]
          })
        })
      })
      this.allShowImageMapxy = allShowImageMapxy
    },

    async initKlMaskImgs() {
      const klP = []
      const klOnDesignP = []
      this.knifeData.map(({ kl_images }) => {
        kl_images.map((kl_image) => {
          const { type } = kl_image
          if (type == MAKER) {
            klP.push(getImgData(kl_image.img_url))
          }
        })
      })

      this.quickDesignData.map(({ base_kl_groups = [] }) => {
        base_kl_groups.map(({ kl_images }) => {
          kl_images.map((kl_image) => {
            const { type } = kl_image
            if (type == MAKER) {
              klOnDesignP.push(getImgData(kl_image.img_url))
            }
          })
        })
      })
      const allP = [klP, klOnDesignP].map(async (pArr) => {
        return await Promise.all(pArr)
      })
      const data = await Promise.all(allP)

      this.klMaskImgs = data[0]
      this.klMaskByOneDesignImgs = data[1]
    },

    async initshadowShow(primShowImgs) {
      try {
        const shadowShows = []
        const pArr = primShowImgs.map((item, index) => {
          shadowShows[index] = []
          return item.map(async ({ shadow_show }, sIndex) => {
            const shadow = await getImgData(`${shadow_show}`)
            return (shadowShows[index][sIndex] = shadow)
          })
        })
        const allParr = pArr.map(async (item) => {
          return await Promise.all(item)
        })
        await Promise.all(allParr)

        this.shadowShows = shadowShows
        return true
      } catch (err) {
        return false
      }
    },

    async initWhiteShows(primShowImgs) {
      try {
        const whiteShows = []
        const pArr = primShowImgs.map((item, index) => {
          whiteShows[index] = []
          return item.map(async ({ white_show }, sIndex) => {
            const { width, height } = await getImgData(white_show)
            const proShow = await getImgData(`${white_show}`)
            proShow.naturalWidth = width
            proShow.naturalHeight = height
            return (whiteShows[index][sIndex] = proShow)
          })
        })
        const allParr = pArr.map(async (item) => {
          return await Promise.all(item)
        })
        await Promise.all(allParr)

        this.whiteShows = whiteShows
        return true
      } catch (err) {
        return false
      }
    },

    async initJsonData(jsonSrc) {
      const json = await getURLBlod(jsonSrc)
      if (!json) return {}
      const constent = await file2Content(json)
      return JSON.parse(constent || '{}')
    },

    async initShowMarks(data) {
      try {
        const allShowMarks = []
        const pArr = data.map((item, index) => {
          allShowMarks[index] = []
          const { prim_show_groups } = item
          if (prim_show_groups.length) {
            const { prim_show_img } = prim_show_groups[0]
            return prim_show_img.map((showImg, sIndex) => {
              allShowMarks[index][sIndex] = []
              const { show_masks = [] } = showImg
              return show_masks.map(async (showMask, grandSonIndex) => {
                const { map_json, mask } = showMask
                const root = await this.initJsonData(map_json)
                const show_mask = await getImgData(mask)
                allShowMarks[index][sIndex][grandSonIndex] = {
                  root,
                  show_mask
                }
                return true
              })
            })
          }
        })
        const allPArr = pArr.map(async (item) => {
          if (item === undefined) return
          const p = item?.map(async (itemPArr) => {
            return await Promise.all(itemPArr)
          })
          return await Promise.all(p || [])
        })
        await Promise.all(allPArr)

        this.allShowMarks = allShowMarks
        return true
      } catch (err) {
        return false
      }
    },

    toggleCurIndex(index) {
      if (index == this.curIndex) return
      this.curIndex = index
      if (this.$refs.swiperWrapper) {
        this.$refs.swiperWrapper.swiper.slideTo(0, 500, false)
      }
    }
  },

  destroyed() {
    //回收其他线程
    this.destroyWorkers()
  }
}
</script>

<style lang="scss" scoped>
.prodShowSwiperComponent {
  .title {
    cursor: pointer;
    margin-bottom: 10px;
  }
  .preview {
    font-size: 14px;
  }
  .design-swiper-container {
    height: 248px;
    border: 1px solid $border-color;
    .img-wrapper {
      // padding: 36px;
      .el-image {
        width: 100%;
        height: 100%;
        background: $bg-color;
      }
    }
  }
  .color {
    margin-top: 20px;
    display: inline-block;
    width: 25px;
    height: 25px;
    margin-right: 10px;
    border: 1px solid $border-color;
    opacity: 1;
    cursor: pointer;
  }
  .color.active {
    border-color: $color-danger;
    opacity: 1;
  }
}
</style>
