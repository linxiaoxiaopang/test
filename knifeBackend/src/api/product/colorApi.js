import request from '@/service/request'
import store from '@/store'

export function list(params) {
  return request({
    url: '/api/prim_prod/prim_color/',
    method: 'get',
    params
  })
}

export async function add(data) {
  // eslint-disable-next-line no-undef
  let [err, res] = await awaitWrap(request({
    url: '/api/prim_prod/prim_color/',
    method: 'post',
    data
  }))
  store.dispatch('RefreshDic', 'prim_color')
  return res
}

export function read(data) {
  return request({
    url: `/api/prim_prod/prim_color/${data}/`,
    method: 'get',
    data
  })
}

export async function edit(id, data) {
  // eslint-disable-next-line no-undef
  let [err, res] = await awaitWrap(request({
    url: `/api/prim_prod/prim_color/${id}`,
    method: 'patch',
    data
  }))
  store.dispatch('RefreshDic', 'prim_color')
  return res
}

export async function del(id) {
  // eslint-disable-next-line no-undef
  let [err, res] = await awaitWrap(request({
    url: '/api/prim_prod/prim_color/' + id + '/',
    method: 'delete'
  }))
  store.dispatch('RefreshDic', 'prim_color')
  return res
}
