
import request from '@/service/request'
//物流公司
export function list(data = {}) {
  return request({
    url: '/system/expressCompany/list/',
    method: 'post',
    data
  })
}
// 选择物流方式
export function expressBatchUpdate(data = {}) {
  return request({
    url: '/order/order/orderExpressBatchUpdate',
    method: 'post',
    data
  })
}

