import request from '@/service/request'

// 获取所有的权限树
export function getPermissionTree() {
  return request({
    url: 'api/rbac/permission/tree/',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/rbac/permissions/',
    method: 'post',
    data
  })
}

export function addChilds(id, data) {
  return request({
    url: `/api/rbac/permissions/${id}/add_childs/`,
    method: 'put',
    data
  })
}

//获取批量数据
export function bulkGet(data = {}) {
  return request({
    url: '/api/rbac/permissions/bulk_get/',
    method: 'get',
    data
  })
}

export function bulkAdd(data) {
  return request({
    url: '/api/rbac/permissions/bulk_create/',
    method: 'post',
    data
  })
}

export function javaBulkAdd(data) {
  return request({
    url: '/api/common/perms_manage',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/rbac/permissions/' + id + '/',
    method: 'delete'
  })
}

export function edit(id, data) {
  return request({
    url: 'api/rbac/permissions/' + id + '/',
    method: 'put',
    data
  })
}

export function update(id, data) {
  return request({
    url: 'api/rbac/permissions/' + id + '/',
    method: 'patch',
    data
  })
}

export function retrieve(id) {
  return request({
    url: 'api/rbac/permissions/' + id + '/',
    method: 'get'
  })
}

export function save(id, data) {
  return request({
    url: 'api/rbac/permissions/' + id + '/',
    method: 'patch',
    data
  })
}
