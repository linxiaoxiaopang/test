import request from '@/service/request'

// 工厂分类列表
export function facCategoryList(params) {
  return request({
    url: '/api/prim_prod/fac_category',
    method: 'get',
    params
  })
}
// 工厂分类创建
export function addFacCategory(data) {
  return request({
    url: '/api/prim_prod/fac_category',
    method: 'post',
    data
  })
}
// 工厂分类编辑
export function editFacCategory(id, data) {
  return request({
    url: '/api/prim_prod/fac_category/' + id,
    method: 'put',
    data
  })
}


// 未进行工厂分类的款式
export function noCateStructList(params) {
  return request({
    url: '/api/prim_prod/fac_category/no_cate_struct',
    method: 'get',
    params
  })
}