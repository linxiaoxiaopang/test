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

export const WAYBILL_CODE_UPLOADED_YES = 1 // 订单组运单号全部上传
export const WAYBILL_CODE_UPLOADED_NO = 0 // 订单组运单号未全部上传

export const ORDER_UN_EXPORTED = 0
export const ORDER_EXPORTED = 1

export const ATTACHMENT_UPLOAD = 1 // 订单组上传附件
export const ATTACHMENT_UN_UPLOAD = 0 // 订单组未上传附件

export const FILTER_DATA = {}

export const PIC_ENABLE = 0
export const PIC_DISABLE = 1

export const PIC_DISABLE_LIST = {
  [PIC_ENABLE]: '启用',
  [PIC_DISABLE]: '禁用'
}

export const PIC_SHELVES_LIST = {
  [PIC_ENABLE]: '上架',
  [PIC_DISABLE]: '下架'
}

export const MENU_TYPE = 0 //后台端

//首重
export const FRIST_WEIGHT = 1

//同重
export const SAME_WEIGHT = 2

// 表格 - 首重excel的key
export const FRIST_WEIGHT_ORDER_KEYS = {
  twoCharCode: ['国家（二字码，中文） ', '国家'],
  startWeight: ['开始重量(g）（*必填）', '开始重量(g）', '开始重量(g)'],
  endWeight: ['结束重量（g) (*必填）', '结束重量（g)'],
  firstWeight: ['首重/起重（g）'],
  firstFreight: ['首重/起重运费（￥）'],
  continuedWeight: ['续重单位重量（g）（*必填）', '续重单位重量（g）'],
  continuedFreight: ['单价（￥）（*必填）', '单价（￥）']
}
