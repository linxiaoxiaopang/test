<template>
  <div class="layerControllerComponent">
    <div class="title preview">图层管理</div>
    <Scroll class="controller-list-wrapper" :data="list">
      <ul class="controller-list">
        <li class="item" @click="$emit('update:tabActiveIndex', '3')">
          <div class="info bg-info">
            <div
              :style="{ backgroundColor: backgroundColor }"
              class="color-chunk"
            ></div>
            <div class="name">背景</div>
            <!-- <div class="name">{{ item.type }}</div> -->
          </div>
          <div class="color-wrapper">
            {{ backgroundColor }}
          </div>
        </li>
        <template v-for="(item, indx) in list">
          <li
            :class="['item', curActiveObjectId == item.id && 'active']"
            :key="indx"
            @click="layerControllerHandler(item)"
          >
            <div class="info">
              <el-image :src="item | getIconOrSrc" />
              <div class="name">{{ item | getName }}</div>
              <!-- <div class="name">{{ item.type }}</div> -->
              <div class="index-wrapper">{{ (indx + 1) | getIndex(list) }}</div>
            </div>
            <div class="icon-btns">
              <i
                class="el-icon-top"
                @click.stop="toLastLayerHandler(item, indx)"
              ></i>
              <i
                class="el-icon-bottom"
                @click.stop="toNextLayerHandler(item, indx)"
              ></i>
              <i
                class="fa fa-eye"
                v-if="item.visible"
                @click.stop="toggleCurLayerBlock(item, false)"
              ></i>
              <i
                class="fa fa-eye-slash"
                v-else
                @click.stop="toggleCurLayerBlock(item, true)"
              ></i>
              <i
                class="el-icon-close"
                @click.stop="removeCurLayerHandler(item, indx)"
              ></i>
            </div>
          </li>
        </template>
      </ul>
    </Scroll>
  </div>
</template>

<script>
import Scroll from '@/components/scroll'
import { fabricInstanceMixin } from '../mixins'
import { getPicName } from '@/utils'

