import request from '@/service/request'

export function list(params) {
  return request({
    url: '/api/product/product/',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: '/api/product/product/',
    method: 'post',
    data
  })
}

export function read(data) {
  return request({
    url: `/api/product/product/${data}/`,
    method: 'get',
    data
  })
}

export function edit(id, data) {
  return request({
    url: '/api/product/product/' + id + '/',
    method: 'patch',
    data
  })
}

export function del(id) {
  return request({
    url: '/api/product/product/' + id + '/',
    method: 'delete'
  })
}
