import request from '@/service/request'

export function cancell(data) {
  return request({
    url: '/order/order/cancel',
    method: 'post',
    data
  })
}