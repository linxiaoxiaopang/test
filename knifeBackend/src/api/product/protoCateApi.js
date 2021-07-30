import request from '@/service/request'
import store from '@/store'

export function list(params) {
  return request({
    url: '/api/prim_prod/product_category/',
    method: 'get',
    params
  })
}

export async function add(data) {
  // eslint-disable-next-line no-undef
  let [err, res] = await awaitWrap(request({
    url: '/api/prim_prod/product_category/',
    method: 'post',
    data
  }))
  store.dispatch('RefreshDic', 'proCategory')
  return res
}

export function read(data) {
  return request({
    url: `/api/prim_prod/product_category/${data}/`,
    method: 'get',
    data
  })
}

export async function edit(id, data) {
  // eslint-disable-next-line no-undef
  let [err, res] = await awaitWrap(request({
    url: '/api/prim_prod/product_category/' + id + '/',
    method: 'patch',
    data
  }))
  store.dispatch('RefreshDic', 'proCategory')
  return res
}

export async function del(id) {
  // eslint-disable-next-line no-undef
  let [err, res] = await awaitWrap(request({
    url: '/api/prim_prod/product_category/' + id + '/',
    method: 'delete'
  }))
  store.dispatch('RefreshDic', 'proCategory')
  return res
}
