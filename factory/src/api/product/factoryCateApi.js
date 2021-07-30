import request from '@/service/request'

//工厂分类api

export function list(params) {
  return request({
    url: '/api/prim_prod/fac_category/',
    method: 'get',
    params
  })
}


export function allList(params) {
  return request({
    url: '/api/prim_prod/fac_category/cate/',
    method: 'get',
    params
  })
}


export function del(id) {
  return request({
    url: '/api/prim_prod/fac_category/' + id + '/',
    method: 'delete'
  })
}

export function add(data) {
  return request({
    url: '/api/prim_prod/fac_category/',
    method: 'post',
    data
  })
}

export function noCateList(data) {
  return request({
    url: '/api/prim_prod/fac_category/no_cate_struct/',
    method: 'get',
    data
  })
}

export function detail(data) {
  return request({
    url: `/api/prim_prod/fac_category/${data}`,
    method: 'get',
    data
  })
}

export function edit(id, data) {
  return request({
    url: '/api/prim_prod/fac_category/' + id + '/',
    method: 'put',
    data
  })
}
