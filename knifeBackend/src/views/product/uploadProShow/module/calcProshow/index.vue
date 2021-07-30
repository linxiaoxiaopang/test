<template>
  <div>
    <el-button
      type="primary"
      size="mini"
      v-if="isShowPro"
      @click="calcProshow"
      element-loading-text="效果图生成中"
      v-loading.fullscreen.lock="fullscreenLoading"
      >查看效果图</el-button
    >
    <el-image-viewer
      v-if="showViewer"
      :on-close="
        () => {
          showViewer = false
        }
      "
      :url-list="viewUrl"
    />
  </div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

import { MAKER } from '@/utils/constant'
import { initShowImageMapxy } from './initcalc.js'
import { getURLBlod, file2Content, getImgData, getTileCanvasImgData, getUUID } from '@/utils'
import Worker from './calcBetterProShow22.worker.js'

export default {
  components: { ElImageViewer },
  props: {
    knifeData: {
      type: Array,
      require: true
    },

    klMasksData: {
      type: Array,
      require: true
    },

    //coord_show 坐标图
    coordShow: {
      required: true
    },
    //white_show 坐标图
    whiteShow: {
      required: true
    },

    //shadow_show 效果图 材质图
    shadowShow: {
      required: true
    },

    //设计图
    frontDesign: {
      type: Array,
      required: true
    },

    //show_masks json数据
    showMasks: {
      required: true
    }
  },

  data() {
    return {
      klMaskImgs: [],
      viewUrl: [],
      showViewer: false,
      workers: [],
      //全局加载
      fullscreenLoading: false
    }
  },

  watch: {
    knifeData: {
      handler(newVal) {
        if (newVal && newVal.length) {
          this.initKlMaskImgs()
        }
      },
      immediate: true
    }
  },

  computed: {
    isShowPro({ coordShow, whiteShow, shadowShow, showMasks }) {
      return coordShow && whiteShow && shadowShow && showMasks && showMasks.length
    }
  },

  methods: {
    initShowImageMapxy(whiteShow, showMarks) {
      return initShowImageMapxy({
        showMarks,
        show_img: whiteShow
      })
    },

    async initKlMaskImgs() {
      const pArr = []
      this.knifeData.map(({ kl_images }) => {
        kl_images.map((kl_image) => {
          const { type } = kl_image
          if (type == MAKER) {
            pArr.push(getImgData(kl_image.img_url))
          }
        })
      })
      const data = await Promise.all(pArr)
      this.klMaskImgs = data
    },

    //存在多少张效果图，开几个线程。每个线程处理一张效果图
    initWorkers() {
      if (this.workers.length) return
      const workers = []
      for (let i = 0; i < this.frontDesign.length; i++) {
        const worker = new Worker()
        workers.push(worker)
      }

      this.workers = workers
    },

    //销毁其他线程
    destroyWorkers() {
      if (!this.workers.length) return
      this.workers.map((worker) => {
        worker.terminate()
      })
      this.workers = []
    },

    async calcProshow() {
      this.destroyWorkers()
      //线程开启
      this.$nextTick(() => {
        this.initWorkers()
        this.getComputedData()
      })
    },

    //获取计算后的base64图片
    getProShowBase64(showImages) {
      this.viewUrl = this.viewUrl.concat(showImages)
      this.proCount++
      console.log(' this.proCount', this.proCount)
      if (this.proCount < this.frontDesign.length) {
        return
      }

      this.fullscreenLoading = false
      this.$nextTick(() => {
        this.showViewer = true
      })
    },

    async getComputedData() {
      this.fullscreenLoading = true
      //效果图数量
      this.proCount = 0
      this.viewUrl = []
      try {
        //坐标图, 效果图，材质图, 设计图
        const { coordShow, whiteShow, shadowShow, frontDesign } = this
        const computedData = {}
        const wPArr = await frontDesign.map(async () => {
          return await getImgData(whiteShow)
        })
        computedData.white_shows = await Promise.all(wPArr)
        computedData.shadow_show = await getImgData(shadowShow)
        const showMarks = await this.initShowMarks()
        computedData.show_image_mapxy = this.initShowImageMapxy(computedData.white_shows[0], showMarks)
        computedData.allData = []
        const pArr = await frontDesign.map(async (frontDesignItem, frontDesignIndex) => {
          computedData.allData[frontDesignIndex] = []

          try {
            return await this.klMasksData.map(async (klMasksItem, k) => {
              computedData.allData[frontDesignIndex][k] = {}
              const { left, top, width, height, img_url } = klMasksItem
              const kl_mask = {
                left,
                top,
                width,
                height,
                img_url
              }
              computedData.allData[frontDesignIndex][k].kl_mask = kl_mask
              computedData.allData[frontDesignIndex][k].klMaskImg = this.klMaskImgs[k]
              computedData.allData[frontDesignIndex][k].front_design = await new Promise(async (resolve) => {
                let data = []
                try {
                  // data = await getImgData(frontDesignItem)
                  data = await getTileCanvasImgData(frontDesignItem, width, height)
                } catch (err) {
                  data = {
                    width: 0,
                    height: 0,
                    data: []
                  }
                }

                kl_mask.wRadio = width / data.width
                kl_mask.hRadio = height / data.height

                data.cols = data.width
                data.rows = data.height
                resolve(data)
              })
              return true
            })
          } catch (err) {
            console.log('err', err)
          }
        })
        const allParr = await Promise.all(pArr)
        const allParrData = []
        allParr.map((sp) => {
          sp.map(async (p) => allParrData.push(p))
        })

        await Promise.all(allParrData)

        // //运行worker
        computedData.allData.map((data, index) => {
          this.runWoker(
            {
              ...computedData,
              allData: [data]
            },
            index
          )
        })
        // this.getProShowBase64(white_show, index, sIndex)
      } catch (err) {
        this.fullscreenLoading = false
      }
    },
    //运行其他线程
    async runWoker(cdata, index) {
      try {
        let worker = this.workers[index]
        worker.postMessage(cdata)
        worker.onmessage = (evt) => {
          worker.terminate()
          this.getProShowBase64(evt.data)
        }
      } catch (err) {
        console.log(err)
        this.$message.error('生成效果图失败')
        this.fullscreenLoading = false
      }
    },

    async initJsonData(jsonSrc) {
      if (jsonSrc instanceof File) {
        const constent = await file2Content(jsonSrc)
        return JSON.parse(constent || '{}')
      }
      const json = await getURLBlod(jsonSrc)
      if (!json) return {}
      const constent = await file2Content(json)
      return JSON.parse(constent || '{}')
    },

    async initShowMarks() {
      const { showMasks } = this
      const pArr = await showMasks.map(async (showMask) => {
        const { map_json, mask } = showMask
        const root = await this.initJsonData(map_json)
        const show_mask = await getImgData(mask)
        return {
          root,
          show_mask
        }
      })
      return await Promise.all(pArr)
    }
  }
}
</script>

<style>
</style>