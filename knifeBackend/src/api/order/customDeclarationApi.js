import request from '@/service/request'

export function listData(params) {
  return request({
    url: '/api/image/image/',
    method: 'post',
    params
  })
}
