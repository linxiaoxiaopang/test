import request from '@/service/request'

export function list(params) {
  return request({
    url: '/api/image/image/',
    method: 'get',
    params
  })
}

export function ownerList(params) {
  return request({
    url: '/api/image/owner_image/',
    method: 'get',
    params
  })
}

export function add(data, config) {
  return request({
    url: '/api/image/image/',
    method: 'post',
    data,
    ...config
  })
}

export function read(data) {
  return request({
    url: `/api/image/image/${data}/`,
    method: 'get',
    data
  })
}

export function edit(id, data) {
  return request({
    url: '/api/image/image/' + id + '/',
    method: 'put',
    data
  })
}

export function disable(data) {
  return request({
    url: '/api/image/image/disable',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/api/image/image/' + id + '/',
    method: 'delete'
  })
}

export function bulkShare(data) {
  return request({
    url: '/api/image/image/bulk_share/',
    method: 'post',
    data
  })
}

export function bulkCreate(data) {
  return request({
    url: '/api/image/image/bulk_create/',
    method: 'post',
    data
  })
}

export function bulkEdit(data) {
  return request({
    url: '/api/image/image/bulk_add_category',
    method: 'post',
    data
  })
}

export function check(data) {
  return request({
    url: '/api/image/image/check_img/',
    method: 'post',
    data
  })
}
