<template>
  <transition name="el-fade-in-linear">
    <div class="save-component-dailog" v-if="show" v-loading="loading">
      <div class="content-wrapper">
        <!-- <span class="back-btn" @click="toggleShow(false)"> 返回 </span> -->
        <div class="h-title">
          <span @click="toggleShow(false)">
            <i class="el-icon-d-arrow-left"></i>
            产品信息
          </span>
        </div>
        <el-alert
          v-if="!isShelf"
          style="height: 48px; padding: 0 10px"
          show-icon
          title="原型已下架，无法完成定制。"
          type="error"
        >
        </el-alert>
        <div class="title">产品效果图</div>
        <el-row :gutter="15" class="img-list">
          <el-col :key="index" :span="3" v-for="({ path }, index) in allProShowData">
            <AutoImg fit="contain" :preview-src-list="allProShowData.map(({ path }) => path)" :src="path"></AutoImg>
          </el-col>
        </el-row>

        <div class="title">产品SKU</div>
        <SkuList ref="skuList" :externalSkus="externalSkus" :skuDatas="skuDatas" />
        <div class="save-btn">
          <el-button size="small" @click="toggleShow(false)"> 返回 </el-button>
          <el-button size="small" type="primary" @click="relationSku" v-if="isShelf"> 创建产品 </el-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {
  getSKUInfo,
  relationRelationSku,
  create as createKlImgconf,
  getStructAndSizes,
  test
} from '@/api/product/knifeApi'
import SkuList from './module/skuList'
import formField from './field'
import { fabricInstanceMixin } from '../../mixins'
import {
  MAKER,
  DESIGN_AREA_W,
  DESIGN_SHOW_AREA_W,
  DESIGN_SHOW_AREA_H,
  INIT_GTOUP_INFO_FORM //平铺对象新增属性
} from '@/utils/constant'
import { mapGetters } from 'vuex'
import { createRandomNum, getUUID } from '@/utils'
import fa from 'element-ui/src/locale/lang/fa'

