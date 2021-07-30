<template>
  <!-- 当前选中图层操作器 -->
  <div class="lineOperatorsComponent">
    <ul class="list">
      <li
        class="item"
        v-for="({ icon, operatorType, tooltipText }, indx) in list"
        :key="indx"
        @click="operatorHandler(operatorType, operatorType == 'clear')"
      >
        <div :class="['icon-wrapper', active({ operatorType })]">
          <i :class="['iconfont', icon]" />
          <!-- <el-image :src="icon"></el-image> -->
          <span>{{ tooltipText }}</span>
        </div>
      </li>
      <li @click="clickHandler">
        111
      </li>
    </ul>
  </div>
</template>

<script>
import { fabricInstanceMixin } from '../mixins'
import { createRandomNum } from '@/utils'

const CLEAR = 'clear'

export default {
  inject: ['canvasModifiedHandler'],
  mixins: [fabricInstanceMixin],
  data() {
    return {
      list: [
        {
          icon: 'icon-ic_arrow',
          operatorType: 'lastLayer',
          tooltipText: '上移'
        },
        {
          icon: 'icon-ic_arrow_down',
          operatorType: 'nextLayer',
          tooltipText: '下移'
        },
        {
          icon: 'icon-ic_middle',
          operatorType: 'centerH',
          tooltipText: '水平居中'
        },
        {
          icon: 'icon-ic_align',
          operatorType: 'centerV',
          tooltipText: '竖直居中'
        },
        {
          icon: 'icon-ic_flip',
          operatorType: 'flipX',
          tooltipText: '水平翻转'
        },
        {
          icon: 'icon-ic_flipver',
          operatorType: 'flipY',
          tooltipText: '垂直翻转'
        },

        {
          icon: 'icon-ic_screen',
          operatorType: 'scaleToMax',
          tooltipText: '铺满'
        },

        // {
        //   icon: "require('@/assets/design/ic_horiz.png')",
        //   operatorType: "rotate45",
        //   tooltipText: "旋转45°",
        // },
        {
          icon: 'icon-ic_scale',
          operatorType: 'fullScreen',
          tooltipText: '适应'
        },
        {
          icon: 'icon-ic_copyy',
          operatorType: 'clone',
          tooltipText: '复制'
        },
        {
          icon: 'icon-ic_auto-width',
          operatorType: 'scaleToMaxWidth',
          tooltipText: '宽度最大'
        },
        {
          icon: 'icon-ic_auto-hight',
          operatorType: 'scaleToMaxHeight',
          tooltipText: '高度最大'
        },

        // {
        //   icon: require('@/assets/design/ic_besper.png'),
        //   operatorType: 'fullScreen',
        //   tooltipText: '铺满'
        // },
        {
          icon: 'icon-ic_delete',
          operatorType: 'delete',
          tooltipText: '删除'
        },

        {
          icon: 'icon-ic_refresh',
          operatorType: CLEAR,
          tooltipText: '重置'
        }
      ]
    }
  },

  computed: {
    canvasWidth() {
      return this.instance && this.instance.realWidth
    },

    canvasHeight() {
      return this.instance && this.instance.realHeight
    },

    active() {
      return ({ operatorType }) => {
        try {
          //监听图层变化
          const fabricObjects = this.fabricObjects
          const curFabricIndex = this.curFabricIndex
          if (operatorType === CLEAR) {
            return 'active'
          }
          return !!this.instance.getActiveObject() ? 'active' : ''
        } catch (err) {
          return ''
        }
      }
    }
  },

  methods: {
    operatorHandler(type, bool) {
      const activeObject = this.getActiveObject()
      if (!activeObject && !bool) {
        this.$message.warning('请先选中需要操作的图层')
        return
      }
      const funcObj = {
        lastLayer: this.lineOperatorsToLastLayerHandler,
        nextLayer: this.lineOperatorstoNextLayerHandler,
        centerH: this.lineOperatorsCenterHHandler,
        centerV: this.lineOperatorsCenterVHandler,
        flipX: this.lineOperatorsClipXHandler,
        flipY: this.lineOperatorsClipYHandler,
        rotate45: this.lineOperatorsCotate45Handler,
        clone: this.lineOperatorsCloneHandler,
        scaleToMaxWidth: this.lineOperatorsCcaleToMaxWidthHandler,
        scaleToMaxHeight: this.lineOperatorsCcaleToMaxHeightHandler,
        scaleToMax: this.lineOperatorsCcaleToMaxHandler,
        fullScreen: this.lineOperatorsCullScreenHandler,
        clear: this.lineOperatorsClearHandler,
        delete: this.lineOperatorsRemoveCurLayerHandler
      }
      funcObj[type](activeObject)
      this.$nextTick(() => {
        this.rander()
      })
    },
    clickHandler() {
      const url = require('./Y6CZ4G-800-1b04bd6ee48cf730c95206afefbe9.png')
      console.log('url', url)
      fabric.Image.fromURL(url, async img => {
      const activeObj =this.getActiveObject()
      console.log('activeObj', activeObj)
       var patternSourceCanvas = new fabric.StaticCanvas();
        patternSourceCanvas.setWidth(100);
        patternSourceCanvas.setHeight(100);
         img.scaleToWidth(100);
        patternSourceCanvas.add(img);
        patternSourceCanvas.renderAll();
         var pattern = new fabric.Pattern({
          source: patternSourceCanvas.getElement(),
          repeat: "repeat"
        });
         var rect = new fabric.Rect({
          left: 350, //距离画布左侧的距离，单位是像素
          top: 350, //距离画布上边的距离
          fill: pattern, //填充的颜色
          width: 1800, //方形的宽度
          height: 1800, //方形的高度,
          angle: 0,
          originX:'center',
          originY:'center',
          id: 'haha_1445'
        });

       this.instance.canvas.add(rect);
      })
    },

    rander() {
      this.canvasModifiedHandler()
    },
    //图案上移一层
    lineOperatorsToLastLayerHandler(activeObject) {
      this.instance.toLastLayer(activeObject)
    },
    //图案下移一层
    lineOperatorstoNextLayerHandler(activeObject) {
      this.instance.toNextLayer(activeObject)
    },
    //水平居中
    lineOperatorsCenterHHandler(activeObject) {
      this.instance.centerH(activeObject)
      this.instance.renderAll()
    },
    //竖直居中
    lineOperatorsCenterVHandler(activeObject) {
      this.instance.centerV(activeObject)
      this.instance.renderAll()
    },
    //水平镜像
    lineOperatorsClipXHandler(activeObject) {
      this.instance.flipX(activeObject)
      this.instance.renderAll()
    },
    //垂直镜像
    lineOperatorsClipYHandler(activeObject) {
      this.instance.flipY(activeObject)
      this.instance.renderAll()
    },
    //图案顺时针旋转45°
    lineOperatorsCotate45Handler(activeObject) {
      if (activeObject.type === 'image') {
        this.instance.rotate(activeObject, 45)
        this.instance.renderAll()
      }
    },
    //复制图案
    lineOperatorsCloneHandler(activeObject) {
      this.instance.clone(
        activeObject,
        (o) => {
          const objects = this.instance.getObjects()
          const activeObjectIndex = objects.findIndex(
            ({ id }) => id === activeObject.id
          )
          o.left = o.left + 20
          o.top = o.top + 20
          this.instance.add(o)
          o.setOptions({
            id:
              createRandomNum() +
              (activeObject.id.split('@_')[1]
                ? `@_${activeObject.id.split('_')[1]}`
                : '')
          })
          o.moveTo(activeObjectIndex + 1)
          this.instance.renderControls(o)
          this.instance.renderAll()
        },
        {}
      )
    },
    //图案宽度最大化
    lineOperatorsCcaleToMaxWidthHandler(activeObject) {
      if (!this.noIsImgWarning(activeObject)) return
      if (activeObject.type === 'image') {
        // const witdh = activeObject.width * activeObject.scaleX;
        this.instance.scaleToWidth(activeObject, this.canvasWidth)
        // activeObject.left = activeObject.left - (this.canvasWidth - witdh) / 2;
        this.instance.renderAll()
      }
    },
    //图案高度最大化
    lineOperatorsCcaleToMaxHeightHandler(activeObject) {
      if (!this.noIsImgWarning(activeObject)) return

      if (activeObject.type === 'image') {
        this.instance.scaleToHeight(activeObject, this.canvasHeight)
        this.instance.renderAll()
      }
    },
    //图案最大化设计
    lineOperatorsCcaleToMaxHandler(activeObject) {
      this.canvasWidth >= this.canvasHeight
        ? this.lineOperatorsCcaleToMaxWidthHandler(activeObject)
        : this.lineOperatorsCcaleToMaxHeightHandler(activeObject)
    },
    //铺满设计区域
    lineOperatorsCullScreenHandler(activeObject) {
      if (!this.noIsImgWarning(activeObject)) return
      if (activeObject.type === 'image') {
        this.instance.scaleToWidth(activeObject, this.canvasWidth)
        this.instance.scaleToHeight(activeObject, this.canvasHeight)
        this.instance.renderAll()
      }
    },

    //删除当前图层
    lineOperatorsRemoveCurLayerHandler(curActiveLayer) {
      this.instance.remove(curActiveLayer)
      setTimeout(() => {
        this.rander()
      }, 100)
    },

    lineOperatorsClearHandler() {
      this.$confirm('确定要清除画布?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          objects.map((o) => {
            this.instance.remove(o)
          })
          this.instance.renderAll()
          this.$message({
            type: 'success',
            message: '清除成功!'
          })
          this.$nextTick(() => {
            this.rander()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消清除'
          })
        })
      const objects = this.instance.getObjects()
    },
    noIsImgWarning(activeObject) {
      if (activeObject.type !== 'image') {
        this.$message.warning('无效图层，此操作只支持图片类型图层！')
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.lineOperatorsComponent {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  // margin-top: 20px;
  margin-bottom: 20px;
  .list {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    border: 1px solid $border-color;
    padding: 5px;
    border-radius: 4px;
    width: auto;
    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 2px;
      cursor: pointer;
      .icon-wrapper {
        justify-content: center;
        align-items: center;
        display: flex;
        flex-direction: column;
        color: $color-gray;
        font-size: 14px;
        color: #c3cbd6;
        span {
          margin-top: 10px;
        }
        i {
          font-size: 20px;
        }
      }
      .icon-wrapper.active {
        color: $color-gray;
      }
    }
    .item + .item {
      margin-left: 8px;
    }
  }
}
</style>
