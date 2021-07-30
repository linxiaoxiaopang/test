import { PIC_SIZE } from '@/utils/constant'
import { parseTime } from '@/utils'
export default {
  install(Vue) {
    Vue.filter('currencyFormat', function (value) {
      if (!value) {
        return 0.0
      }
      var num = value.toString()
      if (num) {
        return Number(num)
          .toFixed(2)
          .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
      }
      return 0.0
    })
    Vue.filter('formatUrl', function (value, size = 'mid') {
      size = PIC_SIZE[size]
      value = value + size
      const $this = new Vue()
      if (value && value.indexOf('http') > -1) {
        return value
      }
      return value
        ? $this.$serverRootPath + value
        : require('@/assets/images/default.png')
    })
    Vue.filter('prvFormatUrl', function (value) {
      const $this = new Vue()
      return value
        ? [
          value && value.indexOf('http') > -1
            ? value
            : $this.$serverRootPath + value
        ]
        : [require('@/assets/images/default.png')]
    })
    Vue.filter('formatTime', function (value) {
      return parseTime(value || '')
    })
  }
}
