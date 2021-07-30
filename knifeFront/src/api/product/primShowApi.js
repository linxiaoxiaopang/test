import request from '@/service/request'

export function list(params) {
  return request({
    url: '/api/prim_prod/prim_show_img/',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: '/api/prim_prod/create_show_info/',
    method: 'post',
    data
  })
}

export function change(data) {
  return request({
    url: '/api/prim_prod/change_show_mask/',
    method: 'post',
    data
  })
}

export function read(data) {
  return request({
    url: `/api/prim_prod/prim_show_img/${data}/`,
    method: 'get',
    data
  })
}

export function edit(id, data) {
  return request({
    url: '/api/prim_prod/prim_show_img/' + id + '/',
    method: 'patch',
    data
  })
}

export function del(id) {
  return request({
    url: '/api/prim_prod/prim_show_img/' + id + '/',
    method: 'delete'
  })
}
