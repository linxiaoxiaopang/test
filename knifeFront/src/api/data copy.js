import request from '@/service/request'

// export function initData(url, params) {
//   return request({
//     url: url,
//     method: 'get',
//     params
//   })
// }

export function initData(url, data = {}) {
  return request({
    url: url,
    method: 'post',
    data
  })
}
