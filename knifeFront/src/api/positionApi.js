import request from '@/service/request'

//获取职位列表
export function list(data) {
  return request({
    url: '/api/position/',
    method: 'get',
    data
  })
}

//创建职位信息列表

export function add(data) {
  return request({
    url: '/api/position/',
    method: 'post',
    data
  })
}

//编辑职位信息列表
export function edit(id, data) {
  return request({
    url: '/api/position/' + id + '/',
    method: 'put',
    data
  })
}
//删除职位信息列表
export function del(id) {
  return request({
    url: 'api/position/' + id + '/',
    method: 'delete'
  })
}