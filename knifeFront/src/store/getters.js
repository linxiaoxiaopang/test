import dic from '@/store/modules/dic'
import store from '@/store/index'

const getters = {
  sidebar: (state) => state.app.sidebar,

  device: (state) => state.app.device,
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  visitedViews: (state) => state.tagsView.visitedViews,
  cachedViews: (state) => state.tagsView.cachedViews,
  id: (state) => state.user.id,
  name: (state) => state.user.name,
  createTime: (state) => state.user.createTime,
  email: (state) => state.user.email,
  roles: (state) => state.user.roles,
  //是否是超级管理员
  is_super: (state) => state.user.is_super,
  type: (state) => state.user.type,
  permission_routers: (state) => state.permission.routers,
  curRouterPid: (state) => {
    if (state.permission.curRouterPid) {
      if (sessionStorage.getItem('curRouterPid')) {
        state.permission.curRouterPid = sessionStorage.getItem('curRouterPid')
      }
    }
    return state.permission.curRouterPid
  },
  addRouters: (state) => state.permission.addRouters,
  socketApi: (state) => state.api.socketApi,
  //product
  productDetail: (state) => {
    if (state.product.productDetail) {
      if (sessionStorage.getItem('productDetail')) {
        state.product.productDetail = JSON.parse(
          sessionStorage.getItem('productDetail') || '{}'
        )
      }
    }
    return state.product.productDetail
  },
  categoryQuery: (state) => {
    if (state.product.category) {
      let category = JSON.parse(sessionStorage.getItem('category'))
      if (category) {
        state.product.category =
          category === 'all' ? category : Number(category)
      }
    }
    return state.product.category
  },
  //产品
  productObj: (state) => {
    if (!Object.keys(state.product.productObj).length) {
      if (
        sessionStorage.getItem('productObj') &&
        sessionStorage.getItem('productObj') != 'undefined'
      ) {
        state.product.productObj = JSON.parse(
          sessionStorage.getItem('productObj') || '{}'
        )
      }
    }
    return state.product.productObj
  },
  tasks: (state) => {
    return state.product.tasks
  },
  //设计
  previewShow: (state) => state.design.previewShow,
  protoObj: (state) => state.design.protoObj,
  fabricList: (state) => state.design.fabricList,
  curFabricIndex: (state) => state.design.curFabricIndex,
  fabricObjects: (state) => state.design.fabricObjects,
  fabricActiveObjectIds: (state) => state.design.fabricActiveObjectIds,
  fabricTabNoUpdate: (state) => state.design.fabricTabNoUpdate,
  //psd全局信息
  psdDocumentInfo: (state) => state.design.psdDocumentInfo,
  //获取一键定制的位置信息
  oneGroupDesignLayerPosData: (state) =>
    state.design.oneGroupDesignLayerPosData,
  //一键定制转换分块定制数据
  oneGroupTransformListData: (state) => state.design.oneGroupTransformListData,

  //定制器类型
  designType: (state) => state.design.designType,
  //全局缓存数据
  cacheAllFinish: (state) => {
    return state.cache.cacheAllFinish
  },
  fedexData: (state) => {
    store.dispatch('GetDic', 'expressCompanyId')
    let dicData = state.dic.expressCompanyId.partData
    return Array.isArray(dicData) ? dicData : []
  },
  
  orderCount: (state) => state.bus.orderCount
}

for (const dicKey in dic.state) {
  getters[dicKey] = (state) => {
    store.dispatch('GetDic', dicKey)
    let { dicData } = state.dic[dicKey]
    return Array.isArray(dicData) ? dicData : []
  }
  getters[`${dicKey}Props`] = (state) => {
    return (
      state.dic[dicKey].props || {
        label: 'label',
        value: 'value'
      }
    )
  }
}

export default getters
