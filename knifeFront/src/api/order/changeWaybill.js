
import request from '@/service/request'

export function changeWaybill(data) {
  return request({
    url: '/order/order/changeWaybill',
    method: 'post',
    data
  })
}