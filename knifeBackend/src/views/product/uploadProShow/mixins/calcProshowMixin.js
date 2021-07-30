import { baseDetail } from '@/api/product/checkProdApi'
import { isFile, getFileSuffix } from '@/utils'
import { MAKER } from '@/utils/constant'

const SUFFIX = 'json'
export default {
  data() {
    return {
      knifeData: [],
      frontDesign: [
        require('@/assets/proShow/测试样图-CC5373.jpg'),
        require('@/assets/proShow/测试样图-KEA51154.jpg'),
        require('@/assets/proShow/测试样图-CC5373_sm.png')
      ]
    }
  },
  computed: {
    klMasksData() {
      const tmpArr = []
      this.knifeData.map(({ kl_images }) => {
        kl_images.map((kl_image) => {
          const { type } = kl_image
          if (type == MAKER) {
            tmpArr.push(kl_image)
          }
        })
      })
      return tmpArr
    },

    whiteShow() {
      return (whiteShow) => {
        return this.formatCalcPorUrl(whiteShow)
      }
    },
    coordShow() {
      return (coordShow) => {
        return this.formatCalcPorUrl(coordShow)
      }
    },

    shadowShow() {
      return (shadowShow) => {
        return this.formatCalcPorUrl(shadowShow)
      }
    },

    showMasks() {
      return (showMasks) => {
        const tmpArr = []
        showMasks.map((files) => {
          const tmpObj = {}
          for (let i = 0; i < files.length; i++) {
            let file = files[i]
            if (isFile(file)) {
              if (getFileSuffix(file.name || '') === SUFFIX) {
                tmpObj.map_json = file
              } else {
                tmpObj.mask = URL.createObjectURL(file)
              }
            }
            if (!isFile(file)) {
              if (getFileSuffix(file.path || '') === SUFFIX) {
                tmpObj.map_json = file.path
              } else {
                tmpObj.mask = file.path
              }
            }
          }
          tmpArr.push(tmpObj)
        })
        return tmpArr
      }
    }
  },

  async created() {
    await this.baseDetail()
  },

  methods: {
    formatCalcPorUrl(data) {
      if (!data) return ''
      if (Array.isArray(data) && data.length) {
        if (data[0] instanceof File) {
          return URL.createObjectURL(data[0])
        }
        return data[0].path
      }
      return ''
    },

    async baseDetail() {
      this.knifeData = []
      const { detail = [], code } = (await baseDetail(this.$route.query.referenceId)) || {}
      if ($SUC({ code })) {
        this.knifeData = detail
      }
    }
  }
}
