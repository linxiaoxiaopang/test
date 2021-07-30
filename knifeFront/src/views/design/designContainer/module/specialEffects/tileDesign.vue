<template>
  <!-- 平铺效果 -->
  <div class="tileDesignComponent">
    <BaseDesign v-on="$listeners" contentHeight="auto">
      <template #title>平铺</template>
      <template #content>
        <ul class="list">
          <li
            :class="['item', item.type === form.groupType && 'active']"
            v-for="(item, indx) in list"
            @click="toggleValue(item)"
            :key="indx"
          >
            <div class="icon-wrapper">
              <i :class="item.icon" />
            </div>
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
        <div class="slider-box">
          <div class="slder-item">
            <span class="label">横向间距</span>
            <el-slider
              :value="form.groupHorizontal"
              @input="horizontalInputHandler"
            ></el-slider>
          </div>
          <div class="lock-wrapper">
            <i
              :class="['iconfont', 'icon-link', 'lock-active']"
              v-if="lock"
              @click="lock = false"
            ></i>
            <i class="iconfont icon-link" v-else @click="lock = true"></i>
          </div>
          <div class="slder-item">
            <span class="label">纵向间距</span>
            <el-slider
              :value="form.groupVertical"
              @input="verticalInputHandler"
            ></el-slider>
          </div>
        </div>
      </template>
    </BaseDesign>
  </div>
</template>

<script>
import { fabricInstanceMixin, tileMixin } from '../../mixins'

import { INIT_GTOUP_INFO_FORM } from '@/utils/constant'
//group的初始值
// const INIT_GTOUP_INFO_FORM = {
//   groupType: undefined,
//   groupHorizontal: 0,
//   groupVertical: 0
// }
export default {
  inject: ['canvasModifiedHandler'],
  mixins: [fabricInstanceMixin, tileMixin],
  data() {
    return {
      lock: true,
      form: {},
      selectLayer: null,
      list: [
        {
          icon: 'iconfont icon-base-tile',
          name: '基础',
          type: 0
        },
        {
          icon: 'iconfont icon-mirror-tiling',
          name: '镜像',
          type: 1
        },
        {
          icon: 'iconfont icon-staggered-laterally',
          name: '横向',
          type: 2
        },
        {
          icon: 'iconfont icon-staggered-longitudinally',
          name: '纵向',
          type: 3
        }
      ]
    }
  },
  watch: {
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
    watchRotate() {
      const instance = this.instance
      if (instance) {
        const curLayer = this.getActiveObject() || null
        if (curLayer && this.selectLayer !== curLayer) {
          this.selectLayer = curLayer
          this.updateForm(curLayer)
        }
      }
    },

    updateFormToLayer(curLayer) {
      curLayer = curLayer || this.getActiveObject() || null
      if (this.form.groupType === undefined) {
        if (curLayer && curLayer.groupType !== undefined) {
          this.clearLayerAboutForm(curLayer)
        }
        return
      }

      if (!curLayer) return
      for (let key in this.form) {
        curLayer[key] = this.form[key]
      }
    },

    clearLayerAboutForm(curLayer) {
      for (let key in this.form) {
        delete curLayer[key]
      }
    },
    updateForm(curLayer) {
      curLayer = curLayer || this.getActiveObject() || null
      if (!curLayer) return
      if (curLayer.groupType !== undefined) {
        this.form = {
          groupType: curLayer.groupType,
          groupHorizontal: curLayer.groupHorizontal,
          groupVertical: curLayer.groupVertical
        }
      } else {
        this.form = {
          ...INIT_GTOUP_INFO_FORM
        }
      }
      this.updateFormToLayer(curLayer)
    },

    toggleValue(item) {
      const type = item.type === this.form.groupType ? undefined : item.type
      this.$set(this.form, 'groupType', type)
      this.updateFormToLayer()
      this.baseTile(type)
    },

    horizontalInputHandler(val) {
      this.hTimer && clearTimeout(this.hTimer)
      this.hTimer = setTimeout(() => {
        this.$set(this.form, 'groupHorizontal', val)
        if (this.lock) {
          this.$set(this.form, 'groupVertical', val)
        }
        this.updateFormToLayer()
        this.baseTile(this.form.groupType)
      }, 50)
    },

    verticalInputHandler(val) {
      this.vTimer && clearTimeout(this.vTimer)
      this.vTimer = setTimeout(() => {
        this.$set(this.form, 'groupVertical', val)
        if (this.lock) {
          this.$set(this.form, 'groupHorizontal', val)
        }
        this.updateFormToLayer()
        this.baseTile(this.form.groupType)
      }, 50)
    }
  }
}
</script>

<style lang="scss" scoped>
.tileDesignComponent {
  .list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .item {
      position: relative;
      flex: 0 0 23%;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 12px;
      .name {
        margin-top: 10px;
      }
      .icon-wrapper {
        position: relative;
        width: 100%;
        padding-top: 100%;
        i {
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          font-size: 30px;
          color: $color-primary;
          border: 1px solid $border-color;
          cursor: pointer;
        }
      }
    }
    .item.active {
      i {
        color: $color-primary;
        border-color: currentColor;
        font-weight: 600;
      }
      .name {
        color: $color-primary;
      }
    }
  }
  .slider-box {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 20px 0;
    i {
      font-size: 20px;
      line-height: 1.5;
    }
    .fa-lock {
      color: $color-primary;
    }
    .slder-item {
      display: flex;
      align-items: center;
      width: 100%;
      overflow: hidden;
      padding-right: 10px;
      height: 20px;
      .label {
        font-size: 12px;
        flex: 0 0 80px;
      }
      .el-slider {
        flex: 1;
        ::v-deep {
          .el-slider__runway {
            margin: 0;
          }
        }
      }
    }
    .lock-wrapper {
      position: relative;
      width: 60px;
      height: 20px;
      top: 5px;
      left: 5px;
      text-align: center;
      transform: rotate(90deg);
      i {
        font-size: 30px;
        position: relative;
        left: -5px;
      }
      .lock-active {
        color: $color-primary;
      }
    }
  }
}
</style>
