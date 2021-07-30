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

// express_waybill_is_created	运货单面单是否已生成   0-未生成  1-已经生成(手动导入) 2-已经生成(系统生成) 8-生成中  9-生成异常
export const WAYBILL_NOT_CREATE = '200' //运货单面单未生成
export const WAYBILL_CREATED = '201' //运货单面单已生成
export const WAYBILL_CREATING = '208' //运货单面单生成中
export const WAYBILL_CREATE_ERROR = '209' //运货单面单生成异常

// waybillType  运单类型0为未设置，1为手动，2为系统
export const WAYBILL_TYPE_NO = 0
export const WAYBILL_TYPE_HAND = 1
export const WAYBILL_TYPE_SYS = 2

export const ORDER_CHANGE_NOT = '290' //未换单
export const ORDER_CHANGE_USER = '291' //手动换单
export const ORDER_CHANGE_SYS = '292' //系统换单

export const ALL_ORDER_TOTAL = 'total' //全部订单
export const CHANGE_ORDER_TOTAL = '订单换单统计' //全部订单

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

export const ORDER_STATUS_ROUTE_LIST = {
  allOrder: [ALL_ORDER_TOTAL],
  pending: [WAYBILL_NOT_CREATE, WAIT_RELATION],
  waybillRequest: [WAIT_DISPATCH, WAYBILL_CREATING, WAYBILL_CREATE_ERROR],
  inOrder: [IN_DISPATCH],
  inProduction: [IN_PRODUCTION],
  delivered: [DELIVER],
  expired: [EXPIRED],
  cancelled: [CANCEL],
  returnGoods: [RETURN_GOODS],
  changeOrder: [CHANGE_ORDER_TOTAL]
}

export const ORDER_STATUS_COLOR = {
  [WAIT_RELATION]: '#909399',
  [WAIT_GENERATE_WAYBILL]: '#909399',
  [EXPIRED]: '#ec3636',
  [WAIT_DISPATCH]: '#909399',
  [IN_DISPATCH]: '#3A71A8',
  [IN_PRODUCTION]: '#3841DB',
  [DELIVER]: '#13ce66',
  [RETURN_GOODS]: '#ec3636',
  [CANCEL]: '#ffba00',
  [FINISH]: '#13ce66'
}

export const WAYBILL_CODE_UPLOADED_YES = 1 // 订单组运单号全部上传
export const WAYBILL_CODE_UPLOADED_NO = 0 // 订单组运单号未全部上传

export const ATTACHMENT_UPLOAD = 1 // 订单组上传附件
export const ATTACHMENT_UN_UPLOAD = 0 // 订单组未上传附件

export const FILTER_DATA = {}

export const MENU_TYPE = 1 // '业务端'
