import request from '@/service/request'

//订单api

export function list(params) {
  return request({
    url: '/api/order/order/',
    method: 'get',
    params
  })
}

export function ownerList(params) {
  return request({
    url: '/api/order/order/owner/',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: '/api/order/order/',
    method: 'post',
    data
  })
}

export function scanOut(data) {
  return request({
    url: '/order/order/sendOut',
    method: 'post',
    data
  })
}

export function scanSearch(data) {
  return request({
    url: '/order/order/getOrderByWaybill',
    method: 'post',
    data
  })
}

export function bulkScanSearch(data) {
  return request({
    url: '/api/order/batch_query_order/',
    method: 'post',
    data
  })
}


export function bulkCreate(data) {
  return request({
    url: '/api/order/order/upload/',
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
    url: '/api/order/order/' + id + '/edit/',
    method: 'patch',
    data
  })
}

export function read(data) {
  return request({
    url: `/api/order/order/${data}/`,
    method: 'get',
    data
  })
}

export function edit(id, data) {
  return request({
    url: '/api/order/order/' + id + '/',
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: '/api/order/order/' + id + '/',
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
    url: '/api/order/order/' + id + '/cancel/',
    method: 'patch'
  })
}

export function cancelSend(data) {
  return request({
    url: `/api/order/order/${data}/cancel_send/`,
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
    url: `/api/order/order/${id}/change_waybill/`,
    method: 'patch',
    data
  })
}

export function bulkDel(data) {
  return request({
    url: '/api/order/order/bulk_delete/',
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


export function modifyOrderList(params) {
  console.log('params', params)
  return request({
    url: '/api/order/super_order_detail/',
    method: 'get',
    params
  })
}

export function superEdit(data) {
  return request({
    url: '/api/order/super_order_detail/',
    method: 'post',
    data
  })
}

export function superBulkDelItem(data) {
  return request({
    url: '/api/order/super_order_item/',
    method: 'delete',
    data
  })
}


export function superDel(id) {
  return request({
    url: '/api/order/super_order_detail/' + id + '/',
    method: 'delete'
  })
}

export function modifyOrderUpdate(data) {
  return request({
    url: '/api/order/super_change_order/',
    method: 'post',
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

export function getReport (url, params) {
  return request({
    url,
    method: 'get',
    params
  })
}



//导出订单接口
//=================================================
//=================================================
//=================================================
export function exportFile (url, params) {
  return request({
    url,
    method: 'get',
    responseType: 'blob',
    params
  })
}
