import request from '@/service/request'

export function list(params) {
  return request({
    url: '/api/prim_prod/prim_product/',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: '/api/prim_prod/prim_product/',
    method: 'post',
    data
  })
}

export function createProto(data) {
  return request({
    url: '/api/prim_prod/prim_prod_info/create_complete_product/',
    method: 'post',
    data
  })
}

export function read(data) {
  return request({
    url: `/api/prim_prod/prim_product/${data}/`,
    method: 'get',
    data
  })
}

export function edit(id, data) {
  return request({
    url: '/api/prim_prod/prim_product/' + id + '/',
    method: 'patch',
    data
  })
}

export function del(id) {
  return request({
    url: '/api/prim_prod/prim_product/' + id + '/',
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

export function createGripKnife(data) {
  return request({
    url: '/api/prim_prod/upload_coord_img/',
    method: 'post',
    data
  })
}

export function changeGripKnife(data) {
  return request({
    url: '/api/prim_prod/change_coord_img/',
    method: 'post',
    data
  })
}
