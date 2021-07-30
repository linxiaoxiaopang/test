<template>
  <div class="imgUpLoadComponent">
    <draggable v-model="temFilesList" v-bind="dragOption" class="list" @change="dragChange">
      <div
        v-for="(file, indx) in temFilesList || []"
        v-loading="loading"
        :class="['item', file.uploadStatus === 'success' && 'success-item']"
        :style="{
          width: $attrs.size || '148px',
          height: $attrs.size || '148px',
          'line-height': $attrs.size || '148px'
        }"
        :key="file.uid || file.id"
      >
        <div class="card-wrapper">
          <div class="pic-name" v-if="showFileName">
            {{ fileName(file) }}
          </div>
          <label
            v-if="file.uploadStatus"
            :class="['el-upload-list__item-status-label', file.uploadStatus === 'fail' && 'error']"
          >
            <i class="el-icon-upload-success el-icon-check" v-if="file.uploadStatus === 'success'"></i>
            <i class="el-icon-upload-success el-icon-warning-outline" v-else-if="file.uploadStatus === 'fail'"> </i>
          </label>

          <img style="width: 148px; height: 148px; object-fit: contain" :src="srcList[indx]" />

          <div class="dialog" v-if="!hideDialog">
            <i class="el-icon-delete" @click="deleteHandler(file, indx)"></i>
          </div>
        </div>
      </div>
      <div
        v-if="showUploadBtn"
        class="upload-item"
        :style="{
          width: $attrs.size || '148px',
          height: $attrs.size || '148px',
          'line-height': $attrs.size || '148px'
        }"
      >
        <el-upload
          :http-request="requestHandler"
          :file-list="files"
          :show-file-list="false"
          :action="$attrs.action || '#'"
          :list-type="$attrs['list-type'] || 'picture-card'"
          :accept="$attrs.accept || 'image/jpeg, image/png, image/bmp, image/jpg'"
          style="width: 100%; height: 100%"
          :before-upload="$attrs['before-upload'] || beforeUpload"
          :multiple="$attrs.multiple === undefined ? false : $attrs.multiple"
          v-bind="$attrs"
          v-on="$listeners"
        >
          <i slot="default" class="el-icon-plus"></i>
          <template #tip>
            <slot name="tip" />
          </template>
        </el-upload>
      </div>
    </draggable>
  </div>
</template>
<script>
const SIZE = 150 //图片大小限制
import config from '@/service/config'
const serverRootPath = config.baseURL
import { getThumbnail } from '@/utils'

import draggable from 'vuedraggable'
// draggable 配置：https://segmentfault.com/a/1190000021376720
export default {
  components: {
    draggable
  },
  props: {
    showFileName: {
      type: Boolean,
      default: true
    },
    files: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    hideDialog: Boolean,
    hiddenUploadBtn: Boolean
  },
  data() {
    return {
      temFilesList: [],
      srcList: []
    }
  },
  watch: {
    files: {
      handler(newVal) {
        this.temFilesList = newVal
        this.srcList = []
        newVal.map((file) => {
          let url = file.url || file.path
          if (url) {
            if (!/^http/.test(url)) {
              this.srcList.push(url)
            }
            return this.srcList.push(url)
          }
          getThumbnail(file).then((res) => {
            this.srcList.push(res.url)
          })
        })
      },
      deep: true,
      immediate: true
    }
  },
  filters: {
    //格式化图片地址
    formatRowUrl(file) {
      let url = file.url || file.path
      if (url) {
        if (!/^http/.test(url)) {
          return `${serverRootPath}${url}`
        }
        return url
      }
      return URL.createObjectURL(file)
    }
  },
  computed: {
    showUploadBtn() {
      if (this.hiddenUploadBtn) {
        return false
      }
      if (!this.$attrs.limit) {
        return true
      }
      return this.$attrs.limit > this.files.length
    },
    fileName() {
      return (file) => {
        if (file.name) {
          return file.name
        }
        if (file.path) {
          const lastIndex = file.path.lastIndexOf('/')
          return decodeURIComponent(file.path.slice(lastIndex + 1) || '')
        }
        return '暂无名称'
      }
    },
    dragOption() {
      return {
        animation: 200,
        group: 'description',
        ghostClass: 'ghost',
        draggable: '.item',
        disabled: this.$attrs.dragDisabled,
        ...this.$attrs
      }
    }
  },
  methods: {
    //检查图片类型和尺寸
    beforeUpload(file) {
      let typeArr = this.$attrs.accept || ['image/jpeg', 'image/png', 'image/bmp', 'image/jpg']
      if (typeof typeArr === 'string') {
        typeArr = typeArr.split(/[,，]\s*/)
      }
      const includeType = typeArr.includes(file.type)
      const size = this.$attrs.PIC_SIZE || SIZE
      const isMoreSize = file.size / 1024 / 1024 < size
      if (!includeType) {
        this.$message.error(`上传图片只能是 ${typeArr.join(',')} 格式!`)
      }
      if (!isMoreSize) {
        this.$message.error(`上传图片大小不能超过 ${size}MB!`)
      }
      return includeType && isMoreSize
    },
    picLoadHandler(file) {
      URL.revokeObjectURL(file.url)
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
    },

    dragChange(e) {
      this.$emit('dragChange', e)
      this.$emit('update:files', this.temFilesList)
    }
  }
}
</script>
<style lang="scss" scoped>
.imgUpLoadComponent {
  .list {
    display: flex;
    flex-wrap: wrap;
    .item,
    .upload-item {
      margin-right: 10px;
      margin-bottom: 10px;
      border: 1px solid $border-color;
      border-radius: 4px;
      .card-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        .el-upload-list__item-status-label {
          display: block;
          position: absolute;
          right: -17px;
          top: -7px;
          width: 46px;
          height: 26px;
          background: #13ce66;
          text-align: center;
          transform: rotate(45deg);
          box-shadow: 0 1px 1px #ccc;
          line-height: 40px;
          z-index: 10;
          i {
            font-size: 12px;
            margin-top: 12px;
            transform: rotate(-45deg);
            font-weight: 600;
          }
          .el-icon-check,
          .el-icon-warning-outline {
            display: inline-block;
            width: 20px;
            text-align: right;
            color: #fff;
          }
        }
        .error {
          background: $color-danger;
        }
        .dialog {
          display: none;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
          border-radius: 4px;
          background: rgba(0, 0, 0, 0.5);
          i {
            font-size: 30px;
            color: #fff;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
      .pic-name {
        position: absolute;
        height: 1rem;
        width: 100%;
        line-height: 1rem;
        z-index: 100;
        left: 0;
        bottom: 0;
        font-size: 12px;
        background: $color-primary;
        color: #fff;
        text-align: center;
        @include overflow;
        border-radius: 4px 4px 0 0;
      }
      .card-wrapper:hover {
        .dialog {
          display: block !important;
        }
        .success-dialog {
          display: none !important;
        }
      }
      ::v-deep {
        .el-loading-spinner {
          line-height: 1;
        }
        .el-upload {
          width: 100%;
          height: 100%;
          line-height: inherit;
          .el-icon-plus {
            line-height: inherit;
          }
        }
      }

      .el-upload.el-upload,
      .el-image {
        width: 100%;
        height: 100%;
      }
    }
    .upload-item {
      border: none;
    }
    //上传成功，隐藏上传按钮
    .success-item + .upload-item {
      display: none;
    }
  }
}
</style>
