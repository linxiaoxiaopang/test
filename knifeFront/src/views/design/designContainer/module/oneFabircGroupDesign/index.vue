<template>
  <div class="fabricListComponent">
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
          @canvasLoadend="canvasLoadend"
          ref="fabricByGroup"
          :groupIndex="index"
          :info="item"
          :id="canvasId(item)"
        />
      </el-carousel-item>
    </el-carousel>

    <div class="tip" v-if="tipMsg">{{ tipMsg }}</div>
  </div>
</template>

<script>
import FabricByGroup from './oneFabricByGroup'
import { mapMutations } from 'vuex'
import { DESIGN_AREA_W, DESIGN_AREA_H } from '@/utils/constant'
import { createRandomNum } from '@/utils'

import { fabricInstanceMixin } from '../../mixins'

export default {
  inject: ['canvasModifiedHandler', 'prodShowSwiperRunCalc'],
  mixins: [fabricInstanceMixin],
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
      showFabricByGroup: false,
      tipMsg: '',
      loadNum: 0
    }
  },
  watch: {
    groupIndex: {
      handler(newVal) {
        this.$refs.carousel.setActiveItem(newVal)
        this.SET_CUR_FABRIC_INDEX(newVal)
      }
    },

    curFabricObjects() {
      const obj = this.instance.getActiveObject()
      if (!obj) {
        this.tipMsg = ''
        return
      }
      const info = this.data[this.curFabricIndex]

      const { id, scaleX, scaleY, width, height } = obj
      const [oRand, oWidth, oHeight, oId] = obj.id.split('@')
      const { width: mW, height: mH } = info
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

    '$route.query.id': {
      async handler() {
        this.$nextTick(() => {
          const tmpArr = []
          const { fabricByGroup } = this.$refs
          for (let i = 0; i < fabricByGroup.length; i++) {
            const item = fabricByGroup[i]
            tmpArr.push(item.canvas)
          }
          this.SET_FABRIC_LIST(tmpArr)

          let num = 0
          this.data.map(({ base_kl_groups }) => {
            base_kl_groups.map(() => {
              num++
            })
          })

          this.$emit('fabircListUpdate', num)
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

    //画布id
    canvasId() {
      return (item) => {
        return `canvas_module_${item && item.id}`
      }
    }
  },

  methods: {
    ...mapMutations(['SET_CUR_FABRIC_INDEX', 'SET_FABRIC_LIST', 'UPDATE_FABRIC_LIST']),

    //画布加载完成触发事件
    canvasLoadend() {
      this.loadNum++
      if (this.loadNum === this.data.length) {
        //画布全部加载完成触发事件
        this.prodShowSwiperRunCalc()
        this.loadNum = 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fabricListComponent {
  box-shadow: 0px 3px 10px 0px rgba(47, 72, 124, 0.14);
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
.copy-all {
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
    font-size: 12px;
    text-align: center;
    @include overflow;
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
