import request from '@/service/request'

export function list(params) {
  return request({
    url: '/api/image/image_category/',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: '/api/image/image_category/',
    method: 'post',
    data
  })
}



export function read(data) {
  return request({
    url: `/api/image/image_category/${data}/`,
    method: 'get',
    data
  })
}

export function edit(id, data) {
  return request({
    url: '/api/image/image_category/' + id + '/',
    method: 'patch',
    data
  })
}

export function del(id) {
  return request({
    url: '/api/image/image_category/' + id + '/',
    method: 'delete'
  })
}





