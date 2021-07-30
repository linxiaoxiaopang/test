import request from '@/service/request'
import store from '@/store'

//物流api
export function list(data = {}) {
  return request({
    url: '/system/expressCompany/list/',
    method: 'post',
    data
  })
}

export async function add(data) {
  // eslint-disable-next-line no-undef
  let [err, res] = await awaitWrap(request({
    url: '/system/expressCompany/complexCreate',
    method: 'post',
    data
  }))
  store.dispatch('RefreshDic', 'category')
  return res
}

export function detail(data) {
  return request({
    url: `api/order/fedex/${data}`,
    method: 'get',
    data
  })
}

export async function edit(id, data) {
  data.id = id
  // eslint-disable-next-line no-undef
  let [err, res] = await awaitWrap(request({
    url: '/system/expressCompany/update',
    method: 'post',
    data
  }))
  store.dispatch('RefreshDic', 'category')
  return res
}

export async function del(id) {
  const data = {
    idList: [id]
  }
  // eslint-disable-next-line no-undef
  let [err, res] = await awaitWrap(request({
    url: '/system/expressCompany/delete',
    method: 'post',
    data
  }))
  store.dispatch('RefreshDic', 'category')
  return res
}
