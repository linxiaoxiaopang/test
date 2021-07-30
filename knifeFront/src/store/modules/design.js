import cloneDeep from 'lodash/cloneDeep'
import { ONG_GROUP_DESIGN } from '@/utils/constant'

const design = {
  state: {
    designType: ONG_GROUP_DESIGN, //一件定制状态
    oneGroupDesignLayerPosData: [], //一键定制位置信息
    oneGroupTransformListData: [], //一键定制转换分块定制数据
    protoObj: {},
    previewShow: false, //展示预览图弹窗状态
    fabricList: [], //定制器实例（instance）列表
    curFabricIndex: 0, //当前画布索引
    fabricObjects: [], //当前画布对象
    fabricActiveObjectIds: [], //当前选中画布id
    fabricTabNoUpdate: false,
    psdDocumentInfo: {} //psd全局信息
  },
  mutations: {
    //更新psd全局信息
    UPDATE_DOCUMENT_PSD_INFO(state, psdDocumentInfo) {
      state.psdDocumentInfo = psdDocumentInfo
    },

    //更新一键定制位置信息
    UPDATE_ONE_GROUP_DESIGN_LAYER_POS_DATA(state, oneGroupDesignLayerPosData) {
      state.oneGroupDesignLayerPosData = oneGroupDesignLayerPosData
    },

    //更新一键定制转换分块定制数据
    UPDATE_ONE_GROUP_TRANSFORM_LIST_DATA(state, oneGroupTransformListData) {
      state.oneGroupTransformListData = oneGroupTransformListData
    },

    //更新定制器状态 0 一键定制 1 分块定制
    UPDATE_DESIGN_TYPE(state, designType) {
      state.designType = designType
    },

    UPDATE_PREVIEW_SHOW(state, bool) {
      state.previewShow = bool
    },
    SET_PROTO_OBJ(state, protoObj) {
      state.protoObj = protoObj
    },
    SET_CUR_FABRIC_INDEX(state, curFabricIndex) {
      state.curFabricIndex = curFabricIndex
    },
    SET_FABRIC_LIST(state, fabricList) {
      state.fabricList = fabricList
    },
    UPDATE_FABRIC_LIST(state, { index, canvas }) {
      state.fabricList[index].canvas = canvas
    },
    SET_FABRIC_OBJECTS(state, { objects, groupIndex }) {
      state.fabricObjects.splice(groupIndex, 1, objects)
    },
    SET_FABRIC_ACTIVE_OBJECT_IDS(state, { id, groupIndex }) {
      state.fabricActiveObjectIds[groupIndex] = id
      state.fabricActiveObjectIds = cloneDeep(state.fabricActiveObjectIds)
    },
    SET_FABRIC_NO_UPDATE(state, fabricTabNoUpdate) {
      state.fabricTabNoUpdate = fabricTabNoUpdate
    }
  },
  actions: {}
}

export default design
