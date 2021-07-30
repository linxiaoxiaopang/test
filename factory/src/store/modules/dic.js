import request from '@/service/request'
import { validatenull } from '@/components/avue/utils/validate'
import {requestLimitNum, requestQueue} from '@/utils'

import {
  WAIT_RELATION,
  WAIT_GENERATE_WAYBILL,
  EXPIRED,
  WAIT_DISPATCH,
  IN_DISPATCH,
  IN_PRODUCTION,
  DELIVER,
  RETURN_GOODS,
  CANCEL,
  FINISH,
  ORDER_STATUS_LIST
} from '@/utils/constant'
import { delDicEmptyChildren } from '@/components/avue/utils/util'

function getDic(option) {
  return request({
    method: 'post',
    data: {},
    ...option
  })
}

// 当type值为以下任意一项，设置dicData和props
let hasDicType = ['select', 'radio', 'checkbox', 'cascader']

let orderStatus = {
  dicData: [
    {
      label: ORDER_STATUS_LIST[WAIT_RELATION],
      value: WAIT_RELATION
    },
    {
      label: ORDER_STATUS_LIST[WAIT_GENERATE_WAYBILL],
      value: WAIT_GENERATE_WAYBILL
    },
    {
      label: ORDER_STATUS_LIST[EXPIRED],
      value: EXPIRED
    },
    {
      label: ORDER_STATUS_LIST[WAIT_DISPATCH],
      value: WAIT_DISPATCH
    },
    {
      label: ORDER_STATUS_LIST[IN_DISPATCH],
      value: IN_DISPATCH
    },
    {
      label: ORDER_STATUS_LIST[IN_PRODUCTION],
      value: IN_PRODUCTION
    },
    {
      label: ORDER_STATUS_LIST[DELIVER],
      value: DELIVER
    },
    {
      label: ORDER_STATUS_LIST[RETURN_GOODS],
      value: RETURN_GOODS
    },
    {
      label: ORDER_STATUS_LIST[CANCEL],
      value: CANCEL
    },
    {
      label: ORDER_STATUS_LIST[FINISH],
      value: FINISH
    }
  ]
}
let exportStatus = {
  dicData: [
    {
      label: '未导出',
      value: '0'
    },
    {
      label: '已导出',
      value: '1'
    }
  ]
}
let factoryStatus = {
  dicData: []
}
orderStatus.dicData.map(orderStatus => {
  exportStatus.dicData.map(exportStatus => {
    factoryStatus.dicData.push({
      label: `${orderStatus.label}-${exportStatus.label}`,
      value: `${orderStatus.value}${exportStatus.value}`
    })
  })
})

const dic = {
  state: {
    orderStatus,
    exportStatus,
    factoryStatus,
    expressWaybillIsUploaded: {
      dicData: [
        {
          label: '已上传',
          value: '1'
        },
        {
          label: '未上传',
          value: '0'
        }
      ]
    },
    expressCompanyId: {
      url: '/system/expressCompany/list/',
      dicData: null,
      partParams: {
        isDeleted: '0'
      },
      partData: null,
      props: {
        label: 'companyName',
        value: 'id'
      }
    }
  },

  mutations: {
    // 设置dicData
    SET_DIC_DATA: (state, {prop, dicData} = {}) => {
      if (!prop) return
      state[prop].dicData = dicData

      let {partParams} = state[prop]
      if (partParams && Array.isArray(dicData)) {
        let partKeys = Object.keys(partParams)
        state[prop].partData = dicData.filter(dicItem => partKeys.every(key => dicItem[key] === partParams[key]))
      }
    }
  },

  actions: {
    MultipleGetDic({ dispatch }, props = []) {
      props.forEach(prop => dispatch('GetDic', prop))
    },
    // 根据dictType获取字典
    GetDict({ state, commit }, dictType) {
      return new Promise(resolve => {
        getDic({
          url: '/system/dictionary/list',
          data: {
            dictType
          }
        }).then(({ detail }) => {
          getDic({
            url: '/system/dictionaryItem/list',
            data: {
              dictId: detail[0].id
            }
          }).then(({ detail }) => {
            resolve(detail)
          })
        })
      })
    },
    // 获取字典
    GetDic({ state, commit, dispatch }, prop) {
      if (!prop) return []
      let dic = state[prop] || {}
      if (dic.dicData) return dic.dicData
      return new Promise(resolve => {
        if (dic.url) {
          dic.dicData = getDic(dic)
            .then(({ detail }) => {
              // eslint-disable-next-line
              detail = detail || []
              detail = Array.isArray(detail) ? detail : detail.results
              commit('SET_DIC_DATA', { prop, dicData: detail })
              resolve(detail)
              return detail
            })
            .catch(() => {
              dic.dicData = []
              resolve([])
              return []
            })
        } else if (dic.dictType) {
          dic.dicData = dispatch('GetDict', dic.dictType)
            .then(dicData => {
              commit('SET_DIC_DATA', { prop, dicData })
              resolve(dicData)
              return dicData
            })
            .catch(() => {
              dic.dicData = []
              resolve([])
              return []
            })
        } else {
          resolve(dic.dicData || [])
        }
      })
    },
    // 获取所有字典
    GetAllDic({ state, dispatch }) {
      for (const stateKey in state) {
        requestLimitNum(6)
        requestQueue(() => dispatch('GetDic', stateKey))
      }
    },
    // 清除字典
    ClearDic({ commit }, prop) {
      commit('SET_DIC_DATA', {
        prop,
        dicData: null
      })
    },
    // 刷新字典
    async RefreshDic({ dispatch }, prop) {
      await dispatch('ClearDic', prop)
      await dispatch('GetDic', prop)
    },
    // 处理avueCrud/avueForm的option的column，为column子项添加dicData和props
    HandleOption({ dispatch, state }, { column }) {
      column.forEach((column) => {
        let dic = state[column.prop] || {}
        if (hasDicType.includes(column.type)) {
          if (validatenull(column.props) && dic.props) {
            column.props = dic.props
          }
          if (validatenull(column.dicData)) {
            column.dicData = []
            dispatch('GetDic', column.prop).then((dicData) => {
              if (validatenull(column.dicData) && dicData) {
                if (column.dicType) {
                  dicData = dic[column.dicType]
                }
                column.dicData = delDicEmptyChildren(dicData)
              }
            })
          }
        }
      })
    }
  }
}

export default dic
