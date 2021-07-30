import request from '@/service/request'

//尺码分类api

export function list(data) {
  return request({
    url: '/api/prod_cate/',
    method: 'get',
    data
  })
}

export function add(data) {
  return request({
    url: '/api/prod_cate/',
    method: 'post',
    data
  })
}

export function read(data) {
  return request({
    url: `/api/prod_cate/${data}`,
    method: 'get',
    data
  })
}

export function detail(data) {
  return request({
    url: `/api/prod_cate/${data}`,
    method: 'get',
    data
  })
}

export function edit(id, data) {
  return request({
    url: '/api/prod_cate/' + id + '/',
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: '/api/prod_cate/' + id + '/',
    method: 'delete'
  })
}

export function allStruct(params) {
  return request({
    url: '/api/prim_prod/fac_category/prod_struct',
    method: 'get',
    params
  })
}

export function update(data) {
  return request({
    url: '/api/prim_prod/fac_category/add_struct',
    method: 'post',
    data
  })
}

export function group(params) {
  return request({
    url: '/api/order/batch_group/',
    method: 'get',
    params
  })
}
