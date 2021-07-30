import request from '@/service/request'

export function coordinateList(params) {
  return request({
    url: '/api/prim_prod/fac_prim_product',
    method: 'get',
    params
  })
}