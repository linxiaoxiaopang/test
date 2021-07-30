import request from '@/service/request'
export function list(data) {
  return request({
    url: '/order/orderItem/list',
    method: 'post',
    data
  })
}
