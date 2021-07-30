import request from '@/service/request'

export function list(params) {
  return request({
    url: '/api/create_kl_prod/',
    method: 'get',
    params
  })
}

export function getSizesAndPsds(id) {
  return request({
    url: `/api/product/get_size_info/?id=${id}`,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/api/create_kl_prod/',
    method: 'post',
    data
  })
}

export function stardandAdd(data) {
  return request({
    url: '/api/base_kl_prod/',
    method: 'post',
    data
  })
}

export function createStardandSize(data) {
  return request({
    url: '/api/prim_prod/size_base/',
    method: 'post',
    data
  })
}

export function scanOut(data) {
  return request({
    url: '/api/order/factory/scan/',
    method: 'post',
    data
  })
}

export function scanSearch(params) {
  return request({
    url: '/api/order/factory/scan/',
    method: 'get',
    params
  })
}

export function bulkCreate(data) {
  return request({
    url: '/api/create_kl_prod/upload/',
    method: 'post',
    data
  })
}

export function examineOrder(data) {
  return request({
    url: '/api/order/examine_order/',
    method: 'post',
    data
  })
}

export function bulkEdit(id, data) {
  return request({
    url: '/api/create_kl_prod/' + id + '/edit/',
    method: 'patch',
    data
  })
}

export function read(data) {
  return request({
    url: `/api/create_kl_prod/${data}/`,
    method: 'get',
    data
  })
}

export function edit(id, data) {
  return request({
    url: '/api/create_kl_prod/' + id + '/',
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: '/api/create_kl_prod/' + id + '/',
    method: 'delete'
  })
}

export function delItem(id) {
  return request({
    url: `/api/order/item/${id}/`,
    method: 'delete'
  })
}

export function bulkDelItem(data) {
  return request({
    url: '/api/order/item/bulk_delete/',
    method: 'delete',
    data
  })
}

export function cancel(id) {
  return request({
    url: '/api/create_kl_prod/' + id + '/cancel/',
    method: 'patch'
  })
}

export function cancelSend(data) {
  return request({
    url: `/api/create_kl_prod/${data}/cancel_send/`,
    method: 'patch'
  })
}

export function delProduct(id) {
  return request({
    url: '/api/order/item/' + id + '/',
    method: 'delete'
  })
}

export function changeWaybill(id, data) {
  console.log('data', data)
  return request({
    url: `/api/create_kl_prod/${id}/change_waybill/`,
    method: 'patch',
    data
  })
}

export function bulkDel(data) {
  return request({
    url: '/api/create_kl_prod/bulk_delete/',
    method: 'delete',
    data
  })
}

export function overdue(data) {
  return request({
    url: '/api/order/overdue_order/',
    method: 'get',
    data
  })
}

//获取所有运单号

export function allWaybill(data) {
  return request({
    url: 'api/order/all_waybill/',
    method: 'get',
    data
  })
}

//获取所有订单号
export function allOrderCode(data) {
  return request({
    url: '/api/order/all_order_code/',
    method: 'get',
    data
  })
}

//获取所有订单号
export function allFedex(data) {
  return request({
    url: '/api/order/all_fedex/',
    method: 'get',
    data
  })
}

//校验SKU
export function checkSku(data) {
  return request({
    url: '/api/order/check_sku/',
    method: 'post',
    data
  })
}

export function getReport(url, params) {
  return request({
    url,
    method: 'get',
    params
  })
}

//下架
export function bulkOff(data) {
  return request({
    url: '/api/prim_prod/prim_product/bulk_off/',
    method: 'post',
    data
  })
}

//恢復上架
export function putOn(data) {
  return request({
    url: '/api/prim_prod/prim_product/put_on/',
    method: 'post',
    data
  })
}

export function waitToputOn(data) {
  return request({
    url: '/api/prim_prod/check_perfect_info/',
    method: 'post',
    data
  })
}


export function bulkChangeProd(data) {
  return request({
    url: '/api/prim_prod/change_prod_category/',
    method: 'post',
    data
  })
}

export function getProductData(params) {
  return request({
    url: '/api/prim_prod/get_prod_info/',
    method: 'get',
    params
  })
}