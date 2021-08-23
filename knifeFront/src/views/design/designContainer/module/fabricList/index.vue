<template>
  <div class="fabricListComponent">
    <el-dropdown trigger="click" @command="handleCommand" class="clone">
      <div
        class="clone-btn"
        style="width: 150px; padding: 10px 5px; cursor: pointer"
        size="mini"
        plain
      >
        <i class="iconfont icon-copy-canvas"></i>
        复制画布
      </div>
      <el-dropdown-menu class="fabric-list-dropdown-menu" slot="dropdown" placement="top-end">
        <el-dropdown-item command="all" :key="ALL_LAYER_CLONE">
          <div class="fabric-list-copy-all">
            <el-button type="text" size="mini">复制到全部图层</el-button>
          </div>
        </el-dropdown-item>
        <el-dropdown-item
          :command="index"
          v-for="({ img_url, text, groupName }, index) in klImages"
          :key="index"
          :disabled="index === curFabricIndex"
        >
          <div
            :class="['fabric-list-wrapper-swipper-img-wrapper', index === curFabricIndex && 'disabled']"
          >
            <el-image style="width: 60px; height: 40px" :key="index" :src="img_url" fit="contain"></el-image>
            <div class="content">
              <div class="name">{{ groupName || text }}</div>
              <div class="page-num">
                <span>{{ index + 1 }}</span>
                <span>/</span>
                <span>{{ klImages.length }}</span>
              </div>
            </div>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-carousel
      :autoplay="false"
      :loop="false"
      arrow="never"
      direction="vertical"
      height="700px"
      indicator-position="none"
      ref="carousel"
    >
      <el-carousel-item v-for="(item, index) in data" :key="index">
        <FabricByGroup
          ref="fabricByGroup"
          :groupIndex="index"
          :data="item"
          :id="`canvas${item.id}`"
        />
      </el-carousel-item>
    </el-carousel>
    <!-- <div class="tip">放大倍数超过1.5倍</div> -->
    <div class="tip" v-if="tipMsg">{{ tipMsg }}</div>
  </div>
</template>

<script>
import FabricByGroup from './fabricByGroup'
import { mapMutations } from 'vuex'
import { MAKER, SECURITY, INIT_GTOUP_INFO_FORM } from '@/utils/constant'
import { fabricInstanceMixin, copyLayerTileMixin } from '../../mixins'

import { DESIGN_AREA_W, DESIGN_AREA_H } from '@/utils/constant'

const ALL_LAYER_CLONE = 'all'

