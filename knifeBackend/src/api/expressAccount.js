import request from '@/service/request'

// 物流账号api

/**
 * 获取物流渠道
 * @returns
 */
export function getList(data = {}) {
  data.isDockApi = 1
  return request({
    url: '/system/expressCompany/list',
    method: 'post',
    data
  })
}

/**
 * 根据公司id获取账号
 * @param {object} data.companyId 公司id
 * @returns
 */
export function getAccountById(data) {
  return request({
    url: '/system/expressAccount/list',
    method: 'post',
    data
  })
}

/**
 *  根据物流公司id获取渠道列表
 * @param {Object} data 主键id数组
 * @returns
 */
export function getChannelByCompanyId(data) {
  return request({
    url: '/system/expressShippingMethod/list',
    method: 'post',
    data
  })
}

/**
 *  根据账号id获取渠道列表
 * @param {Object} data 主键id数组
 * @returns
 */
export function getChannelById(data) {
  return request({
    url: '/system/expressAccountShippingMethod/list',
    method: 'post',
    data
  })
}

/**
 * 更新物流账号和物流方式的相关信息
 * @param {number} data.id 关联id
 * @param {number} data.companyId 物流公司id
 * @param {number} data.accountId 物流公司账号id
 * @param {number} data.shippingMethodId 物流公司物流方式Id
 * @returns
 */
export function updateAccountShippingMethod(data = {}) {
  return request({
    url: '/system/expressAccountShippingMethod/update',
    method: 'post',
    data
  })
}

/**
 * 添加授权
 * @param {String} data.accountName 账号名称
 * @param {String} data.clientId 第三方Api接口的给提供的client Id
 * @param {String} data.clientSecret clientSecret
 * @param {String} data.companyId companyId
 * @param {String} data.customerCode customerCode
 * @returns
 */
export function addAuth(data = {}) {
  return request({
    url: '/system/expressAccount/create',
    method: 'post',
    data
  })
}

/**
 * 添加授权测试
 * @param {String} data.clientId 第三方Api接口的给提供的client Id
 * @param {String} data.clientSecret clientSecret
 * @param {String} data.companyId companyId
 * @param {String} data.whCode 揽件机构编号
 * @returns 
 */
export function testAuth(data = {}) {
  return request({
    url: '/order/order/waybillAuth',
    method: 'post',
    data
  })
}

/**
 * 递四方添加授权
 * @param {String} data.accountName 账号名称
 * @param {String} data.companyId companyId
 * @returns 
 */
export function disifangAuth(data = {}) {
  return request({
    url: '/system/expressAccount/authorize',
    method: 'post',
    data
  })
}

/**
 * 修改账号
 * @param {number} data.id 账号id
 * @param {String} data.accountName 账号名称
 * @param {String} data.clientId 第三方Api接口的给提供的client Id
 * @param {String} data.clientSecret clientSecret
 * @param {String} data.companyId companyId
 * @param {String} data.customerCode customerCode
 * @returns
 */
export function updateAuth(data = {}) {
  return request({
    url: '/system/expressAccount/update',
    method: 'post',
    data
  })
}

/**
 * 账号授权 todo
 * @param {Object} data
 * @returns
 */
export function changeAuthorize(data) {
  return request({
    url: '/system/expressAccount/changeAuthorize',
    method: 'post',
    data
  })
}

/**
 * 启用或停用渠道 todo
 * @param {Object} data
 * @returns
 */
export function changeChannelIsEnabled(data) {
  return request({
    url: '/system/expressShippingMethod/toEnable',
    method: 'post',
    data
  })
}
