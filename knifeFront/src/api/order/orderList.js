
import request from '@/service/request'
//列表数据
export function list(data) {
  return request({
    url: '/order/order/list',
    method: 'post',
    data
  })
}


//列表数据
export function getAllOrderCode() {
  return request({
    url: '/order/order/getAllOrderCode',
    method: 'post'
  })
}






