import request from '@/service/request'
//产品分类
export function list(params) {
  return request({
    url: '/api/prim_prod/product_category/',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: '/api/prim_prod/product_category/',
    method: 'post',
    data
  })
}



export function read(data) {
  return request({
    url: `/api/prim_prod/product_category/${data}/`,
    method: 'get',
    data
  })
}

export function edit(id, data) {
  return request({
    url: '/api/prim_prod/product_category/' + id + '/',
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: '/api/prim_prod/product_category/' + id + '/',
    method: 'delete'
  })
}




