<template>
  <div class="scroll-slider-component">
    <BaseDesign v-on="$listeners" contentHeight="auto">
      <template #title>旋转</template>
      <template #content>
        <div class="slider-wrapper">
          <el-slider
            ref="slider"
            size="mini"
            v-model="value"
            :min="0"
            :max="360"
            :marks="marks"
            :show-input-controls="false"
            :format-tooltip="formatTooltip"
            @input="changeHandler"
            @mouseup.native="render"
          >
          </el-slider>
          <div class="done-list">
            <i
              class="iconfont icon-clockwise-rotation"
              @click="rotateAddNum(30)"
            ></i>
            <i
              class="iconfont icon-reverse-rotation"
              @click="rotateAddNum(-30)"
            ></i>
            <el-input-number
              size="mini"
              v-model="angle"
              :controls="false"
              :min="0"
              :max="360"
              label="请输入角度"
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
      angle: this.resetVal,
      show: false,
      marks: {
        90: '90°C',
        180: '180°C',
        270: '270°C'
      }
    }
  },
  watch: {
    resetVal(newVal) {
      this.value = newVal
    },
    value(newVal) {
      this.angle = newVal
    },
    fabricObjects: {
      handler() {
        this.watchRotate()
      },
      deep: true
    },
    curFabricIndex() {
      this.watchRotate()
    }
  },
  methods: {
    rotateAddNum(num) {
      const { max } = Math
      const val = max(this.value + num, 0)
      this.value = val % 360
      this.$nextTick(() => {
        this.canvasModifiedHandler()
      })
    },

    formatTooltip(val) {
      return val + '°'
    },

    watchRotate() {
      const objects = this.fabricObjects[this.curFabricIndex] || []
      if (objects.length > 0) {
        const activeObject = this.getActiveObject()
        this.show = !!activeObject
        if (!this.show) return
        this.value = parseInt(activeObject.angle || 0)
      } else {
        this.show = false
        this.value = 0
      }
    },

    changeHandler(angle) {
      const activeObject = this.getActiveObject()
      if (!activeObject) return
      activeObject.setOptions({
        angle
      })
      this.instance.renderAll()
      this.value = angle
    },
    sureHandler() {
      if (this.value === this.angle) return
      this.value = this.angle
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
