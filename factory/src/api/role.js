import request from '@/service/request'

// 获取所有的Role
export function getRoles() {
  return request({
    url: '/api/rbac/roles/',
    method: 'get'
  })
}

export function getSelectedRoles() {
  return request({
    url: '/api/rbac/roles/get_roles/',
    method: 'get'
  })
}

export function matchRoles(id, data) {
  return request({
    url: `/api/rbac/match_roles/${id}/`,
    method: 'patch',
    data
  })
}

export function add(data) {
  return request({
    url: '/api/rbac/roles/',
    method: 'post',
    data
  })
}

export function read(data) {
  return request({
    url: '/api/rbac/roles/' + data + '/',
    method: 'get'
  })
}

export function del(id) {
  return request({
    url: '/api/rbac/roles/' + id + '/',
    method: 'delete'
  })
}

export function edit(id, data) {
  return request({
    url: '/api/rbac/roles/' + id + '/',
    method: 'put',
    data
  })
}

export function update(id, data) {
  return request({
    url: '/api/rbac/roles/' + id + '/',
    method: 'patch',
    data
  })
}

export function retrieve(id) {
  return request({
    url: '/api/rbac/roles/' + id + '/',
    method: 'get'
  })
}

export function save(id, data) {
  return request({
    url: '/api/rbac/roles/' + id + '/',
    method: 'patch',
    data
  })
}
