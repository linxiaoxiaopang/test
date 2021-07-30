export const WAIT_RELATION = '11' //生成订单-待关联
export const WAIT_GENERATE_WAYBILL = '20' //待生成运单
export const EXPIRED = '29' //已过期
export const WAIT_DISPATCH = '40' //待排单
export const IN_DISPATCH = '41' //排单中
export const IN_PRODUCTION = '42' //生产中
export const DELIVER = '70' //已发货
export const RETURN_GOODS = '72' //退货中
export const CANCEL = '80' //已取消
export const FINISH = '90' //已完成

export const ORDER_STATUS_LIST = {
  [WAIT_RELATION]: '待关联',
  [WAIT_GENERATE_WAYBILL]: '待生成运单',
  [EXPIRED]: '已过期',
  [WAIT_DISPATCH]: '待排单',
  [IN_DISPATCH]: '排单中',
  [IN_PRODUCTION]: '生产中',
  [DELIVER]: '已发货',
  [RETURN_GOODS]: '退货中',
  [CANCEL]: '已取消',
  [FINISH]: '已完成'
}

export const STATUS_LIST = [
  {
    label: '待关联',
    value: WAIT_RELATION
  },
  {
    label: '待生成运单',
    value: WAIT_GENERATE_WAYBILL
  },
  {
    label: '已过期',
    value: EXPIRED
  },
  {
    label: '待排单',
    value: WAIT_DISPATCH
  },
  {
    label: '排单中',
    value: IN_DISPATCH
  },
  {
    label: '生产中',
    value: IN_PRODUCTION
  },
  {
    label: '已发货',
    value: DELIVER
  },
  {
    label: '退货中',
    value: RETURN_GOODS
  },
  {
    label: '已取消',
    value: CANCEL
  },
  {
    label: '已完成',
    value: FINISH
  }
]

export const WAYBILL_CODE_UPLOADED_YES = 1 // 订单组运单号全部上传
export const WAYBILL_CODE_UPLOADED_NO = 0 // 订单组运单号未全部上传

export const FILTER_DATA = {}

export const MENU_TYPE = 2 //工厂端
