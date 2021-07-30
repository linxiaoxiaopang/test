import request from '@/service/request'

export function returnGoods(data) {
  return request({
    url: '/order/order/returnGoods',
    method: 'post',
    data
  })
}