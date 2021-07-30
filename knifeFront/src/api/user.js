import request from '@/service/request'

export function add(data) {
  return request({
    url: '/api/rbac/common_users/',
    method: 'post',
    data
  })
}

export function employeeList(params) {
  return request({
    url: '/api/rbac/employee_list/',
    method: 'get',
    params
  })
}

export function subDistributor(data) {
  return request({
    url: `/api/rbac/common_users/${data}/sub_distributor/`,
    method: 'get',
    data
  })
}
export function read(data) {
  return request({
    url: '/api/rbac/common_users/' + data + '/',
    method: 'get'
  })
}

export function del(id) {
  return request({
    url: '/api/rbac/common_users/' + id + '/',
    method: 'delete'
  })
}

export function edit(id, data) {
  return request({
    url: '/api/rbac/common_users/' + id + '/',
    method: 'put',
    data
  })
}

export function update(id, data) {
  return request({
    url: '/api/rbac/common_users/' + id + '/',
    method: 'patch',
    data
  })
}

export function resetPassword(id, data) {
  return request({
    url: `/api/rbac/common_users/${id}/reset_password/`,
    method: 'patch',
    data
  })
}

export function changePassword(data) {
  return request({
    url: '/api/rbac/common_users/change_password',
    method: 'patch',
    data
  })
}

export function updateAdminType(id, data) {
  return request({
    url: '/api/rbac/common_users/admin_type/',
    method: 'patch',
    data
  })
}

export function updatePasswd(data) {
  return request({
    url: '/api/rbac/common_users/change_password/',
    method: 'patch',
    data
  })
}

export function reportUser(data) {
  return request({
    url: '/api/order/report_user/',
    method: 'get',
    data
  })
}

export function getChildUser(params) {
  return request({
    url: '/api/rbac/common_users/child_user',
    method: 'get',
    params
  })
}