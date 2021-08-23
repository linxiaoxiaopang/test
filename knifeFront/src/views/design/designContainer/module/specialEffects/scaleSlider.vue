<template>
  <div class="scroll-slider-component">
    <BaseDesign v-on="$listeners" contentHeight="auto">
      <template #title>缩放</template>
      <template #content>
        <div class="slider-wrapper">
          <el-slider
            ref="slider"
            size="mini"
            v-model="value"
            :min="0"
            :max="2"
            :marks="marks"
            :step="0.01"
            :show-input-controls="false"
            @input="changeHandler"
            @mouseup.native="render"
          >
          </el-slider>
          <div class="done-list">
            <i
              class="iconfont icon-clockwise-rotation"
              @click="scaleAddNum(0.1)"
            ></i>
            <i
              class="iconfont icon-reverse-rotation"
              @click="scaleAddNum(-0.1)"
            ></i>
            <el-input-number
              size="mini"
              v-model="scale"
              :controls="false"
              :min="0"
              :max="2"
              label="请输入放大倍率"
              @blur="blurHandler"
            ></el-input-number>
            <el-button type="text" @click="sureHandler"> 确定 </el-button>
          </div>
        </div>
      </template>
    </BaseDesign>
  </div>
</template>

<script>
import { fabricInstanceMixin } from '../../mixins'
export default {
  inject: ['canvasModifiedHandler'],
  mixins: [fabricInstanceMixin],
  props: {
    resetVal: {
      requird: true
    }
  },
  data() {
    return {
      value: this.resetVal,
      scale: this.resetVal,
      show: false,
      marks: {
        0: '0',
        1.5: '1.5',
        2: '2'
      }
    }
  },
  watch: {
    resetVal(newVal) {
      this.value = newVal
    },
    value(newVal) {
      this.scale = newVal
    },
    fabricObjects: {
      handler() {
        this.watchScale()
      },
      deep: true
    },
    curFabricIndex() {
      this.watchScale()
    }
  },
  methods: {
    scaleAddNum(num) {
      const { max, min } = Math
      const val = min(max(this.value + num, 0), 2)
      this.value = val
      this.$nextTick(() => {
        this.canvasModifiedHandler()
      })
    },

 
    watchScale() {
      const objects = this.fabricObjects[this.curFabricIndex] || []
      if (objects.length > 0) {
        const activeObject = this.getActiveObject()
        this.show = !!activeObject
        if (!this.show) return
        this.value = activeObject.scaleX
      } else {
        this.show = false
        this.value = 0
      }
    },

    changeHandler(scale) {
      const activeObject = this.getActiveObject()
      if (!activeObject) return
      activeObject.scale(scale)
      this.instance.renderAll()
      this.value = scale
    },
    sureHandler() {
      if (this.value === this.scale) return
      this.value = this.scale
      this.$nextTick(() => {
        this.canvasModifiedHandler()
      })
    },
    blurHandler() {
      this.sureHandler()
    },
    render() {
      this.canvasModifiedHandler()
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-slider-component {
  width: 100%;
  .slider-wrapper {
    .el-slider {
      margin-bottom: 8px;
      padding: 0 10px;
    }
    // padding: 0 25px;
  }
  .done-list {
    display: flex;
    padding: 0 5px;
    justify-content: space-between;
    align-items: center;
    i {
      font-size: 25px;
      color: $color-gray;
      border: 1px solid $border-color;
      cursor: pointer;
    }
    i:first-child {
      margin-right: 5px;
    }
    .el-input-number {
      margin: 0 8px;
    }
  }
}
</style>
