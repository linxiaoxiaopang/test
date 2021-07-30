import request from '@/service/request'

// 订单物流 列表
export function waybillList(data) {
  return request({
    url: '/order/waybillTrackingRecord/list',
    method: 'post',
    data
  })
}

// 订单物流信息
export function waybillInfo(data) {
  return request({
    url: '/order/waybillTrackingRecord/getById',
    method: 'post',
    data
  })
}