export default {
  mixins: [fabricInstanceMixin],
  components: {
    SkuList
  },
  props: {
    data: {
      type: Array,
      required: true
    },

    quickDesignData: {
      type: Array,
      required: true
    },

    sizeIds: {
      type: Array,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    },
    protoObj: {
      type: Object,
      required: true
    },
    previewData: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      formField,
      query: {},
      commonSku: '',
      show: this.visible,
      contentShow: false,
      loading: false,
      products: [],
      externalSkus: [],
      activeName: 'first',
      urlQuery: {},
      skuDatas: [],
      copyInstance: null,
      //原型是否上架
      isShelf: true
    }
  },
  watch: {
    show(newVal) {
      this.$emit('update:visible', newVal)
    },
    visible(newVal) {
      this.show = newVal
    }
  },

  computed: {
    ...mapGetters(['oneGroupDesignLayerPosData']),

    allProShowData() {
      let tmp = []
      this.previewData.map((list) => {
        if (!Array.isArray(list)) return []
        return list.map((item) => {
          let obj = {}
          obj.path = item.base64Pic || item.white_show
          tmp.push(obj)
        })
      })
      return tmp
    },
    //获取一键所有组的信息
    allQuickDesignGroups() {
      const tmpArr = []
      this.quickDesignData.map(({ base_kl_groups = [] }) => {
        base_kl_groups.map((g, index) => {
          tmpArr.push(g)
        })
      })
      return tmpArr
    },

    makerWidAndHei() {
      return (index) => {
        let tmpObj = {
          w: 0,
          h: 0
        }

        if (!this.isOneGroupDesign) {
          const klImages = this.data[index].kl_images
          klImages.map((img) => {
            if (MAKER == img.type) {
              const { width, height } = img || {}
              tmpObj = {
                w: width,
                h: height
              }
            }
          })
        } else {
          const {
            group: { kl_images: klImages }
          } = this.getModuleByGroupIndex(index)
          klImages.map((img) => {
            if (MAKER == img.type) {
              const { width, height } = img || {}
              tmpObj = {
                w: width,
                h: height
              }
            }
          })
        }

        return tmpObj
      }
    }
    // skuDatas() {
    //   let tmp = []
    //   try {
    //     this.products.map(({ spec_prods }) => {
    //       tmp = tmp.concat(spec_prods)
    //     })
    //   } catch (err) {
    //     return []
    //   }
    //   return tmp
    // }
  },

  created() {
    //获取尺码和款式
    this.getStructAndSizes()
  },
  methods: {
    initExternalSkus() {
      let tmp = []
      try {
        tmp = this.skuDatas.map((sku) => {
          const { id: sizeId, ...rest } = sku
          return {
            sizeId,
            ...rest
          }
        })
      } catch (err) {
        this.externalSkus = []
        return
      }
      this.externalSkus = tmp
    },

    //保存时候设置自定义sku
    createCostomSku() {
      const randStr = createRandomNum() + ''
      this.externalSkus
        .filter(({ externalSku }) => !externalSku)
        .map((item) => {
          const commonPrefix = randStr.slice(randStr.length - 4, randStr.length)
          this.$set(item, 'externalSku', `${commonPrefix}${item.structure}-${item.size_name}`)
        })
    },
    toggleShow(bool) {
      this.show = bool
      if (bool == false) {
        this.resetData()
      }
    },
    resetData() {
      this.contentShow = false
      this.query = {}
      this.products = []
      this.commonSku = ''
    },

    //获取尺码和款式
    async getStructAndSizes() {
      this.loading = true

      try {
        const { code, detail } = await getStructAndSizes(this.$route.query.protoId)
        if ($SUC({ code })) {
          const { sizes = [], struct = [] } = detail
          //获取尺码列表
          this.isShelf = !!sizes.length

          const tmp = []
          sizes.map((size) => {
            return struct.map(({ id, ...rest }) => {
              tmp.push({
                ...size,
                ...rest,
                structId: id
              })
            })
          })
          this.skuDatas = tmp

          this.initExternalSkus()
        }
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },

    async relationSku() {
      const { skuList } = this.$refs
      //保存时候创建自定义sku
      this.createCostomSku()
      if (skuList) {
        //创建自定义sku
        const valid = await skuList.validate()
        if (!valid) {
          return this.$message.warning('输入有误，请核查后再进行此操作！')
        }
      }
      this.loading = true
      const params = await this.save()
      params.externalSkus = this.externalSkus.map(({ sizeId, structId, externalSku }) => ({
        sizeId,
        structId,
        externalSku
      }))
      try {
        const {
          code,
          detail: { spec_prim_prod }
        } = await createKlImgconf(params)
        if (!$SUC({ code })) return
        const sussess = await this.getSKUInfo(spec_prim_prod)
        if (!sussess) {
          return (this.loading = false)
        }
        const externalSkus = []
        this.products.map(({ spec_prods }, index) => {
          spec_prods = Array.isArray(spec_prods) ? spec_prods : []
          spec_prods.map(({ id, custom_sku }) => {
            externalSkus.push({
              id,
              externalSku: custom_sku
            })
          })
          console.log('this.products[index]', this.products[index].spec_prods[0].SKU)
          // test({
          //   spec_prod: this.products[index].spec_prods[0].SKU
          // }).then(({ code }) => {
          //   if ($SUC({ code })) {
          //     this.$message.success('测试成功')
          //   }
          // })
        })
        const { code: rCode } = await relationRelationSku(externalSkus)
        if ($SUC({ code: rCode })) {
          this.$confirm('操作成功!', '提示', {
            confirmButtonText: '前往我的产品',
            cancelButtonText: '继续定制当前产品',
            type: 'success'
          })
            .then(() => {
              this.$router.replace('/product/private')
            })
            .catch(() => {
              //初始化外部sku对象
              this.initExternalSkus()
              this.$emit('hideSavePage', false)
            })
        }
      } catch (err) {}
      this.loading = false
    },

    async getSKUInfo(id) {
      try {
        const { code, detail } = await getSKUInfo({ id })
        if ($SUC({ code })) {
          const { products } = detail
          this.products = products
          return true
        }
      } catch (err) {}
      return false
    },

    getParamsId(instanceIndex) {
      if (this.isOneGroupDesign) {
        const {
          group: { id }
        } = this.getModuleByGroupIndex(instanceIndex)
        return id
      }
      if (this.data[instanceIndex]) {
        return this.data[instanceIndex].id
      }
    },

    //创建一个fabric实例
    createFabric() {
      if (this.copyInstance) {
        return this.copyInstance
      }
      this.copyInstance = new fabric.Canvas(getUUID() + '', {
        preserveObjectStacking: true,
        width: DESIGN_SHOW_AREA_W,
        height: DESIGN_SHOW_AREA_H
      })
      return this.copyInstance
    },

    //辅助平铺层
    copyCurLayerInfoToOther(curLayers, otherLayers) {
      const keys = Object.keys(INIT_GTOUP_INFO_FORM)
      curLayers.map((curLayer, index) => {
        const otherLayer = otherLayers[index]
        keys.map((key) => {
          if (curLayer[key] !== undefined) {
            otherLayer[key] = curLayer[key]
          }
        })
      })
    },

    createGroupToRotate(canvas, angle) {
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
      g.ungroupOnCanvas()
      canvas.remove(g)
    },

    async getParams() {
      let fabricList = this.isOneGroupDesign ? this.oneGroupDesignLayerPosData : this.fabricList
      const params = fabricList.map(async (instance, instanceIndex) => {
        let item = this.isOneGroupDesign ? this.getOnGroupDesiginInstanceByIndex(instanceIndex) : instance

        let angle = 0
        if (this.isOneGroupDesign) {
          angle =
            this.allQuickDesignGroups[instanceIndex] && this.allQuickDesignGroups[instanceIndex].quick_design_rotate
        } else {
          angle = (this.data[instanceIndex] && this.data[instanceIndex].show_rotate) || 0
        }

        if (angle) {
          const json = item.canvas.toJSON()
          const oObjects = item.canvas.getObjects()
          //旋转角度创建新的实例
          let copyItem = this.createFabric()
          await new Promise((resolve) => {
            copyItem.loadFromJSON(json, () => {
              const copyObjects = json.objects
              this.copyCurLayerInfoToOther(oObjects, copyObjects)
              this.createGroupToRotate(item, angle)
              resolve(true)
            })
          })
          copyItem.id = item.id
          copyItem = item
        }
        let objects = item.getObjects()
        let data = []
        let allObjects = []
        objects.map(async (obj, index) => {
          const isGroup = obj.type == 'group'
          if (isGroup) {
            const fObj = objects.find((o) => o.id === obj.id.replace('Group', ''))
            const { scaleX, scaleY } = fObj
            const os = obj.getObjects()

            os.map((oLayer, i) => {
              oLayer.id = obj.id.replace('Group', '')
              let { left: l2, top: t2, width: w2, height: h2 } = oLayer
              const { x, y } = oLayer.getCenterPoint()

              if (oLayer.group) {
                if (!oLayer.group.angle) {
                  let { x: gX, y: gY } = oLayer.group.getCenterPoint()
                  l2 = x + gX - (w2 * scaleX) / 2
                  t2 = y + gY - (h2 * scaleY) / 2
                } else {
                  const p = this.calcRealPosByGgroupObj(oLayer.group, oLayer)
                  const large = Math.sqrt(w2 * scaleX * (w2 * scaleX) + h2 * scaleY * (h2 * scaleY))
                  // l2 = p.x - (w2 * scaleX) / 2
                  // t2 = p.y - (h2 * scaleY) / 2
                  l2 = p.x - large / 2
                  t2 = p.y - large / 2
                }
              }

              let l, t, w, h
              if (this.isOneGroupDesign) {
                const obj = this.oneGroupDesignLayerPosData[instanceIndex]
                l = obj.l
                t = obj.t
                w = obj.w
                h = obj.h
              } else {
                const obj = this.getCalcPic({
                  w: this.makerWidAndHei(instanceIndex).w,
                  h: this.makerWidAndHei(instanceIndex).h
                })
                w = obj.w
                h = obj.h
                l = obj.dirW
                t = obj.dirH
              }

              const isIntersection = this.isIntersection({
                l,
                t,
                w,
                h,
                l2,
                t2,
                w2: w2 * scaleX,
                h2: h2 * scaleY
              })
              if (isIntersection) {
                oLayer.angle = obj.angle
                allObjects.push(oLayer)
              }
              // allObjects.push(oLayer)
            })
            return
          } else {
            allObjects.push(obj)
          }
        })
        data = allObjects.map(async (obj) => {
          return await this.conversionLayerObject(obj, instanceIndex)
        })
        let dataRes = await Promise.all(data)
        //获取唯一的列表数据
        dataRes = this.getUniqueData(dataRes)
        console.log('dataRes', dataRes)

        return {
          id: this.getParamsId(instanceIndex),
          data: dataRes,
          background: this.instance.canvas.backgroundColor
        }
      })
      return params
    },

    getUniqueData(data) {
      const tmpArr = []
      data.map((item) => {
        if (!tmpArr.length) {
          return tmpArr.push(item)
        }
        const fItem = tmpArr.find((tItem) => {
          for (let key in item) {
            if (tItem[key] != item[key]) {
              return true
            }
          }
          return false
        })
        if (fItem) {
          tmpArr.push(item)
        }
      })
      return tmpArr
    },

    async save() {
      if (!this.instance) return
      this.loading = true
      const originPics = []
      const queryForm = this.query
      try {
        const fabricList = this.fabricList
        const params = await this.getParams()
        fabricList.map((instance) => {
          const objects = instance.getObjects()
          objects.map((obj) => {
            if (obj.type === 'group') return
            const { id } = obj
            if (id) {
              originPics.push(id.split('@_')[1])
            }
          })
        })
        // const params = fabricList.map(async (instance, instanceIndex) => {
        //   const objects = instance.getObjects()
        //   console.log('objects', objects)
        //   const data = objects.map(async (obj) => {
        //     const { id } = obj
        //     if (id) {
        //       originPics.push(id.split('@_')[1])
        //     }
        //     return await this.conversionLayerObject(obj, instanceIndex)
        //   })
        //   const dataRes = await Promise.all(data)
        //   return {
        //     id: instance.id.replace('canvas', ''),
        //     data: dataRes,
        //     background: this.instance.canvas.backgroundColor
        //   }
        // })
        const paramsRes = await Promise.all(params)
        const proshowData = this.getProshowData()
        return {
          ...queryForm,
          proshowData,
          normalIds: this.sizeIds,
          sizeId: this.$route.query.id,
          protoId: this.$route.query.protoId,
          structIds: this.protoObj.prim_struct.map(({ id }) => id),
          data: paramsRes,
          originPics: [...new Set(originPics)],
          productId: createRandomNum()
        }

        // const { code, detail } = await createKlImgconf({
        //   ...queryForm,
        //   proshowData,
        //   normalIds: this.sizeIds,
        //   sizeId: this.$route.query.id,
        //   protoId: this.$route.query.protoId,
        //   structIds: this.protoObj.prim_struct.map(({ id }) => id),
        //   data: paramsRes,
        //   originPics: [...new Set(originPics)],
        //   productId: createRandomNum()
        // })

        // if (!$SUC({ code })) {
        //   this.loading = false
        //   this.$message.success('产品创建成功失败')
        // }
        // this.$message.success('产品创建成功')
        // this.loading = false
        // this.getSKUInfo(detail.spec_prim_prod)
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    getProshowData() {
      const tmp = []
      this.previewData.map((list) => {
        list.map(({ id, base64Pic, white_show, structId }) => {
          tmp.push({ id, structId, path: base64Pic || white_show })
        })
      })
      return tmp
    },

    async conversionLayerObject(layerObj, instanceIndex) {
      const isTypeItext = layerObj.type == 'i-text'
      let imgSrc = undefined
      if (isTypeItext) {
        imgSrc = await new Promise((resolve) => {
          layerObj.cloneAsImage((o) => {
            const src = o.getSrc()
            resolve(src)
          })
        })
      }
      const {
        x,
        y,
        oRadio = 1,
        scaleX: cScaleX,
        scaleY: cScaleY
      } = this.getCoordinatesDirCenter(layerObj, instanceIndex)
      let { scaleX, scaleY, id, flipX, flipY, width: picWidth, height: picHeight } = layerObj

      scaleX *= cScaleX
      scaleY *= cScaleY
      const makerWidAndHei = this.makerWidAndHei(instanceIndex)

      let knifeMarkerSize = makerWidAndHei.w >= makerWidAndHei.h ? makerWidAndHei.w : makerWidAndHei.h
      const proportion = knifeMarkerSize / DESIGN_AREA_W
      let computedX = (x * proportion) / oRadio
      let computedY = (y * proportion) / oRadio
      let computedScaleX = scaleX * proportion
      let computedScaleY = scaleY * proportion
      let imgId = id.split('_')[1] || id
      const { height, width } = this.getOriginPicSize(layerObj)
      if (height && width) {
        let originProportion = Math.max(picHeight, picWidth) / Math.max(height, width)
        computedScaleX *= originProportion
        computedScaleY *= originProportion
      }
      if (isTypeItext) {
        return {
          imgSrc,
          scaleX,
          scaleY,
          img_id: imgId,
          rotation: layerObj.angle,
          offset_x: computedX,
          offset_y: computedY
        }
      }
      return {
        img_id: imgId,
        rotation: -layerObj.angle,
        offset_x: computedX,
        offset_y: computedY,
        scaleX: computedScaleX,
        scaleY: computedScaleY,
        flipX: !!flipX,
        flipY: !!flipY
        // src: src
      }
    },

    //更改坐标原点未画布中心点
    getCoordinatesDirCenter(layerObj, instanceIndex) {
      const { max } = Math
      let canvas = null

      if (!this.isOneGroupDesign) {
        canvas = this.fabricList[instanceIndex].canvas
      } else {
        canvas = this.getOnGroupDesiginInstanceByIndex(instanceIndex).canvas
      }

      const { left: cL, top: cT } = canvas.getCenter()
      let { x, y } = layerObj.getCenterPoint()
      let scaleX = 1
      let scaleY = 1
      let oRadio = 1
      if (layerObj.group) {
        let { x: gX, y: gY } = layerObj.group.getCenterPoint()
        x += gX
        y += gY
        if (layerObj.group.angle) {
          const p = this.calcRealPosByGgroupObj(layerObj.group, layerObj)
          // x = p.x + (layerObj.width * layerObj.scaleX) / 2
          // y = p.y + (layerObj.height * layerObj.scaleY) / 2
          x = p.x
          y = p.y
        }
      }
      if (this.isOneGroupDesign) {
        // const { kl_image_height: dH, kl_image_width: dW } =
        //   this.psdDocumentInfo || {}
        const {
          module: { width: dW, height: dH }
        } = this.getModuleByGroupIndex(instanceIndex)

        const { l, t, w, h, scaleX: iScaleX, scaleY: iScaleY, pW, pH } = this.oneGroupDesignLayerPosData[instanceIndex]
        oRadio = max(w, h) / DESIGN_AREA_W
        const scale = max(pW, pH) / max(dW, dH)
        const moveL = cL - (l + w / 2)
        const moveT = cT - (t + h / 2)
        y = y + moveT
        x = x + moveL
        scaleX = scaleX / scale
        scaleY = scaleY / scale
      }
      return { x: x - cL, y: y - cT, scaleX, scaleY, oRadio }
    },

    //获取原图的宽高
    getOriginPicSize({ id = '' }) {
      const width = id.split('@')[1]
      const height = id.split('@')[2]
      return {
        width,
        height
      }
    },

    //判断图片和marker是否相交
    isIntersection({ l, l2, t, t2, w, w2, h, h2 }) {
      if (
        Math.abs(l2 + w2 - (w + l)) + Math.abs(l2 - l) < w + w2 &&
        Math.abs(t2 + h2 - (h + t)) + Math.abs(t2 - t) < h + h2
      ) {
        return true
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.save-component-dailog {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  padding: 40px 200px;
  width: 100vw;
  height: 100vh;
  background: #fff;
  z-index: 2000;
  box-shadow: 0px 3px 10px 0px rgba(47, 72, 124, 0.14);
  overflow: auto;
  // border-radius: 8px;
  .content-wrapper {
    margin: 0 auto;
    width: 1200px;
  }
  .h-title {
    cursor: pointer;
    font-size: 16px;
    position: relative;
    left: -10px;
    margin-bottom: 15px;
  }
  .back-btn {
    position: absolute;
    top: 10px;
    right: 1rem;
    font-size: 25px;
    z-index: 1;
    color: $color-gray;
    cursor: pointer;
  }
  .title {
    margin: 10px 0;
    font-size: 14px;
    border-left: solid 2px $color-primary;
    padding-left: 10px;
  }
  .save-btn {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    // margin-left: 50%;
    // transform: translateX(-50%);
    // margin-top: 15px;
    // height: 40px;
    // width: 150px;
  }
}
</style>
