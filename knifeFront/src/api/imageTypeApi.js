import request from '@/service/request'
import store from '@/store'

export function list(params) {
  return request({
    url: '/api/image/image_category/',
    method: 'get',
    params
  })
}

export async function add(data) {
  // eslint-disable-next-line no-undef
  let [err, res] = await awaitWrap(request({
    url: '/api/image/image_category/',
    method: 'post',
    data
  }))
  store.dispatch('RefreshDic', 'category')
  return res
}

export function read(data) {
  return request({
    url: `/api/image/image_category/${data}/`,
    method: 'get',
    data
  })
}

export async function edit(id, data) {
  // eslint-disable-next-line no-undef
  let [err, res] = await awaitWrap(request({
    url: '/api/image/image_category/' + id + '/',
    method: 'patch',
    data
  }))
  store.dispatch('RefreshDic', 'category')
  return res
}

export async function del(id) {
  // eslint-disable-next-line no-undef
  let [err, res] = await awaitWrap(request({
    url: '/api/image/image_category/' + id + '/',
    method: 'delete'
  }))
  store.dispatch('RefreshDic', 'category')
  return res
}
