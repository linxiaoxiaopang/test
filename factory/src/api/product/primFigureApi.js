import request from '@/service/request'

export function list(params) {
  return request({
    url: '/api/prim_prod/prim_figure/',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: '/api/prim_prod/prim_figure/',
    method: 'post',
    data
  })
}

export function read(data) {
  return request({
    url: `/api/prim_prod/prim_figure/${data}/`,
    method: 'get',
    data
  })
}

export function edit(id, data) {
  return request({
    url: '/api/prim_prod/prim_figure/' + id + '/',
    method: 'patch',
    data
  })
}

export function del(id) {
  return request({
    url: '/api/prim_prod/prim_figure/' + id + '/',
    method: 'delete'
  })
}

export function bulkDel(data) {
  return request({
    url: '/api/image/image/bulk_delete/',
    method: 'delete',
    data
  })
}
