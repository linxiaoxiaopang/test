import request from '@/service/request'

export function createKnifeReference(data) {
  return request({
    url: '/api/check_prod/check_spec',
    method: 'post',
    data
  })
}

export function getKnifeReference(params) {
  return request({
    url: '/api/check_prod/check_spec',
    method: 'get',
    params
  })
}

export function checkPass(data) {
  return request({
    url: '/api/check_prod/check_pass',
    method: 'post',
    data
  })
}

export function baseSizeInfo(id) {
  return request({
    url: `/api/check_prod/base_info?id=${id}`,
    method: 'get'
  })
}

export function showDesignInfo(params) {
  return request({
    url: '/api/prim_prod/show_design_info/',
    method: 'get',
    params
  })
}

export function baseDetail(data) {
  return request({
    url: `/api/prim_prod/base_kl_info/?id=${data}`,
    method: 'get'
  })
}

export function checkStructPass(data) {
  return request({
    url: '/api/check_prod/check_struct_pass',
    method: 'post',
    data
  })
}
