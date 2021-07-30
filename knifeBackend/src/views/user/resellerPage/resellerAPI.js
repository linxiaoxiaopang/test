import request from '@/service/request'

export function subAccount(params) {
  return request({
    url: `/api/rbac/common_users/child_user/`,
    method: 'get',
    params
  })
}

export function photoData(params) {
  return request({
    url: `/api/image/image/`,
    method: 'get',
    params
  })
}

export function getcategory(params) {
  return request({
    url: `/api/image/image_category/`,
    method: 'get',
    params
  })
}
export function getExpressMethod(data) {
  return request({
    url: `/system/expressShippingMethod/list/`,
    method: 'post',
    data
  })
}
// 
export function getDetail(params) {
  return request({
    url: '/api/product/back_prim_prod/' + params.id + '/',
    method: 'get',
    params
  })
}
