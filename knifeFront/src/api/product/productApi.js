import request from '@/service/request'
import store from '@/store'

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

// 内部sku 列表
export function getSysSkuList(params) {
  return request({
    url: '/api/product/spec_prod',
    method: 'get',
    params
  })
}

// 外部sku 列表
export function getUserSkuList(params) {
  return request({
    url: '/api/product/sku_map',
    method: 'get',
    params
  })
}

// 校验组件
export function getReferenceSize(id) {
  return request({
    url: `/api/prim_prod/kl_group_info?prod_id=${id}`,
    method: 'get'
  })
}

// 校验组件 - 修改组件信息
export function changeGroup(data) {
  return request({
    url: '/api/prim_prod/change_kl_group',
    method: 'post',
    data
  })
}

//保存档位
export function saveGears(data) {
  return request({
    url: '/api/price_conf/gear/edit',
    method: 'post',
    data
  })
}

//新增档位分类
export async function addGearsCategory(data) {
  // eslint-disable-next-line no-undef
  let [err, res] = await awaitWrap(request({
    url: '/api/price_conf/gear_category',
    method: 'post',
    data
  }))
  store.dispatch('RefreshDic', 'gearsCategory')
  return res
}

//获取档位分类列表
export function getGearsCategoryList() {
  return request({
    url: '/api/price_conf/gear_category',
    method: 'get'
  })
}

//修改档位分类列表
export async function updateGearsCategoryList(id, data) {
  // eslint-disable-next-line no-undef
  let [err, res] = await awaitWrap(request({
    url: `/api/price_conf/gear_category/${id}`,
    method: 'put',
    data
  }))
  store.dispatch('RefreshDic', 'gearsCategory')
  return res
}

//获取当前档位列表
export function getCurrentGears(id) {
  return request({
    url: `/api/price_conf/gear?category_id=${id}`,
    method: 'get'
  })
}

//设置档位价格
export function createPrice(data) {
  return request({
    url: '/api/price_conf/price_conf/edit',
    method: 'post',
    data
  })
}

//获取档位价格
export function getPrice(id) {
  return request({
    url: `/api/price_conf/price_conf?prim_prod=${id}`,
    method: 'get'
  })
}


//报关信息获取-根据原型id
export function getDeclaredInfo(id) {
  return request({
    url: `/api/declared/declared_info?prim_prod=${id}`,
    method: 'get'
  })
}
//报关信息创建
export function createDeclaredInfo(data) {
  return request({
    url: '/api/declared/declared_info',
    method: 'post',
    data
  })
}
//报关信息编辑-局部
export function editDeclaredInfo(id, data) {
  return request({
    url: `/api/declared/declared_info/${id}`,
    method: 'patch',
    data
  })
}
