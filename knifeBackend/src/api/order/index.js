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

// 订单 - 复杂更新
export function orderComplexUpdate(data) {
  return request({
    url: '/order/order/complexUpdate',
    method: 'post',
    data
  })
}

// 订单子项 - 更新一条
export function orderItemUpdate(data) {
  return request({
    url: '/order/orderItem/update',
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

// 订单子项 - 列表
export function orderItemList(data) {
  return request({
    url: '/order/orderItem/list',
    method: 'post',
    data
  })
}

// 订单子项 - 批量添加
export function orderItembatchUpdate(data) {
  return request({
    url: '/order/orderItem/batchUpdate',
    method: 'post',
    data
  })
}

// 订单子项 - 添加
export function orderItemCreate(data) {
  return request({
    url: '/order/orderItem/create',
    method: 'post',
    data
  })
}

// 订单子项 - 删除一条
export function orderItemDel(data) {
  return request({
    url: '/order/orderItem/delete',
    method: 'post',
    data
  })
}

// 订单导出
export function exportForCustoms(data) {
  return request({
    url: '/order/order/exportForCustoms',
    method: 'post',
    responseType: 'blob',
    data
  })
}
