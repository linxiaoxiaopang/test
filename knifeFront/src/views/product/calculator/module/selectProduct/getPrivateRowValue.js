import { getValueFromObj } from '@/utils'

export default {
  methods: {
    getShowImg(row) {
      return getValueFromObj(row, 'products[0].prod_show_images[0].path') || ''
    },
    getStructs(row) {
      return getValueFromObj(row, 'products') || []
    },
    getStructAbbrs(row) {
      return this.getStructs(row).map(({ color_name }) => color_name)
    },
    getSizes(row) {
      return getValueFromObj(row, 'prim_prod.sizes')
    },
    getSizeNames(row) {
      return this.getSizes(row).map(({ size_name }) => size_name)
    },
    getSizePrice(size) {
      return getValueFromObj(size, 'price_confs[0].price')
    }
  }
}
