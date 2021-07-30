import request from '@/service/request'
import { validatenull } from '@/components/avue/utils/validate'
import { requestLimitNum, requestQueue } from '@/utils'

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

const dic = {
  state: {
    sex: {
      dicData: [
        {
          label: '通用',
          value: 0
        },
        {
          label: '男',
          value: 1
        },
        {
          label: '女',
          value: 2
        },
        {
          label: '儿童',
          value: 3
        }
      ]
    },
    season: {
      dicData: [
        {
          label: '通用',
          value: 0
        },
        {
          label: '春',
          value: 1
        },
        {
          label: '夏',
          value: 2
        },
        {
          label: '秋',
          value: 3
        },
        {
          label: '冬',
          value: 4
        }
      ]
    },
    level: {
      dicData: [
        {
          label: '全部',
          value: 1
        },
        {
          label: '个人版',
          value: 2
        },
        {
          label: '创业板',
          value: 3
        },
        {
          label: '专业版',
          value: 4
        },
        {
          label: '企业版',
          value: 5
        }
      ]
    },
    declaration: {
      dicData: [
        {
          label: '含电',
          value: 'attr_electric'
        },
        {
          label: '含非液体化妆品',
          value: 'attr_liquid'
        },
        {
          label: '特货（敏感货）',
          value: 'attr_special'
        }
      ]
    },
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
    orderStatus: {
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
    },
    isKnifeLayoutCreated: {
      dicData: [
        {
          label: '已生成',
          value: 1
        },
        {
          label: '未生成',
          value: 0
        }
      ]
    },
    isCustomsDeclaredExported: {
      dicData: [
        {
          label: '生产中-未导出',
          value: '0'
        },
        {
          label: '生产中-已导出',
          value: '1'
        }
      ]
    },
    isAuthorized: {
      dicData: [
        {
          label: '全部',
          value: 'all'
        },
        {
          label: '已授权',
          value: '1'
        },
        {
          label: '未授权',
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
    },
    administrativeArea: {
      url: '/system/administrativeArea/complexList',
      dicData: null,
      props: {
        label: 'areaCnName',
        value: 'areaCode'
      }
    },
    category: {
      url: '/api/image/image_category',
      method: 'get',
      dicData: null,
      props: {
        label: 'name',
        value: 'id'
      }
    },
    proCategory: {
      url: '/api/prim_prod/product_category/',
      method: 'get',
      dicData: null,
      props: {
        label: 'name',
        value: 'id'
      }
    },
    gearsCategory: {
      url: '/api/price_conf/gear_category',
      method: 'get',
      dicData: null,
      props: {
        label: 'cate_name',
        value: 'id'
      }
    },
    userSku: {
      url: '/api/product/sku_map',
      method: 'get',
      dicData: null,
      props: {
        label: 'user_sku',
        value: 'user_sku'
      }
    },
    supplierId: {
      url: '/api/rbac/supplier',
      method: 'get',
      dicData: null,
      props: {
        label: 'name',
        value: 'id'
      }
    },
    prim_color: {
      url: '/api/prim_prod/prim_color',
      method: 'get',
      dicData: null,
      props: {
        label: 'color_name',
        value: 'id'
      }
    },
    continentDictCode: {
      dictType: 'continentDictCode',
      dicData: null,
      props: {
        label: 'itemName',
        value: 'id'
      }
    }
  },

  mutations: {
    // 设置dicData
    SET_DIC_DATA: (state, { prop, dicData } = {}) => {
      if (!prop) return
      state[prop].dicData = dicData

      let { partParams } = state[prop]
      if (partParams && Array.isArray(dicData)) {
        let partKeys = Object.keys(partParams)
        state[prop].partData = dicData.filter((dicItem) => partKeys.every((key) => dicItem[key] === partParams[key]))
      }
    }
  },

  actions: {
    MultipleGetDic({ dispatch }, props = []) {
      props.forEach((prop) => dispatch('GetDic', prop))
    },
    // 根据dictType获取字典
    GetDict({ state, commit }, dictType) {
      return new Promise((resolve) => {
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
      return new Promise((resolve) => {
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
            .then((dicData) => {
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
