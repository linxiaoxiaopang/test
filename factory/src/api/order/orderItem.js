
import request from '@/service/request'


// 订单 - 列表
export function orderItemList(data) {
  return request({
    url: '/order/orderItem/list',
    method: 'post',
    data
  })
}






