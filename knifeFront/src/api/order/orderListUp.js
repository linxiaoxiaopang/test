import request from '@/service/request'
export function uploadFile(data) {
  return request({
    url: '/order/order/uploadFile',
    method: 'post',
    ...data
  })
}
export function systemUploadFile(data) {
  return request({
    url: '/system/file/upload',
    method: 'post',
    ...data
  })
}
