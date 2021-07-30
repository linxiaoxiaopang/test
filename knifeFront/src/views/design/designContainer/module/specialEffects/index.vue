<template>
  <div class="special-effects-component" v-clickoutside="outSizeHandler">
    <template v-if="showDom">
      <div class="special-effects-icon-list">
        <i :class="['iconfont', 'icon-tiled', active(0)]" @click="show(0)"></i>
        <i :class="['iconfont', 'icon-spin', active(1)]" @click="show(1)"></i>
      </div>
      <div v-if="visible">
        <div class="content-wrapper">
          <TileDesign @closeHandler="closeHandler" v-show="type == 0" />
          <ScrollSlider
            :resetVal="angle"
            @closeHandler="closeHandler"
            v-show="type == 1"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Clickoutside from 'element-ui/src/utils/clickoutside'
import TileDesign from './tileDesign'
import ScrollSlider from './scrollSlider'
import { fabricInstanceMixin } from '../../mixins'
export default {
  mixins: [fabricInstanceMixin],
  components: {
    TileDesign,
    ScrollSlider
  },
  data() {
    return {
      type: 0,
      angle: 0,
      showDom: false,
      visible: false
    }
  },
  directives: { Clickoutside },
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
  computed: {
    active() {
      return (type) => {
        return this.type == type && this.visible ? 'active' : ''
      }
    }
  },
  methods: {
    outSizeHandler() {
      this.visible = false
    },

    watchRotate() {
      const instance = this.instance
      if (instance) {
        this.showDom = !!(this.getActiveObject() || null)
        if (this.showDom) {
          this.angle = this.getActiveObject().angle
        }
        return
      }
      this.showDom = false
    },
    closeHandler() {
      this.visible = false
    },
    show(type) {
      this.type = type
      this.$nextTick(() => {
        this.visible = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.special-effects-component {
  position: relative;
  .special-effects-icon-list {
    width: 40px;
    padding: 10px 0;
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 4px;
    i {
      cursor: pointer;
      font-size: 25px;
      color: #333333;
    }
    i.active {
      color: $color-primary;
      font-weight: 600;
    }
  }
  .special-effects-popper-class {
    padding: 5px;
  }
  .content-wrapper {
    min-width: 220px;
    top: 0;
    right: 50px;
    position: absolute;
    background: #fff;
    z-index: 1000;
    border-radius: 4px;
  }
}
</style>
