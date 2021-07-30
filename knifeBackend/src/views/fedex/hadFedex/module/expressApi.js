import request from '@/service/request'
// 纸张尺寸数据
export function getPaperSize(data = {}) {
  return request({
    url: '/system/expressLabelSize/list/',
    method: 'post',
    data
  })
}
// 城市数据
export function getCityData(data = {}) {
  return request({
    url: 'system/administrativeArea/complexList/',
    method: 'post',
    data
  })
}

// 发送启用物流编辑
export function sendInfo(data = {}) {
  return request({
    url: '/system/expressAccountShippingMethod/complexUpdate/',
    method: 'post',
    data
  })
}
// 请求运费模板
export function getFreightTemplate(data = {}) {
  return request({
    url: '/system/expressFreightTemplate/list/',
    method: 'post',
    data
  })
}

// 根据id获得一些数据（国际国内。。//是否显示跟踪号）
export function getSomeNews(data = {}) {
  return request({
    url: '/system/expressCompany/getById/',
    method: 'post',
    data
  })
}
// 根据信息表Id获取数据
export function getNewsById(data = {}) {
  return request({
    url: '/system/expressAccountShippingMethod/getById/',
    method: 'post',
    data
  })
}
// 启用物流渠道
export function changeChannelIsEnabled(data) {
  return request({
    url: '/system/expressShippingMethod/toEnable',
    method: 'post',
    data
  })
}
