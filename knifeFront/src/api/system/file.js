
import request from '@/service/request'
// 上传文件
export function systemFileUpload(data) {
  return request({
    url: '/system/file/upload',
    method: 'post',
    ...data
  })
}


export function orderGroupFileUpload(data) {
  return request({
    url: '/order/importGroup/uploadWaybill',
    method: 'post',
    ...data
  })
}


