<template>
  <div class="designContainerHeader">
    <div class="h-l">
      <!--<i class="el-icon-back" @click="back" style="font-size: 32px" />-->
      <el-button
        class="back-btn"
        type="text"
        icon="el-icon-d-arrow-left"
        @click="back"
        >返回</el-button
      >
      <!-- <el-image :src="require('@/assets/design/ic_reset.png')" @click="$router.back()" /> -->
    </div>
    <div class="h-m">
      <template v-if="isShowToggleDesignBtn">
        <span
          :class="['design', isOneGroupDesign && 'active']"
          @click="designByType(ONG_GROUP_DESIGN)"
        >
          <i class="iconfont icon-quick-design"></i>
          快速设计
        </span>

        <span
          :class="['design', !isOneGroupDesign && 'active']"
          @click="designByType(GROUP_LIST_DESIGN)"
        >
          <i class="iconfont icon-professional-design"></i>

          专业设计
        </span>
      </template>
    </div>
    <div class="h-r">
      <span @click="handleClicked">
        <i class="el-icon-tickets opacity"></i>
        <span class="opacity">设计说明</span>
      </span>
    </div>
    <BaseDialog
      :dialogVisible.sync="showDialog"
      width="844px"
      class="base"
      title="设计说明"
    >
      <div class="dialog-warpper">
        <div class="title">图片建议</div>
        <div class="information">
          支持上传20M以下png/jpg格式的本地图片，上传图片或文字时不得存在涉政、涉黄、侵权等违法行为，情节严重的将予以封号处理，感谢您的配合！
        </div>
        <div class="title">操作要求</div>
        <div class="image-group-warpper">
          <div class="left-warpper">
            <el-image :src="require('../module/images/left.jpg')"></el-image>
            <div class="case">情况一：</div>
            <div class="case-information">
              请确保你的文字或重要的元素放置在安全区域内。
            </div>
          </div>
          <div class="right-warpper">
            <el-image :src="require('../module/images/right.jpg')"></el-image>
            <div class="case">情况二：</div>
            <div class="case-information">
              请务必将你的图片覆盖到实线，以避免在缝制过程中出现白边。
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span></span>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import {
  MAKER,
  SECURITY,
  DESIGN_AREA_W,
  INIT_GTOUP_INFO_FORM,
  ONG_GROUP_DESIGN, //一键定制
  GROUP_LIST_DESIGN //分块定制
} from '@/utils/constant'

