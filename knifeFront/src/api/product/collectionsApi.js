import request from '@/service/request'
//产品分类
export function list(params) {
  return request({
    url: '/api/prim_prod/selling_prim_product/collections_prim_prod/',
    method: 'get',
    params
  })
}


export function add(data) {
  return request({
    url: '/api/prim_prod/selling_prim_product/add_collections/',
    method: 'post',
    data
  })
}

export function cancel(data) {
  return request({
    url: '/api/prim_prod/selling_prim_product/remove_collections/',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/api/create_spec_info/',
    method: 'post',
    data
  })
}

export function read(data) {
  return request({
    url: `/api/prim_prod/ selling_prim_product/collections_prim_prod/${data}/`,
    method: 'get',
    data
  })
}

export function detail(data) {
  return request({
    url: `/api/prim_prod/ selling_prim_product/collections_prim_prod/?id=${data}`,
    method: 'get'
  })
}


export function edit(id, data) {
  return request({
    url: '/api/prim_prod/ selling_prim_product/collections_prim_prod/' + id + '/',
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: '/api/prim_prod/ selling_prim_product/collections_prim_prod/' + id + '/',
    method: 'delete'
  })
}





