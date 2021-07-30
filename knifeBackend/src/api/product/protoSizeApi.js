import request from '@/service/request'

export function list(params) {
  return request({
    url: '/api/product/size_spec/',
    method: 'get',
    params
  })
}

export function getPsdBySize(params) {
  return request({
    url: '/api/product/size_spec/get_psd_file/',
    method: 'get',
    params
  })
}

export function getBasePsdByProtoId(params) {
  return request({
    url: '/api/prim_prod/size_base/get_psd_file/',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: '/api/product/size_spec/',
    method: 'post',
    data
  })
}

export function read(data) {
  return request({
    url: `/api/product/size_spec/${data}/`,
    method: 'get',
    data
  })
}

export function edit(id, data) {
  return request({
    url: '/api/product/size_spec/' + id + '/',
    method: 'patch',
    data
  })
}

// 尺码排序
export function sortEdit(data) {
  return request({
    url: '/api/product/size_spec/set_size_sort',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/api/product/size_spec/' + id + '/',
    method: 'delete'
  })
}

export function setKlProd(data) {
  return request({
    url: 'api/set_kl_prod/',
    method: 'post',
    data
  })
}

export function setKlProdSite(data) {
  return request({
    url: '/api/prod_design/combinations/create_combinations',
    method: 'post',
    data
  })
}

export function getKlProdSite(id) {
  return request({
    url: '/api/prod_design/combinations/show?base_size_id=' + id,
    method: 'get'
  })
}

export function updateKlProdSiteName(data) {
  return request({
    url: '/api/prod_design/combinations/bulk_edit',
    method: 'post',
    data
  })
}

export function setKlProdDesignPic(data) {
  return request({
    url: '/api/prod_design/design_pic/bulk_create',
    method: 'post',
    data
  })
}

export function updateKlProdDesignPic(data) {
  return request({
    url: '/api/prod_design/design_pic/bulk_edit',
    method: 'post',
    data
  })
}



//原型尺码表-获取
export function getSizePropInfo(id) {
  return request({
    url: `/api/prim_prod/introduce_attr/info_detail?prim_prod=${id}`,
    method: 'get'
  })
}
//原型尺码表-添加
export function addSizePropInfo(data) {
  return request({
    url: '/api/prim_prod/introduce_attr/info_create',
    method: 'post',
    data
  })
}
//原型尺码表-编辑
export function editSizePropInfo(data) {
  return request({
    url: '/api/prim_prod/introduce_attr/info_edit',
    method: 'post',
    data
  })
}