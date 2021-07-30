<template>
  <div class="prodShowSwiperComponent">
    <div class="title" @click="preview">全局预览</div>
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
        </div> -->

        <div class="img-wrapper">
          <Magnifier
            width="248px"
            height="248px"
            :picUrl="base64Pic || white_show"
          />
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
import { fabricInstanceMixin } from '../mixins'
import { getURLBlod, file2Content, getImgData, getUUID } from '@/utils'
//引入worker-loader
import Worker from './calcBetterProShow22.worker.js'
// import Worker from './calcBetterProShow_big1.worker.js'
// import Worker from './calcBetterProShow_bigbig2.worker.js'
import { initShowImageMapxy, calcShowImage } from './initcalc.js'
import {
  MAKER,
  DESIGN_SHOW_AREA_W,
  DESIGN_SHOW_AREA_H,
  DESIGN_PROPORTION,
  COMPRESS_MAX_LONG_STR
} from '@/utils/constant'
export default {
  mixins: [fabricInstanceMixin],
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
      klMaskImgs: []
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
    ...mapGetters(['previewShow']),

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

    klMasksData() {
      const tmpArr = []
      const klMaskImgs = []
      this.knifeData.map(({ kl_images }) => {
        kl_images.map((kl_image) => {
          const { type } = kl_image
          if (type == MAKER) {
            tmpArr.push(kl_image)
            klMaskImgs.push(getImgData(kl_image.img_url))
          }
        })
      })

      Promise.all(klMaskImgs).then((data) => {
        this.klMaskImgs = data
      })
      return tmpArr
    }
  },
  methods: {
    ...mapMutations(['UPDATE_PREVIEW_SHOW']),
    initCloneCanvas(num) {
      const tmpArr = []
      for (let i = 0; i < num; i++) {
        const f = new fabric.Canvas(getUUID() + '', {
          preserveObjectStacking: true,
          width: DESIGN_SHOW_AREA_W,
          height: DESIGN_SHOW_AREA_H
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

    async getComputedData(whiteShowArr, index) {
      whiteShowArr.map(async (white_show, sIndex) => {
        const computedData = {}
        computedData.white_show = white_show
        computedData.shadow_show = this.shadowShows[index][sIndex]
        computedData.show_image_mapxy = this.allShowImageMapxy[index][sIndex]
        computedData.data = []
        try {
          const pArr = this.klMasksData.map(async (klMasksItem, k) => {
            computedData.data[k] = {}
            const { left, top, width, height, img_url } = klMasksItem
            const kl_mask = {
              left,
              top,
              width,
              height,
              img_url
            }

            computedData.data[k].kl_mask = kl_mask
            computedData.data[k].klMaskImg = this.klMaskImgs[k]
            computedData.data[k].front_design = await new Promise(
              async (resolve) => {
                const fabricListItem = this.fabricList[k] || this.fabricList[0]
                const { realWidth, realHeight } = fabricListItem
                const json = fabricListItem.canvas.toJSON()
                this.cloneCanvas[k].loadFromJSON(json, () => {
                  const c = this.cloneCanvas[k]
                  c.overlayImage = null
                  const { t, l, w, h } = this.getClipPos({
                    cW: DESIGN_SHOW_AREA_W,
                    cH: DESIGN_SHOW_AREA_H,
                    rW: realWidth,
                    rH: realHeight
                  })

                  const wRadio = width / w
                  const hRadio = height / h

                  kl_mask.wRadio = wRadio
                  kl_mask.hRadio = hRadio

                  c.renderAll()
                  const data = c
                    .getContext('2d')
                    .getImageData(
                      parseInt(l),
                      parseInt(t),
                      parseInt(w),
                      parseInt(h)
                    )
                  data.cols = data.width
                  data.rows = data.height
                  resolve(data)
                })
              }
            )
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

          this.runWoker(index, sIndex, computedData)
          // this.getProShowBase64(white_show, index, sIndex)
        } catch (err) {
          console.log('err', err)
        }
      })
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

    //效果图数据加载完成后运行算法
    runCalc() {
      this.updateArrProShowByWhiteShows()
    },

    async initPrimShowImgs() {
      this.picWrapperLoading = true
      this.primShowImgs = []
      this.proShowData.map((curProShowData) => {
        if (!curProShowData) return {}
        const { prim_show_groups } = curProShowData
        const curPrimShowImgs =
          ((prim_show_groups && prim_show_groups[0]) || {}).prim_show_img || []

        curPrimShowImgs.map((item) => (item.structId = curProShowData.id))
        this.primShowImgs.push(curPrimShowImgs)
      })
      const pArr = [
        //初始化white_show图片
        this.initWhiteShows(this.primShowImgs),
        //初始化阴影图片
        this.initshadowShow(this.primShowImgs),
        //初始化json和json对应的图片
        this.initShowMarks(this.proShowData)
      ]
      await Promise.all(pArr)
      this.initAllShowImageMapxy()
      //数据加载完后运行算法
      this.runCalc()
      this.picWrapperLoading = false
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

    async initshadowShow(primShowImgs) {
      try {
        const shadowShows = []
        const pArr = primShowImgs.map((item, index) => {
          shadowShows[index] = []
          return item.map(async ({ shadow_show }, sIndex) => {
            const shadow = await getImgData(
              `${shadow_show}${COMPRESS_MAX_LONG_STR}`
            )
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
            const proShow = await getImgData(
              `${white_show}${COMPRESS_MAX_LONG_STR}`
            )
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
              return show_masks.map(async (showMask) => {
                const { map_json, mask } = showMask
                const root = await this.initJsonData(map_json)
                const show_mask = await getImgData(mask)
                allShowMarks[index][sIndex].push({
                  root,
                  show_mask
                })
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
