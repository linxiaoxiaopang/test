import { PICSIZE } from '@/utils/constant'
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
    Vue.filter('numFormat', function (value) {
      if (!value) {
        return 0
      }
      var num = value.toString()
      if (num) {
        return Number(num).toLocaleString()
      }
      return 0.0
    })
    Vue.filter('formatUrl', function (value, size = 'mid') {
      size = PICSIZE[size]

      const $this = new Vue()
      if (value && value.indexOf('http') > -1) {
        value = value + size
      }
      return value || require('@/assets/images/default.png')
    })
    Vue.filter('prvFormatUrl', function (value) {
      const $this = new Vue()
      return value
        ? [value && value.indexOf('http') > -1 ? value : $this.$serverRootPath + value]
        : [require('@/assets/images/default.png')]
    })
  }
}
