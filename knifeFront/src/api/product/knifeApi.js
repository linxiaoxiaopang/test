import request from '@/service/request'
//产品分类
export function list(params) {
  return request({
    url: '/api/product/kl_info/',
    method: 'get',
    params
  })
}

export function showDesignInfo(params) {
  return request({
    url: '/api/prim_prod/show_design_info/',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: '/api/product/kl_info/',
    method: 'post',
    data
  })
}

export function createKnife(data) {
  return request({
    url: '/api/test_algo/',
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
    url: `/api/product/kl_info/${data}/`,
    method: 'get',
    data
  })
}

export function detail(data) {
  return request({
    url: `/api/product/kl_info/?id=${data}`,
    method: 'get'
  })
}

export function baseDetail(data) {
  return request({
    url: `/api/prim_prod/base_kl_info/?id=${data}`,
    method: 'get'
  })
}

export function documentDetail(data) {
  return request({
    url: `/api/prim_prod/base_kl_doc/?id=${data}`,
    method: 'get'
  })
}

//一键定制信息
export function quickDesign(data) {
  return request({
    url: `/api/prod_design/combinations/quick_design?id=${data}`,
    method: 'get'
  })
}

export function edit(id, data) {
  return request({
    url: '/api/product/kl_info/' + id + '/',
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: '/api/product/kl_info/' + id + '/',
    method: 'delete'
  })
}

export function getSKUInfo(data) {
  return request({
    url: '/api/product/spec_prim_prod/get_info',
    method: 'post',
    data
  })
}

export function relationRelationSku(data) {
  return request({
    url: '/api/product/sku_map/relation_sku',
    method: 'post',
    data
  })
}

export function allUserSkus(data) {
  return request({
    url: '/api/product/sku_map',
    method: 'get',
    data
  })
}

export function editRelationSku(id, data) {
  return request({
    url: `/api/product/sku_map/${id}/`,
    method: 'patch',
    data
  })
}

export function delRelationSku(id) {
  return request({
    url: '/api/product/sku_map/' + id,
    method: 'delete'
  })
}

//获取款式和尺码
export function getStructAndSizes(id) {
  return request({
    url: `/api/product/size_and_struct?prim_prod_id=${id}`,
    method: 'get'
  })
}

//获取用户自定义的sku
export function getCheckCustomSkus() {
  return request({
    url: '/api/product/check_custom_sku',
    method: 'get'
  })
}

//测试sku
export function test(data) {
  return request({
    url: 'api/test_algo',
    method: 'post',
    data
  })
}
