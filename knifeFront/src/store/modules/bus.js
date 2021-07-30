import {
  WAIT_GENERATE_WAYBILL,
  EXPIRED,
  WAIT_RELATION,
  WAIT_DISPATCH,
  IN_DISPATCH,
  IN_PRODUCTION,
  DELIVER,
  RETURN_GOODS,
  CANCEL,
  FINISH,
  WAYBILL_NOT_CREATE,
  WAYBILL_CREATED,
  WAYBILL_CREATING,
  WAYBILL_CREATE_ERROR,
  ORDER_CHANGE_NOT,
  ORDER_CHANGE_USER,
  ORDER_CHANGE_SYS,
  ALL_ORDER_TOTAL,
  CHANGE_ORDER_TOTAL
} from '@/utils/constant'
import { debounce } from '@/utils'
import { getOrderStatusStatistics } from '@/api/order'
import cloneDeep from 'lodash/cloneDeep'

let orderCount = {
  [ALL_ORDER_TOTAL]: 0,
  [WAIT_RELATION]: 0,
  [WAIT_GENERATE_WAYBILL]: 0,
  [EXPIRED]: 0,
  [WAIT_DISPATCH]: 0,
  [IN_DISPATCH]: 0,
  [IN_PRODUCTION]: 0,
  [DELIVER]: 0,
  [RETURN_GOODS]: 0,
  [CANCEL]: 0,
  [FINISH]: 0,
  [WAYBILL_NOT_CREATE]: 0,
  [WAYBILL_CREATED]: 0,
  [WAYBILL_CREATING]: 0,
  [WAYBILL_CREATE_ERROR]: 0,
  [ORDER_CHANGE_NOT]: 0,
  [ORDER_CHANGE_USER]: 0,
  [ORDER_CHANGE_SYS]: 0,
  [CHANGE_ORDER_TOTAL]: 0
}

const bus = {
  state: {
    orderCount: cloneDeep(orderCount)
  },
  mutations: {
    SET_ORDER_COUNT(state, countObj) {
      state.orderCount = Object.assign(cloneDeep(orderCount), countObj)
    }
  },
  actions: {
    GetOrderCount: debounce(
      function ({ commit } = {}) {
        commit && getOrderStatusStatistics().then(({ detail }) => {
          let tempObj = {}
          detail.orderStatusMapList.forEach(item => {
            tempObj[item.orderStatus] = item.count
          })
          detail.waybillChangeStatusMapList.forEach(item => {
            tempObj[EXPIRED + item.waybillChangeStatus] = item.count
          })
          detail.expressWaybillIsCreatedMapList.forEach(item => {
            tempObj[WAIT_GENERATE_WAYBILL + item.expressWaybillIsCreated] = item.count
          })
          detail.waybillChangeFinishMapList.forEach(item => {
            for (const itemKey in item) {
              tempObj[itemKey] = item[itemKey]
            }
          })
          tempObj[ALL_ORDER_TOTAL] = detail.total
          commit('SET_ORDER_COUNT', tempObj)
        })
      }
    )
  }
}

export default bus
