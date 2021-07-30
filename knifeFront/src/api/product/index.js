import request from '@/service/request'

// 我的产品
export function getMyProduct(params) {
  return request({
    url: '/api/product/spec_prim_prod',
    method: 'get',
    params
  })
}

// 我的产品
export function getMyProductById(id) {
  return request({
    url: '/api/product/spec_prim_prod/' + id,
    method: 'get'
  })
}

// 我的产品
export function editMyProduct(id, data) {
  return request({
    url: '/api/product/spec_prim_prod/' + id,
    method: 'patch',
    data
  })
}

// 我的产品
export function delMyProduct(id) {
  return request({
    url: '/api/product/spec_prim_prod/' + id,
    method: 'delete'
  })
}

// 修改自定义sku
export function editMyCustomSku(id, data) {
  return request({
    url: `/api/product/spec_prod/${id}/edit_custom_sku`,
    method: 'patch',
    data
  })
}

// 已关联产品
export function getRelationProduct(params) {
  return request({
    url: '/api/product/spec_prim_prod/all_related_prod',
    method: 'get',
    params
  })
}
//新增档位分类
export function addGearsCategory(data) {
  return request({
    url: '/api/price_conf/gear_category',
    method: 'post',
    data
  })
}

//获取档位分类列表
export function getGearsCategoryList() {
  return request({
    url: '/api/price_conf/gear_category',
    method: 'get'
  })
}

//修改档位分类列表
export function updateGearsCategoryList(id, data) {
  return request({
    url: `/api/price_conf/gear_category/${id}`,
    method: 'put',
    data
  })
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
    url: `/api/price_conf/price_conf?size=10000&prim_prod=${id}`,
    method: 'get'
  })
}
