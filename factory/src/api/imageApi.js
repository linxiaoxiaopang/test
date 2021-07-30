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

export function bulkAddCategory(data, config) {
  return request({
    url: '/api/image/image/bulk_add_category/',
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

export function updateImage(id, data) {
  return request({
    url: `/api/image/image/${id}/change_images/`,
    method: 'patch',
    data
  })
}


export function del(id) {
  return request({
    url: '/api/image/image/' + id + '/',
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

export function check(data) {
  return request({
    url: '/api/image/image/check_img/',
    method: 'post',
    data
  })
}