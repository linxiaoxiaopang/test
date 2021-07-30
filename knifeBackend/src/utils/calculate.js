import { validatenull } from '@/components/avue/utils/validate'

export function parseNumber(num) {
  return parseFloat(num || 0)
}
/**
 * @param {Array} nums
 * @returns {Number}
 * @example see @/views/order/module/pushGroup.vue
 */
export function numberAdd(nums) {
  // console.log('numberAdd', nums)
  return nums.reduce((total, num) => parseNumber(total) + parseNumber(num))
}

// 数据换算
export const conversionRate = {
  cm: {
    in: 0.39370078740157
  },
  in: {
    cm: 2.54
  },
  g: {
    lb: 0.00220462262184
  }
}
export function conversionData(data, dataType, resultType) {
  // console.log('numberAdd', nums)
  if (validatenull(data)) return 0
  if (!conversionRate[dataType] || !conversionRate[dataType][resultType]) return data
  return data * conversionRate[dataType][resultType]
}
export function conversionCMToIN(data) {
  return conversionData(data, 'cm', 'in').toFixed(4)
}
export function conversionGToLB(data) {
  return conversionData(data, 'g', 'lb').toFixed(4)
}