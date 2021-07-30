import request from '@/service/request'

//添加国家
export function addCounrty(data) {
  return request({
    url: '/system/countryCode/complexCreate',
    method: 'post',
    data
  })
}

//删除国家
export function deleteCounrty(data) {
  return request({
    url: '/system/countryCode/complexDelete',
    method: 'post',
    data
  })
}

//更新国家
export function updateCounrty(data) {
  return request({
    url: '/system/countryCode/complexUpdate',
    method: 'post',
    data
  })
}

//获取国家列表
export function getCounrty(data) {
  return request({
    url: '/system/countryCode/complexList',
    method: 'post',
    data
  })
}
