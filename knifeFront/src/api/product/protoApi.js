import request from '@/service/request'
//原型分类
export function list(id) {
  return request({
    url: `/api/prim_prod/selling_prim_product/${id}/`,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/api/prim_prod/front/prim_product/',
    method: 'post',
    data
  })
}



export function read(data) {
  return request({
    url: `/api/prim_prod/front/prim_product/${data}/`,
    method: 'get',
    data
  })
}

export function edit(id, data) {
  return request({
    url: '/api/prim_prod/front/prim_product/' + id + '/',
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: '/api/prim_prod/front/prim_product/' + id + '/',
    method: 'delete'
  })
}




