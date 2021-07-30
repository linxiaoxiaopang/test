import { isPrice } from '@/utils'

/**
 * 将数据转化为数字格式
 * @param {any} num
 * @returns {Number}
 * @example see parsePrice
 */
export function parseNumber(num) {
  return parseFloat(num || 0)
}
/**
 * 将数据转化为金额格式
 * @param {String|Number} price
 * @param {Number} fixed
 * @param {String} unit
 * @returns {String}
 * @example see @/views/order/module/orderGroupBasePage.vue
 */
export function parsePrice(price, fixed = 2, unit = '￥') {
  // console.log('parsePrice', price, fixed, unit)
  if (isPrice(price)) return unit + parseNumber(price).toFixed(fixed)
  return unit + price
}

/**
 * 将时间公司转化为时间展示格式
 * @param {time} time
 * @returns {String}
 */
export function parseTime(time) {
  if (time) {
    var date = new Date(time)
    var year = date.getFullYear()
    /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
    var month =
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    var minutes =
      date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    var seconds =
      date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    // 拼接
    return (
      year +
      '年' +
      month +
      '月' +
      day +
      '日 ' +
      hours +
      ':' +
      minutes +
      ':' +
      seconds
    )
  } else {
    return ''
  }
}

/**
 * 将时间公司转化为时间展示格式
 * @param {time} time
 * @returns {String}
 */
export function parseCharacterTime(time) {
  if (time) {
    var date = new Date(time)
    var year = date.getFullYear()
    /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
    var month =
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    var minutes =
      date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    var seconds =
      date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    // 拼接
    return (
      year +
      '-' +
      month +
      '-' +
      day +
      ' ' +
      hours +
      ':' +
      minutes +
      ':' +
      seconds
    )
  } else {
    return ''
  }
}

export function parseDay(time) {
  return parseTime(time).split(' ')[0]
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

export const timeNum = () => {
  return parseTime(Date.now()).replace(/[^\d]/g, '')
}