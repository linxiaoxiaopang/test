import request from '@/service/request'

export function sendToFactoryBatch(data) {
  return request({
    url: '/order/sendToFactoryBatch/list',
    method: 'post',
    data
  })
}
