import request from '@/service/request'

export function initData(url, method = 'get', data = {}) {
  const o = {
    url: url.replace(/\/$/, '').replace(/\/\?/, '?'),
    method
  }

  console.log('method', method)
  if (method.toUpperCase() === 'GET') {
    o.params = data
  }
  if (method.toUpperCase() === 'POST') {
    o.data = data
  }
  return request(o)
}
