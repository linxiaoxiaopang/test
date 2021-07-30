import request from '@/service/request'

export function listData(data) {
  return request({
    url: '/order/order/list',
    method: 'post',
    data
  })
}
export function listUpdate(data) {
  return request({
    url: '/order/order/update',
    method: 'post',
    data
  })
}

export function productData(data) {
  return request({
    url: '/order/orderItem/list',
    method: 'post',
    data
  })
}

export function sendFactory(data) {
  return request({
    url: '/order/order/sendToFactory',
    method: 'post',
    data
  })
}
