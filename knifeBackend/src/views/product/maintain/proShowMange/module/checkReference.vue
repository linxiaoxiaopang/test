<template>
  <div class="check-container app-container">
    <!-- tip -->
    <div class="page-title-tip">
      <i class="el-icon-delete"></i>
      {{ tipMsg }}
    </div>
    <!-- 参考图 -->
    <div class="reference-wrapper">
      <div class="title">校验参考图</div>
      <div class="content">
        <!-- <img class="image" :src="mainImage" alt="" /> -->
        <CheckProShowCanvas
          @updateTipMsg="updateTipMsg"
          ref="checkProShowCanvas"
          @changePartProShowPic="changePartProShowPic"
        />
      </div>
    </div>
    <!-- 校验图 -->
    <div class="check-wrapper">
      <div class="tools">
        <div class="left">
          <span
            class="button"
            :class="{ active: selectCheckIndex === index }"
            @click="selectCheck(index)"
            v-for="(item, index) in checkImage"
            >{{ item.size }}</span
          >
        </div>
        <div class="right" v-if="!hasNotMainImage && valid && checkImage[selectCheckIndex].status != 1">
          <el-button class="button" type="primary" @click="verify(1)">
            <i class="el-icon-check" v-show="checkImage[selectCheckIndex].is_right === 1"></i>
            通过
          </el-button>
          <el-button class="button" type="danger" @click="verify(0)">
            <i class="el-icon-close" v-show="checkImage[selectCheckIndex].is_right === 0"></i> 不通过
          </el-button>
        </div>
      </div>
      <div class="image-wapper">
        <div class="images" alt v-for="(item, index) in checkImage" v-show="selectCheckIndex === index">
          <el-image
            :preview-src-list="item.images"
            fit="contain"
            :src="image"
            class="image"
            alt
            v-for="(image, index) in item.images"
            :key="index"
          />
        </div>
      </div>
    </div>
    <!-- buttom -->
    <div class="buttom">
      <el-button @click="$router.go(-1)">返回</el-button>
      <el-button type="primary" @click="save" v-if="!hasNotMainImage && valid">保存</el-button>
    </div>
  </div>
</template>

<script>
import { RETURN_GOODS, MAKER } from '@/utils/constant'
import { initShowImageMapxy } from './initcalc.js'
import Worker from './calcBetterProShow22.worker.js'
import CheckProShowCanvas from './checkProShowCanvas.vue'

import { showDesignInfo, baseDetail, checkStructPass } from '@/api/product/checkProdApi'
import { getURLBlod, file2Content, getImgData, getUUID } from '@/utils'
const COMPRESS_MAX_LONG_STR = `?x-oss-process=image/resize,l_${1000},limit_0`

