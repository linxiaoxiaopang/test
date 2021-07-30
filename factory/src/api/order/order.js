import request from '@/service/request'

// 订单分组 - 创建一条
export function orderGroupCreate(data) {
  return request({
    url: '/order/importGroup/create',
    method: 'post',
    data
  })
}

// 订单分组 - 更新一条
export function orderGroupUpdate(data) {
  return request({
    url: '/order/importGroup/update',
    method: 'post',
    data
  })
}

// 订单 - 批量创建数据记录
export function orderBatchCreate(data) {
  return request({
    url: '/order/order/batchCreate',
    method: 'post',
    data
  })
}

// 订单 - 批量更新数据记录
export function orderBatchUpdate(data) {
  return request({
    url: '/order/order/batchUpdate',
    method: 'post',
    data
  })
}

// 订单 - 更新一条
export function orderUpdate(data) {
  return request({
    url: '/order/order/update',
    method: 'post',
    data
  })
}

// 订单 - 列表
export function orderList(data) {
  return request({
    url: '/order/order/list',
    method: 'post',
    data
  })
}

// 订单导出
export function orderExport(idList, isFirstExport) {
  return request({
    url: '/order/order/export',
    method: 'post',
    responseType: 'blob',
    // 必须传空json {}
    data: {
      idList,
      isFirstExport,
      exportType: 3
    }
  })
}

// 根据运单号查询生产中订单
export function getOrderByWaybill(data) {
  return request({
    url: '/order/order/getOrderByWaybill',
    method: 'post',
    data
  })
}

// 发货查询
export function getDeliveryList(data) {
  const { importTime } = data
  if (importTime) {
    data.importStartTime = importTime + ' 00:00:00'
    data.importEndTime = importTime + ' 23:59:59'
    delete data.importTime
  }
  return request({
    url: '/order/order/deliveryList',
    method: 'post',
    data
  })
}

// 发货查询-统计
export function getDeliveryOfStatistical(data) {
  return request({
    url: '/order/order/deliveryOfStatistical',
    method: 'post',
    data
  })
}

// 发货查询-出库统计
export function getOutboundStatistics(data) {
  return request({
    url: '/order/order/outboundStatistics',
    method: 'post',
    data
  })
}
