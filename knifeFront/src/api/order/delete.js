import request from '@/service/request'

export function deleted(data) {
  return request({
    url: '/order/order/delete',
    method: 'post',
    data
  })
}