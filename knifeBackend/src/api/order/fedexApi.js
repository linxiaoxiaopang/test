import request from '@/service/request'
//物流公司
export function list(data = {}) {
  return request({
    url: '/system/expressCompany/list/',
    method: 'post',
    data
  })
}
