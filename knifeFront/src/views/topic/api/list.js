import request from '@/service/request'

export function list(params = {}) {
  return request({
    url: '/api/prim_prod/tourist_prim_product/?size=10',
    method: 'get',
    params
  })
}