export default {
  components: {
    CheckProShowCanvas
  },
  data() {
    return {
      tipMsg: '以参考图为标准，核对效果图，如有问题请重新上传效果图',
      knifeData: [],
      proShowData: [],
      primShowImgs: [],
      klMaskImgs: [],
      whiteShows: [],
      shadowShows: [],
      allShowMarks: [],
      frontDesigns: [],
      workers: [],
      mainImage: 'http://osstest.zdwholesale.com/media/coord_kl/struct_143_coord_2cm.jpg',
      checkImage: [],
      selectCheckIndex: 0,
      hasNotMainImage: false
    }
  },

  async created() {
    await this.baseDetail()
    await this.initKlMaskImgs()
    await this.showDesignInfo()
  },
  computed: {
    klMasksData() {
      const tmpArr = []
      this.knifeData.map(({ kl_images }) => {
        kl_images.map((kl_image) => {
          const { type } = kl_image
          if (type == MAKER) {
            tmpArr.push(kl_image)
          }
        })
      })
      return tmpArr
    },
    valid() {
      try {
        if (!this.checkImage[this.selectCheckIndex].images) return
        else return this.checkImage[this.selectCheckIndex].images.length
      } catch (err) {}
    }
  },
  methods: {
    updateTipMsg(msg) {
      this.tipMsg = msg
      this.hasNotMainImage = true
    },

    changePartProShowPic({ info: groupInfo, count }) {
      this.frontDesigns = []
      if (Array.isArray(groupInfo)) {
        this.frontDesigns = groupInfo
      } else {
        this.frontDesigns.length = count
        this.frontDesigns.fill({})
        this.frontDesigns[groupInfo.order] = groupInfo
      }
      this.updateArrProShowByWhiteShows()
    },

    selectCheck(index) {
      this.selectCheckIndex = index
    },
    verify(isVerified) {
      this.checkImage[this.selectCheckIndex].is_right = isVerified
    },
    async save() {
      const data = {
        id: this.$route.query.protoId,
        struct: this.checkImage.map((item) => ({
          id: item.id,
          is_right: item.is_right
        }))
      }

      const { code } = await checkStructPass(data)
      if ($SUC({ code })) {
        this.$message.success('提交成功')
        this.$router.back()
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

    async baseDetail() {
      this.knifeData = []
      const { detail = [], code } = (await baseDetail(this.$route.query.id)) || {}
      if ($SUC({ code })) {
        this.knifeData = detail
      }
    },

    async showDesignInfo() {
      this.proShowData = []
      const { detail = [], code } = (await showDesignInfo({ id: this.$route.query.protoId })) || {}
      if ($SUC({ code })) {
        //筛选掉未上架的款式
        this.proShowData = detail

        this.checkImage = detail
          //order排序
          .sort((a, b) => a.order - b.order)
          .map((item) => {
            const {
              prim_show_groups: [{ prim_show_img }]
            } = item
            const obj = {}
            obj.id = item.id
            obj.size = item.structure
            obj.is_right = item.is_right
            obj.status = item.status
            obj.images = prim_show_img.map((show) => {
              return show.white_show
            })
            return obj
          })

        await this.initPrimShowImgs()
        //数据渲染完成 自动计算一次效果图
        this.$refs.checkProShowCanvas.initDocSrc()
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
      // const curData = this.getCurSwiperProShow(index, sIndex)
      // this.$set(curData, 'base64Pic', show_image)
      this.checkImage[index].images.splice(sIndex, 1, show_image)
    },

    getCurSwiperProShow(index, sIndex) {
      try {
        return this.primShowImgs[index][sIndex]
      } catch (err) {
        return null
      }
    },
    async getComputedData(whiteShowArr, index) {
      whiteShowArr.map(async (white_show, sIndex) => {
        const computedData = {}
        computedData.white_show = white_show
        computedData.shadow_show = this.shadowShows[index][sIndex]
        computedData.show_image_mapxy =
          this.allShowImageMapxy && this.allShowImageMapxy[index] && this.allShowImageMapxy[index][sIndex]
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
            computedData.data[k].front_design = await new Promise(async (resolve) => {
              let data = []
              try {
                data = await getImgData(this.frontDesigns[k].group_img)
              } catch (err) {
                data = {
                  width: 0,
                  height: 0,
                  data: []
                }
              }

              kl_mask.wRadio = 1
              kl_mask.hRadio = 1

              data.cols = data.width
              data.rows = data.height
              resolve(data)
            })
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
      let worker = this.workers[index][sIndex]
      worker.postMessage(cdata)
      worker.onmessage = (evt) => {
        worker.terminate()
        this.workers[index][sIndex] = null
        this.getProShowBase64(evt.data, index, sIndex)
      }
    },

    async initWhiteShows(primShowImgs) {
      try {
        const whiteShows = []
        const pArr = primShowImgs.map((item, index) => {
          whiteShows[index] = []
          return item.map(async ({ white_show }, sIndex) => {
            const { width, height } = await getImgData(white_show)
            // const proShow = await getImgData(`${white_show}${COMPRESS_MAX_LONG_STR}`)
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

    async initshadowShow(primShowImgs) {
      try {
        const shadowShows = []
        const pArr = primShowImgs.map((item, index) => {
          shadowShows[index] = []
          return item.map(async ({ shadow_show }, sIndex) => {
            // const shadow = await getImgData(`${shadow_show}${COMPRESS_MAX_LONG_STR}`)
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
        this.initShowMarks(this.proShowData)
      ]
      await Promise.all(pArr)
      this.initAllShowImageMapxy()
      //数据加载完后运行算法
      this.picWrapperLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.check-container {
  font-size: 16px;
  color: #595961;
  .reference-wrapper {
    width: 100%;
    min-height: 300px;
    border: 1px solid #dcdee0;
    padding: 18px 30px;
    .title {
      margin-top: -4px;
      text-align: center;
      margin-bottom: 14px;
    }
    .content {
      .image {
        width: 100%;
      }
    }
  }
  .check-wrapper {
    border: 1px solid #dcdee0;
    padding: 18px 30px;
    .tools {
      height: 44px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      .left {
        display: flex;
        align-items: center;
        .button {
          height: 32px;
          cursor: pointer;
          line-height: 32px;
          padding: 0 23px;
          border: 1px solid #dcdee0;
          border-radius: 2px;
          margin-right: 8px;
          &:last-child {
            margin-right: 0;
          }
        }
        .active {
          border: 1px solid #3841db;
        }
      }
      .right {
        display: flex;
        align-items: center;
        color: #3841db;
        font-size: 14px;
      }
    }
    .image-wapper {
      width: 100%;
      min-height: 300px;
      .images {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        .image {
          width: 350px;
          height: 350px;
          margin-right: 30px;
          margin-bottom: 30px;
        }
      }
    }
  }
  .buttom {
    padding-top: 30px;
    min-height: 30px;
    text-align: center;
  }
}
</style>