export default {
  inject: ['canvasModifiedHandler'],
  components: {
    Scroll
  },
  mixins: [fabricInstanceMixin],
  props: {
    layerJson: {
      type: Object,
      default: () => ({})
    },
    tabActiveIndex: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      curActiveObjectId: undefined,
      backgroundColor: 'rgb(255, 255, 255)'
    }
  },
  computed: {
    list() {
      if (this.instance) {
        this.backgroundColor = this.instance.canvas.backgroundColor
      }
      const objects = this.fabricObjects[this.curFabricIndex] || []
      this.toggleCurActiveObjectId()
      return objects.filter(({ type }) => type == 'i-text' || type == 'image')
    }
  },
  filters: {
    getIconOrSrc(item) {
      try {
        const src = item.getSrc()
        return src
      } catch (err) {
        return require('@/assets/images/textIcon.png')
      }
    },

    getName(item) {
      try {
        const src = item.getSrc()
        const pattern = /\w+\.\w{3}/g
        return src.match(pattern)[src.match(pattern).length - 1]
      } catch (err) {
        return item.text
      }
    },
    getIndex(val, list) {
      const groupLen = list
        .slice(0, val)
        .filter(({ type }) => type === 'group').length
      return val - groupLen
    }
  },
  methods: {
    toggleCurActiveObjectId() {
      this.$nextTick(() => {
        const curId = this.fabricActiveObjectIds[this.curFabricIndex]
        const curActiveObject =
          (this.instance && this.instance.getActiveObject()) || {}
        const id = curActiveObject.id
        this.curActiveObjectId = id

        if (id == curId) {
          return
        }

        this.SET_FABRIC_ACTIVE_OBJECT_IDS({
          groupIndex: this.curFabricIndex,
          id
        })
      })
    },
    rander(bool = false) {
      this.canvasModifiedHandler(bool)
    },
    //根据不同类型（文字类型或者图片类型）显示不同的弹窗
    updateControllerStatus(curActiveLayer) {
      if (!curActiveLayer.visible) return
      if (curActiveLayer.type == 'i-text') {
        this.$emit('updateTextLayerData', curActiveLayer)
      } else if (curActiveLayer.type == 'image') {
        this.$emit('updateImageLayerData', curActiveLayer)
      }
      this.instance.discardActive()
      this.instance.renderControls(curActiveLayer)
      this.rander()
    },

    layerControllerHandler(curActiveLayer) {
      this.updateControllerStatus(curActiveLayer)
      this.instance.renderAll()
      this.rander()
    },
    //设置当前选中图层到上一层
    toLastLayerHandler(curActiveLayer) {
      this.updateControllerStatus(curActiveLayer)
      this.instance.toLastLayer(curActiveLayer)
      this.rander(true)
    },
    //设置当前选中画布到下一层
    toNextLayerHandler(curActiveLayer) {
      this.updateControllerStatus(curActiveLayer)
      this.instance.toNextLayer(curActiveLayer)
      this.rander(true)
    },
    //删除当前图层
    removeCurLayerHandler(curActiveLayer) {
      this.instance.remove(curActiveLayer)
      setTimeout(() => {
        this.rander()
      }, 100)
    },
    //控制当前图层显示隐藏
    toggleCurLayerBlock(curActiveLayer, bool) {
      const activeObject = this.instance.getActiveObject()
      if (curActiveLayer.groupType !== undefined) {
        const objects = this.instance.canvas.getObjects()
        const fIndex = objects.findIndex(
          (item) => curActiveLayer.id === item.id
        )
        if (fIndex > 0) {
          objects[fIndex - 1].setOptions({
            visible: bool
          })
        }
      }
      curActiveLayer.setOptions({
        visible: bool
      })
      if (activeObject && activeObject == curActiveLayer) {
        this.instance.discardActive()
      }
      if (bool) {
        this.updateControllerStatus(curActiveLayer)
      }
      if (activeObject && activeObject !== curActiveLayer && !bool) {
        this.instance.renderControls(activeObject)
      }
      this.instance.renderAll()
      this.rander()
    }
  }
}
</script>

<style lang="scss" scoped>
.layerControllerComponent {
  width: 100%;
  margin-top: 10px;
  .title {
    background: #f7f9fb;
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    margin: 0 -20px;
  }
  .preview {
    font-size: 14px;
    background: #f7f9fb;
    line-height: 52px;
    height: 52px;
  }
  .controller-list-wrapper {
    height: 315px;
    overflow: hidden;
    cursor: pointer;
    margin: 0 -19px;
  }
  .controller-list {
    display: flex;

    flex-wrap: wrap;
    flex-direction: column-reverse;
    .item {
      display: flex;
      padding: 0 5px;
      height: 40px;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      background-color: #ededed;
      border-left: 1px solid #fff;
      border-bottom: 1px solid #fff;
      box-shadow: 0px 0px 3px 0px rgba(199, 214, 219, 0.7);
      cursor: pointer;
      .info {
        display: flex;
        align-items: center;
        flex: 0 0 58%;
        width: 58%;
        margin-right: 2%;
        .el-image,
        .color-chunk {
          flex: 0 0 24px;
          width: 24px;
          height: 24px;
          margin-right: 10px;
        }
        .name {
          flex: 1;
          font-size: 14px;
          @include overflow;
        }
        .index-wrapper {
          margin-left: 10px;
          padding: 0 4px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          border: 1px solid;
        }
      }
      .bg-info {
        flex: 1;
      }
      .icon-btns {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex: 1;
        margin-left: 2%;
        font-size: 16px;
        color: #000;
        font-weight: 600;
        i {
          cursor: pointer;
        }
        .el-icon-top {
        }
        .el-icon-bottom {
        }
        .fa.fa-eye {
        }
        .el-icon-close {
        }
      }
      .color-wrapper {
        white-space: nowrap;
        font-size: 14px;
      }
    }
    .item.active {
      background: $color-primary;
      color: #fff;
      * {
        color: inherit !important;
      }
    }
  }
}
</style>
