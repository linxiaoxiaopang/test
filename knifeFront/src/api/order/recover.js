import request from '@/service/request'

export function recover(data) {
  return request({
    url: '/order/order/restore',
    method: 'post',
    data
  })
}