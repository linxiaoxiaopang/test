import request from '@/service/request'

export function add(data) {
  return request({
    url: '/api/rbac/admin_users/',
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
    url: `/api/rbac/admin_users/${data}/sub_distributor/`,
    method: 'get',
    data
  })
}
export function read(data) {
  return request({
    url: '/api/rbac/admin_users/' + data + '/',
    method: 'get'
  })
}

export function del(id) {
  return request({
    url: '/api/rbac/admin_users/' + id + '/',
    method: 'delete'
  })
}

export function edit(id, data) {
  return request({
    url: '/api/rbac/admin_users/' + id + '/',
    method: 'put',
    data
  })
}

export function update(id, data) {
  return request({
    url: '/api/rbac/admin_users/' + id + '/',
    method: 'patch',
    data
  })
}

export function resetPassword(id, data) {
  return request({
    url: `/api/rbac/admin_users/${id}/reset_password/`,
    method: 'patch',
    data
  })
}

export function updateAdminType(id, data) {
  return request({
    url: '/api/rbac/admin_users/admin_type/',
    method: 'patch',
    data
  })
}

export function updatePasswd(data) {
  return request({
    url: '/api/rbac/admin_users/change_password/',
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