export default {
  inject: ['canvasModifiedHandler'],
  mixins: [fabricInstanceMixin, copyLayerTileMixin],
  components: {
    FabricByGroup
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    groupIndex: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      ALL_LAYER_CLONE,
      tipMsg: '',
    }
  },
  watch: {
    curFabricObjects() {
      const obj = this.instance.getActiveObject()
      if (!obj) {
        this.tipMsg = ''
        return
      }
      const { id, scaleX, scaleY, width, height } = obj
      const [oRand, oWidth, oHeight, oId] = obj.id.split('@')
      const { width: mW, height: mH } = this.klMarks[this.curFabricIndex]
      const knifeMarkerSize = Math.max(mW, mH)
      const picWdidth = oWidth * (DESIGN_AREA_W / knifeMarkerSize)
      const picHeight = oHeight * (DESIGN_AREA_H / knifeMarkerSize)
      const oScaleX = picWdidth / width
      const oScaleY = picHeight / height

      if (scaleX > 1.5 * oScaleX || scaleY > 1.5 * oScaleY) {
        this.tipMsg = '当前选中图层缩放比例已经超过1.5，严重影响印刷清晰度。'
      } else {
        this.tipMsg = ''
      }
    },
    groupIndex: {
      handler(newVal) {
        this.$refs.carousel.setActiveItem(newVal)
        this.SET_CUR_FABRIC_INDEX(newVal)
      }
    },
    '$route.query.id': {
      handler() {
        this.$nextTick(() => {
          const tmpArr = []
          const { fabricByGroup } = this.$refs
          for (let i = 0; i < fabricByGroup.length; i++) {
            const item = fabricByGroup[i]
            tmpArr.push(item.canvas)
          }
          this.SET_FABRIC_LIST(tmpArr)
          this.$emit('fabircListUpdate', tmpArr.length)
          this.$refs.carousel.setActiveItem(0)
          this.SET_CUR_FABRIC_INDEX(0)
        })
      },
      immediate: true
    }
  },
  computed: {
    curFabricObjects({ fabricObjects, curFabricIndex }) {
      return fabricObjects[curFabricIndex]
    },
    klMarks() {
      let tmpArr = []
      this.data.map(({ kl_images = [], kl_texts }) => {
        kl_images.map((img) => {
          if (MAKER == img.type) {
            return tmpArr.push(img)
          }
        })
      })
      return tmpArr
    },

    klImages() {
      let tmpArr = []
      this.data.map(({ kl_images = [], kl_texts, name }) => {
        kl_images.map((img) => {
          if (SECURITY == img.type) {
            return tmpArr.push(
              Object.assign(
                {},
                img,
                {
                  text: (kl_texts[0] && kl_texts[0].value) || ''
                },
                {
                  groupName: name
                }
              )
            )
          }
        })
      })
      return tmpArr
    },
    makerId() {
      return (group) => {
        let id = undefined
        const { kl_images: klImages } = group || {}
        klImages.map(({ id: klId, type }) => {
          if (type === MAKER) {
            id = klId
          }
        })
        return id
      }
    }
  },
  methods: {
    ...mapMutations(['SET_CUR_FABRIC_INDEX', 'SET_FABRIC_LIST', 'UPDATE_FABRIC_LIST']),

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

    getScale(index) {
      const { width: iW, height: iH } = this.klMarks[this.curFabricIndex]
      const { width: w, height: h } = this.klMarks[index]
      console.log(iW, iH)
      console.log(w, iH)
      const scale = Math.max(iW, iH) / Math.max(w, h)
      return scale
      // return {
      //   scaleX: iW / w,
      //   scaleY: iH / h
      // }
    },

    async cloneByIndex(sourceJson, index) {
      const cJson = this.fabricList[index].canvas.toJSON()
      sourceJson.overlayImage = cJson.overlayImage

      sourceJson.objects = sourceJson.objects.filter(o => o.type !== 'group')

      const success = await new Promise((resolve) => {
        this.fabricList[index].canvas.loadFromJSON(sourceJson, (c) => {
          this.fabricList[index].canvas.renderAll()
          this.$nextTick(() => {
            
            this.canvasModifiedHandler()
          })
          const iObjects = this.instance.getObjects().filter(o => o.type !== 'group')
          const objects = this.fabricList[index].getObjects()
          // const { scaleX: tX, scaleY: tY } = this.getScale(index)
          const scale = this.getScale(index)
          iObjects.map(({ id, scaleX, scaleY }, index) => {
            objects[index].id = id
            objects[index].setOptions({
              scaleX: scaleX * scale,
              scaleY: scaleY * scale
            })
            if (objects[index].type === 'group') {
              //复制图层scaleX和scaleY的精度不同
              if (iObjects[index + 1] && iObjects[index] && iObjects[index].id.indexOf(iObjects[index + 1].id) >= 0) {
                const { scaleX, scaleY } = iObjects[index + 1]
                const gS = objects[index].getObjects()
                gS.map((g) => {
                  g.setOptions({
                    scaleX,
                    scaleY
                  })
                })
              }
            }
          })
          this.fabricList[index].canvas.renderAll()
          this.formatObjectsData(iObjects, objects)
          objects.map(item => {
            if(item.groupType !== undefined) {
              const instance = this.fabricList[index]
               this.baseTile(item.groupType, item, instance)
            }
          })
         
          // this.$message.success('复制成功')
          resolve(true)
        })
      })
      return success
    },

    async handleCommand(index) {
      const json = this.instance.canvas.toJSON()

      if (index == ALL_LAYER_CLONE) {
        const pArr = this.fabricList.map((c, index) => {
          if (index !== this.curFabricIndex) {
            return this.cloneByIndex(json, index)
          }
        })
        await Promise.all(pArr)
        return this.$message.success('复制成功')
      }
      const success = await this.cloneByIndex(json, index)
      if (success) {
        this.$message.success('复制成功')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fabricListComponent {
  box-shadow: 0px 3px 10px 0px rgba(47, 72, 124, 0.14);

   padding: 0;
    box-sizing: border-box;
    /* border: dashed 1px #74c0fc; */
   
    background-image: linear-gradient(
45deg
, rgba(0, 0, 0, 0.15) 25%, transparent 0, transparent 75%, rgba(0, 0, 0, 0.15) 0), linear-gradient(
45deg
, rgba(0, 0, 0, 0.15) 25%, transparent 0, transparent 75%, rgba(0, 0, 0, 0.15) 0);
    background-position: 0 0,15px 15px;
    background-size: 32px 32px;
    position: relative;
  .el-carousel__item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 700px;
    width: 700px;
  }
  .clone {
    top: 0;
    position: absolute;
    z-index: 100;
  }
  .tip {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -10px;
    z-index: 1000;
    background: $color-danger;
    color: #fff;
    white-space: nowrap;
    padding: 5px;
    border-radius: 4px;
    padding: 5px 15px;
  }
}
</style>
<style lang="scss">
.fabric-list-dropdown-menu {
  max-height: 300px;
  overflow: auto;
}
.fabric-list-copy-all {
  width: 100%;
  text-align: center;
}
.fabric-list-wrapper-swipper-img-wrapper.fabric-list-wrapper-swipper-img-wrapper {
  padding: 10px 10px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  .el-image {
    width: 100%;
    height: 46px;
  }
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    line-height: 1.2;
  }
  .name {
    width: 60px;
    text-align: left;
    font-size: 12px;
    text-align: center;
    @include overflow;
    margin-bottom: 8px;
  }
  .page-num {
    font-size: 12px;
    color: $color-danger;
  }
}
.fabric-list-wrapper-swipper-img-wrapper.disabled {
  opacity: 0.5;
}
</style>