import { fabricInstanceMixin } from '../mixins'
export default {
  mixins: [fabricInstanceMixin],
  props: {
    data: {
      type: Array,
      required: true
    },
    quickDesignData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      ONG_GROUP_DESIGN,
      GROUP_LIST_DESIGN,
      showDialog: false
    }
  },
  computed: {
    //是否隐藏切换设计模式按钮
    isShowToggleDesignBtn() {
      return !!this.quickDesignData.length
    }
  },
  methods: {
    back() {
      // this.$router.replace("/design/index");
      this.$router.back()
    },

    designByType(type) {
      if (
        (this.isOneGroupDesign && type === ONG_GROUP_DESIGN) ||
        (!this.isOneGroupDesign && type === GROUP_LIST_DESIGN)
      ) {
        return
      }
      let transformData = []
      let tmpArr = []
      if (type === ONG_GROUP_DESIGN) {
        this.$confirm(
          '确定要切换设计模式吗?此操作会导致设计数据丢失。',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            this.UPDATE_ONE_GROUP_TRANSFORM_LIST_DATA(tmpArr)
            this.UPDATE_DESIGN_TYPE(type)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      } else {
        this.$confirm('确定要切换设计模式吗?。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const data = this.oneGroupDesignLayerPosData
            transformData = data.map((item, instanceIndex) => {
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

              json.objects = json.objects
              // json.objects = json.objects.filter(({type}) => type !== 'group')
              const objects = json.objects
              console.log('scaleX, scaleY', scaleX, scaleY)
              const iObjects = canvas.getObjects()
              // const iObjects = canvas.getObjects().filter(({type}) => type !== 'group')
              console.log('objects', objects)
              console.log('iObjects', iObjects)
          
              // objects.map((layer, index) => {
              //   let { x, y } = iObjects[index].getCenterPoint()
              //   const dirMoveL =
              //     (1 / oRadio) * moveL + (x - cL) * (1 / oRadio - 1)
              //   const dirMoveT =
              //     (1 / oRadio) * moveT + (y - cT) * (1 / oRadio - 1)

              //   layer.scaleX = iObjects[index].scaleX * scaleX
              //   layer.scaleY = iObjects[index].scaleY * scaleY
              //   layer.left = iObjects[index].left + dirMoveL
              //   layer.top = iObjects[index].top + dirMoveT
              //   layer.id = iObjects[index].id
              // })

              for(let i = objects.length; i--; i>=0 ) {
         
                  const layer = objects[i]
                  const index = i

                  
                  if (layer.type === 'group') {
                    if (!objects[index + 1]) return
                    const { scaleX:lScaleX, scaleY: lScaleY, left, top } = objects[index + 1]
                    let { x, y } = iObjects[index + 1].getCenterPoint()
                    const dirMoveL =
                      (1 / oRadio) * moveL + (x - cL) * (1 / oRadio - 1)
                    const dirMoveT =
                      (1 / oRadio) * moveT + (y - cT) * (1 / oRadio - 1)
                    layer.id = `${objects[index + 1].id}Group`

                       layer.left = layer.left+dirMoveL
                      layer.top = layer.top+dirMoveT

                    const gs = layer.objects
                    gs.map((g) => {
                      g.scaleX = lScaleX
                      g.scaleY = lScaleY
                      g.top = (g.top * scaleX ) 
                      g.left =  (g.left  * scaleY)
                      
                      // console.log('ggggggg', g)
                    })
                    console.log('gs', gs.length)
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
        

              this.formatObjectsData(iObjects, objects)
              return json
            })

            let groupArr = []
            this.quickDesignData.map(({ base_kl_groups }) => {
              groupArr = groupArr.concat(base_kl_groups)
            })
            this.data.map((item) => {
              const fIndex = groupArr.findIndex((fItem) => fItem.id === item.id)
              tmpArr.push(transformData[fIndex])
            })

            this.UPDATE_ONE_GROUP_TRANSFORM_LIST_DATA(tmpArr)
            this.UPDATE_DESIGN_TYPE(type)
          })
          .catch((err) => {
            console.log('err', err)
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      }
    },

    getTransformation(instanceIndex) {
      let canvas = null
      if (!this.isOneGroupDesign) {
        canvas = this.fabricList[instanceIndex].canvas
      } else {
        canvas = this.getOnGroupDesiginInstanceByIndex(instanceIndex).canvas
      }

      const { left: cL, top: cT } = canvas.getCenter()
      const { max } = Math
      console.log('cL', cL)
      console.log('cT', cT)
      const {
        module: { width: dW, height: dH }
      } = this.getModuleByGroupIndex(instanceIndex)
      console.log('dW', dW)
      console.log('dH', dH)
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

    async cloneByIndex(sourceJson, index) {
      const cJson = this.fabricList[index].canvas.toJSON()
      sourceJson.overlayImage = cJson.overlayImage
      const success = await new Promise((resolve) => {
        this.fabricList[index].canvas.loadFromJSON(sourceJson, (c) => {
          this.fabricList[index].canvas.renderAll()
          this.$nextTick(() => {
            this.canvasModifiedHandler()
          })
          const iObjects = this.instance.getObjects()
          const objects = this.fabricList[index].getObjects()
          // const { scaleX: tX, scaleY: tY } = this.getScale(index)
          const scale = this.getScale(index)
          iObjects.map(({ id, scaleX, scaleY }, index) => {
            objects[index].id = id
            objects[index].setOptions({
              scaleX: scaleX * scale,
              scaleY: scaleY * scale
            })
          })
          this.fabricList[index].canvas.renderAll()
          this.formatObjectsData(iObjects, objects)
          // this.$message.success('复制成功')
          resolve(true)
        })
      })
      return success
    },

    formatObjectsData(source, assign) {
      source.map((o, index) => {
        if (o.groupType !== undefined) {
          const keys = Object.keys(INIT_GTOUP_INFO_FORM)
          keys.forEach((key) => {
            assign[index][key] = o[key]
          })
        }
      })
    },
    handleClicked() {
      this.showDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
.opacity {
  opacity: 0.41;
  font-size: 14px !important;
  vertical-align: top;
}
.dialog-warpper {
  padding: 27px 0 0 44px;
  .title {
    color: #333;
  }
  .information {
    margin: 22px 0 52px 0;
    color: #636c78;
    line-height: 25px;
  }
  .image-group-warpper {
    margin-top: 46px;
    display: flex;
    .left-warpper,
    .right-warpper {
      .case,
      .case-information {
        color: #636c78;
      }
      .case {
        margin: 23px 0 10px 0;
      }
      .el-image {
        width: 213px;
        height: 81px;
      }
    }
    .right-warpper {
      margin-left: 178px;
    }
  }
}
.designContainerHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 1600px;
  height: 56px;
  background: #171e95;
  padding: 0 60px;
  .back-btn {
    font-size: 16px;
    color: #fff;
  }
  .h-m {
    .design {
      cursor: pointer;
      color: #8e90c2;
    }
    .design:first-child {
      margin-right: 20px;
    }
    .design.active {
      color: #fff;
    }
  }
  .h-r {
    i {
      position: relative;
      top: 2px;
      font-size: 18px;
      margin-right: 3px;
    }
    span {
      color: #fff;
      font-size: 12px;
      margin-right: 10px;
      cursor: pointer;
    }
  }
}
</style>
