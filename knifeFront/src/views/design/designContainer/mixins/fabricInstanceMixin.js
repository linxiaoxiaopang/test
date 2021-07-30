import { mapGetters, mapMutations, mapActions } from 'vuex'
import {
  ONG_GROUP_DESIGN, //一键定制
  GROUP_LIST_DESIGN,
  DESIGN_SHOW_AREA_W,
  DESIGN_SHOW_AREA_H,
  DESIGN_AREA_W,
  DESIGN_AREA_H
} from '@/utils/constant'

export default {
  computed: {
    ...mapGetters([
      'designType',
      'psdDocumentInfo',
      'oneGroupDesignLayerPosData',
      'fabricList',
      'curFabricIndex',
      'fabricObjects',
      'fabricActiveObjectIds',
      'fabricTabNoUpdate',
      'oneGroupTransformListData'
    ]),
    instance() {
      if (this.fabricList && this.fabricList.length) {
        return this.fabricList[this.curFabricIndex]
      }
    },

    //是否是一键定制
    isOneGroupDesign() {
      return this.designType === ONG_GROUP_DESIGN
    }
  },
  methods: {
    ...mapMutations([
      'UPDATE_DESIGN_TYPE',
      'SET_CUR_FABRIC_INDEX',
      'SET_FABRIC_LIST',
      'SET_FABRIC_OBJECTS',
      'SET_FABRIC_ACTIVE_OBJECT_IDS',
      'SET_FABRIC_NO_UPDATE',
      'UPDATE_ONE_GROUP_TRANSFORM_LIST_DATA'
    ]),
    getActiveObject() {
      return this.instance && this.instance.getActiveObject()
    },
    getActiveObjectType() {
      const activeObject = this.getActiveObject()
      if (!activeObject) return false
      return activeObject.type
    },

    //根据索引获取画布实例
    getOnGroupDesiginInstanceByIndex(index) {
      let tmp = []
      this.quickDesignData.map(({ base_kl_groups }, index) => {
        base_kl_groups.map(() => {
          tmp.push(this.fabricList[index])
        })
      })
      return tmp[index]
    },

    //通过group获取module数据和group数据
    getModuleByGroupIndex(index) {
      const groupNumArr = []
      const groupArr = []
      this.quickDesignData.map(({ base_kl_groups }, mIndex) => {
        base_kl_groups.map((g) => {
          groupArr.push(g)
          groupNumArr.push(mIndex)
        })
      })

      return {
        module: this.quickDesignData[groupNumArr[index]],
        group: groupArr[index]
      }
    },

    //计算组中的对象相对于画布的坐标
    calcRealPosByGgroupObj(group, gLayer) {
      const mGroup = group.calcTransformMatrix(true)
      const mObject = gLayer.calcTransformMatrix(true)
      fabric.util.qrDecompose(mGroup)
      fabric.util.qrDecompose(mObject)
      const mTotal = fabric.util.multiplyTransformMatrices(mGroup, mObject)
      const ce = new fabric.Point(0, 0)
      const p = fabric.util.transformPoint(ce, mTotal)
      return p
    },

    getCalcPic({ w, h, img }) {
      let dirW = 0,
        dirH = 0
      if (img instanceof Image) {
        w = img.width
        h = img.height
      }
      const ratio = Math.min(w, h) / Math.max(w, h)
      const bool = w > h
      if (bool) {
        w = DESIGN_AREA_W
        h = w * ratio
      } else {
        h = DESIGN_AREA_H
        w = h * ratio
      }

      dirW = (DESIGN_SHOW_AREA_W - w) / 2
      dirH = (DESIGN_SHOW_AREA_H - h) / 2
      return { w, h, dirW, dirH }
    }
  }
}
