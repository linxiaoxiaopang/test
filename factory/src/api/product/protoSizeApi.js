import request from '@/service/request'

export function list(params) {
  return request({
    url: '/api/product/size_spec/',
    method: 'get',
    params
  })
}

export function getPsdBySize(params) {
  return request({
    url: '/api/product/size_spec/get_psd_file/',
    method: 'get',
    params
  })
}

export function getBasePsdByProtoId(params) {
  return request({
    url: '/api/prim_prod/size_base/get_psd_file/',
    method: 'get',
    params
  })
}



export function add(data) {
  return request({
    url: '/api/product/size_spec/',
    method: 'post',
    data
  })
}

export function read(data) {
  return request({
    url: `/api/product/size_spec/${data}/`,
    method: 'get',
    data
  })
}

export function edit(id, data) {
  return request({
    url: '/api/product/size_spec/' + id + '/',
    method: 'patch',
    data
  })
}

export function del(id) {
  return request({
    url: '/api/product/size_spec/' + id + '/',
    method: 'delete'
  })
}

export function setKlProd (data) {
  return request({
    url: 'api/set_kl_prod/',
    method: 'post',
    data
  })
}