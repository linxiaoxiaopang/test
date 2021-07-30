import request from '@/service/request'

// 获取所有的菜单树
export function getMenuTree() {
  return request({
    url: 'api/rbac/menu/tree/',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/rbac/menus/',
    method: 'post',
    data
  })
}

export function bulkAdd(data) {
  return request({
    url: '/api/rbac/menus/bulk_create/',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/rbac/menus/' + id + '/',
    method: 'delete'
  })
}

export function edit(id, data) {
  return request({
    url: 'api/rbac/menus/' + id + '/',
    method: 'put',
    data
  })
}

export function update(id, data) {
  return request({
    url: 'api/rbac/menus/' + id + '/',
    method: 'patch',
    data
  })
}

export function retrieve(id) {
  return request({
    url: 'api/rbac/menus/' + id + '/',
    method: 'get'
  })
}

export function save(id, data) {
  return request({
    url: 'api/rbac/menus/' + id + '/',
    method: 'patch',
    data
  })
}
