import request from '@/service/request'

export function supplier_list(params) {
  return request({
    url: '/api/rbac/supplier',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: '/api/rbac/supplier',
    method: 'post',
    data
  })
}

export function edit(id, data) {
  return request({
    url: `/api/rbac/supplier/${id}`,
    method: 'put',
    data
  })
}

export function read(id) {
  return request({
    url: `/api/rbac/supplier/${id}`,
    method: 'get'
  })
}

export function supplier(params) {
  return request({
    url: '/api/rbac/common_users?main_user_by_role=供应商',
    method: 'get',
    params
  })
}
