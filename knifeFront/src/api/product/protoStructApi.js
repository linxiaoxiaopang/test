import request from '@/service/request'

export function list(params) {
  return request({
    url: '/api/prim_prod/prim_struct/',
    method: 'get',
    params
  })
}

export function getListByProtoId(id) {
  return request({
    url: `/api/prim_prod/prim_struct/?prim_prod=${id}`,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/api/prim_prod/prim_struct/',
    method: 'post',
    data
  })
}

export function read(data) {
  return request({
    url: `/api/prim_prod/prim_struct/${data}/`,
    method: 'get',
    data
  })
}

export function edit(id, data) {
  return request({
    url: '/api/prim_prod/prim_struct/' + id + '/',
    method: 'patch',
    data
  })
}

export function del(id) {
  return request({
    url: '/api/prim_prod/prim_struct/' + id + '/',
    method: 'delete'
  })
}
