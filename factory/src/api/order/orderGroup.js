
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






