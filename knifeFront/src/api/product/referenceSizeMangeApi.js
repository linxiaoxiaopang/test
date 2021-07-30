import request from '@/service/request'
//产品分类
export function list(params) {
  return request({
    url: '/api/prod_design/base_size_design',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: '/api/prod_design/base_group_design',
    method: 'post',
    data
  })
}

export function read(data) {
  return request({
    url: `/api/prod_design/base_group_design${data}/`,
    method: 'get',
    data
  })
}

export function edit(id, data) {
  return request({
    url: '/api/prod_design/base_group_design' + id + '/',
    method: 'put',
    data
  })
}

export function bulkEdit(data) {
  return request({
    url: '/api/prod_design/base_group_design/bulk_edit',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/api/prod_design/base_group_design' + id + '/',
    method: 'delete'
  })
}
