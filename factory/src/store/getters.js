import dic from '@/store/modules/dic'
import store from '@/store/index'

const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  id: state => state.user.id,
  name: state => state.user.name,
  createTime: state => state.user.createTime,
  email: state => state.user.email,
  roles: state => state.user.roles,
  //是否是超级管理员
  is_super: state => state.user.is_super,
  type: state => state.user.type,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  socketApi: state => state.api.socketApi,
  fedexData: (state) => {
    store.dispatch('GetDic', 'expressCompanyId')
    let dicData = state.dic.expressCompanyId.partData
    return Array.isArray(dicData) ? dicData : []
  }
}

for (const dicKey in dic.state) {
  getters[dicKey] = state => {
    store.dispatch('GetDic', dicKey)
    let { dicData } = state.dic[dicKey]
    return Array.isArray(dicData) ? dicData : []
  }
  getters[`${dicKey}Props`] = state => {
    return state.dic[dicKey].props || {
      label: 'label',
      value: 'value'
    }
  }
}

export default getters
