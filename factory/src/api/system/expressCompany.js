
import request from '@/service/request'

//物流公司
export function expressCompanyList(data = {}) {
  return request({
    url: '/system/expressCompany/list/',
    method: 'post',
    data
  })
}