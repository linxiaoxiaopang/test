import request from '@/service/request'

// 寄达国家列表
export function complexOpenList() {
  return request({
    url: '/system/countryCode/complexOpenList',
    method: 'post',
    data: {}
  })
}

// 根据国家获取物流渠道列表
export function waybillSupportListByCountry(data) {
  return request({
    url: '/order/order/waybillSupportListByCountry',
    method: 'post',
    data
  })
}