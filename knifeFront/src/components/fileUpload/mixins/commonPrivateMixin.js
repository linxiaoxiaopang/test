import { getPicName } from '@/utils'
const SIZE = 100

export default {
  props: {
    files: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    beforeUploadFunc: {
      type: Function
    }
  },
  data() {
    return {
      temFilesList: []
    }
  },
  watch: {
    files: {
      handler(newVal) {
        this.temFilesList = newVal
      },
      deep: true
    }
  },
  filters: {
    //格式化图片地址
    formatRowUrl(file) {
      const url = file.url || file.path
      if (url) {
        if (!/^http/.test(url)) {
          // eslint-disable-next-line
          return `${serverRootPath}${url}`
        }
        return url
      }
      return URL.createObjectURL(file)
    }
  },
  computed: {
    showUploadBtn() {
      if (!this.$attrs.limit) {
        return true
      }
      return this.$attrs.limit > this.files.length
    },
    getFileName() {
      return (file) => {
        return getPicName(file.url || file.path || '')
      }
    }
  },
  methods: {
    //检查图片类型和尺寸
    beforeUpload(file) {
      this.beforeUploadFunc && this.beforeUploadFunc(file)
      if (this.beforeUploadFunc) {
        return this.beforeUploadFunc(file)
      }
      const isMoreSize = file.size / 1024 / 1024 < SIZE
      if (!isMoreSize) {
        this.$message.error(`上传文件大小不能超过 ${SIZE}MB!`)
      }
      return isMoreSize
    },
    //上传成功状态 'success', 失败状态'fail'
    toggleUploadStatus(status) {
      this.temFilesList.map((item) => (item.uploadStatus = status))
      this.$emit('update:files', this.temFilesList)
    },
    //删除单个接口
    deleteHandler(file, index) {
      if (!file.uploadStatus) {
        this.temFilesList.splice(index, 1)
        this.$emit('update:files', this.temFilesList)
        return
      }
      this.$emit('deleteUploadImgHandler', {
        file,
        index
      })
    },
    //自定义上传
    requestHandler(info) {
      const { action, file } = info
      this.temFilesList.push(file)
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$emit('update:files', this.temFilesList)
        this.$emit('updateFiles', this.temFilesList)
      }, 100)
    }
  }
}
