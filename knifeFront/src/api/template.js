import request from '@/service/request'

//删除模板
export function deleteTemplate(data) {
  return request({
    url: '/system/expressFreightTemplate/delete',
    method: 'post',
    data
  })
}

//创建模板
export function createTemplate(data) {
  return request({
    url: '/system/expressFreightTemplate/complexCreate',
    method: 'post',
    data
  })
}

//创建模板
export function updateTemplate(data) {
  return request({
    url: '/system/expressFreightTemplate/complexUpdate',
    method: 'post',
    data
  })
}

//根据id获取模板
export function getTemplate(data) {
  return request({
    url: '/system/expressFreightTemplate/getById',
    method: 'post',
    data
  })
}

//批量创建模板
export function batchCreateTemplate(data) {
  return request({
    url: '/system/expressFreightTemplateConfig/complexBatchCreate',
    method: 'post',
    data
  })
}

//获取已创建的模板
export function getCreatedTemplate(data) {
  return request({
    url: '/system/expressFreightTemplateConfig/list',
    method: 'post',
    data
  })
}

//获取已创建的模板
export function getCreatedTemplateByCountryId(data) {
  return request({
    url: '/system/expressFreightTemplateConfig/complexList',
    method: 'post',
    data
  })
}

//删除已创建的模板
export function deleteCreatedTemplate(data) {
  return request({
    url: '/system/expressFreightTemplateConfig/delete',
    method: 'post',
    data
  })
}

//批量更改已创建的模板
export function bulkUpdate(data) {
  return request({
    url: '/system/expressFreightTemplateConfig/complexBatchUpdate',
    method: 'post',
    data
  })
}
