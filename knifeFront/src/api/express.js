
import request from '@/service/request'


// 物流列表
export function expressList(data) {
  return request({
    url: '/order/expressCompany/list',
    method: 'post',
    data
  })
}

// 订单 - 选择物流方式
export function orderExpressBatchUpdate(data) {
  return request({
    url: '/order/order/waybillNoCreate',
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

export function getChannel(data) {
  return request({
    url: '/order/order/waybillSupportList',
    method: 'post',
    data
  })
}

/**
* 根据国家二字码获取物流公司
* @param {object} data
* @param {array} data.countryCodeList
* */
export function getChannelTwo(data) {
  return request({
    url: '/order/order/waybillSupportListByCountryCode',
    method: 'post',
    data
  })
}