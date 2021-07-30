import request from '@/service/request'

export function detail(params) {
  return request({
    url: '/api/product/back_prim_prod/' + params.id + '/',
    method: 'get',
    params
  })
}

export function getDetail(params) {
  return request({
    url: '/api/product/back_prim_prod/',
    method: 'get',
    params
  })
}
