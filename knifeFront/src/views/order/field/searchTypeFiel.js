import store from '@/store'
import {
  WAIT_RELATION,
  WAIT_GENERATE_WAYBILL,
  WAYBILL_CREATING,
  WAYBILL_CREATE_ERROR,
  WAYBILL_NOT_CREATE,
  IN_DISPATCH,
  IN_PRODUCTION,
  DELIVER,
  EXPIRED,
  CANCEL,
  RETURN_GOODS
} from '@/utils/constant'

// 订单 搜索类型 搜索项
export const orderCode = {
  label: '订单号',
  prop: 'orderCode'
}
export const expressWaybillCode = {
  label: '运单号',
  prop: 'expressWaybillCode'
}
export const expressCompanyId = {
  label: '物流方式',
  prop: 'expressCompanyId',
  type: 'select'
}
export const customSku = {
  label: '产品SKU',
  prop: 'customSku'
}
export const consigneeName = {
  label: '收件人',
  prop: 'consigneeName'
}
store.dispatch('HandleOption', { column: [expressCompanyId] })

// 订单 搜索类型 类型列表
export const searchTypeOptions = {
  [WAYBILL_CREATING]: [orderCode, expressCompanyId, customSku, consigneeName],
  [WAYBILL_CREATE_ERROR]: [orderCode, expressCompanyId, customSku, consigneeName],
  [WAYBILL_NOT_CREATE]: [orderCode, customSku, consigneeName],
  [WAIT_RELATION]: [
    orderCode,
    expressWaybillCode,
    expressCompanyId,
    consigneeName
  ],
  default: [
    orderCode,
    expressWaybillCode,
    expressCompanyId,
    customSku,
    consigneeName
  ]
}

// 订单状态单选列表
// value单选选中值，为了获取searchValue
// searchValue为实际请求参数
export const orderStateList = [
  {
    label: '待处理',
    value: 0,
    searchValue: {
      orderStatusList: [WAIT_RELATION, WAIT_GENERATE_WAYBILL],
      expressWaybillIsCreated: 0
    }
  },
  {
    label: '运单申请',
    value: 1,
    searchValue: {
      waybillApplicationQuery: 1
    }
  },
  {
    label: '排单中',
    value: 2,
    searchValue: {
      orderStatus: IN_DISPATCH
    }
  },
  {
    label: '生产中',
    value: 3,
    searchValue: {
      orderStatus: IN_PRODUCTION
    }
  },
  {
    label: '已发货',
    value: 4,
    searchValue: {
      orderStatus: DELIVER
    }
  },
  {
    label: '运单已过期',
    value: 5,
    searchValue: {
      orderStatus: EXPIRED
    }
  },
  {
    label: '已取消',
    value: 6,
    searchValue: {
      orderStatus: CANCEL
    }
  },
  {
    label: '退货中',
    value: 7,
    searchValue: {
      orderStatus: RETURN_GOODS
    }
  },
  {
    label: '订单换单',
    value: 8,
    searchValue: {
      waybillChangeStatusList: [1, 2]
    }
  }
]
