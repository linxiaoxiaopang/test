import request from '@/service/request'

//关联订单
// 获取内部sku
export function associate(data = {}) {
  return request({
    url: '/api/product/spec_prod?',
    method: 'get',
    data
  })
}
// 更新数据
