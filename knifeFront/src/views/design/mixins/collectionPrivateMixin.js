import { add, cancel } from '@/api/product/collectionsApi'

export default {
  props: {
    sup_this: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async love() {
      this.loading = true
      // 接口返回太快，导致loading效果来不及展示
      let delay = 300 // 使loading效果至少展示200ms
      let last = +new Date()
      try {
        const { collect, id } = this.data
        const api = collect ? cancel : add
        const { code } = await api({
          id
        })
        if ($SUC({ code })) {
          this.data.collect = !collect
          this.success()
        }
      } catch (err) {
        console.log(err)
      }
      // 接口返回太快，导致loading效果来不及展示
      let timeLag = +new Date() - last
      if (timeLag > delay) {
        this.loading = false
      } else {
        setTimeout(() => {
          this.loading = false
        }, delay - timeLag)
      }
    },

    success() {
      this.$emit('successInfo')
      // console.log(' this.sup_this',  this.sup_this)
      // this.sup_this && this.sup_this.init()
    }
  }
}
