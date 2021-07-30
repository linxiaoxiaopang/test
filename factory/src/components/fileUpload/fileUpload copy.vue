<template>
  <div :class="['fileUploadPage',customWarpClass]">
    <div class="el-upload__tip color-danger" v-if="tipStr">{{tipStr}}</div>
    <el-upload
      class="upload-demo"
      ref="upload"
      v-if="isEdit"
      :action="action"
      :headers="headers"
      :auto-upload="autoUpload"
      :data="formatData"
      :file-list="fileList"
      :limit="limit"
      :multiple="multiple"
      :show-file-list="showFileList"
      :before-remove="beforeRemove"
      :on-preview="handlePreview"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :on-change="handleChange"
    >
      <el-button slot="trigger" :class="customClass" icon="el-icon-upload">
        <slot>附件上传</slot>
      </el-button>
    </el-upload>
    <ul v-else class="el-upload-list el-upload-list--text">
      <template v-for="item in fileList">
        <li class="el-upload-list__item">
          <a class="el-upload-list__item-name">
            <i class="el-icon-document"></i>
            {{item.name}}
          </a>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import { getServiceRootPath } from '@/utils/utils'
import { CookieField, getCookie } from '@/utils/cookieUtils.js'

export default {
  props: {
    customClass: String,
    customWarpClass: String,
    formatData: {
      type: Object,
      required: false,
      default: () => {}
    },
    apiUrl: {
      required: true,
      type: String
    },
    isEdit: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    autoUpload: {
      type: Boolean,
      default: false
    },
    showFileList: {
      type: Boolean,
      default: true
    },
    tipStr: {
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: 1
    },
    typeLimit: {
      type: Array,
      required: false,
      default() {
        return [
          'txt',
          'doc',
          'xls',
          'bmp',
          'gif',
          'jpg',
          'jpeg',
          'pic',
          'png',
          'tif'
        ]
      }
    }
  },
  data() {
    return {
      headers: {
        'FH-Token': getCookie(CookieField.tokenName)
      },
      fileList: [],
      fullscreenLoading: false
    }
  },
  computed: {
    action() {
      return getServiceRootPath() + this.apiUrl
    }
  },
  methods: {
    // 清空已上传的文件列表
    clearAllFile() {
      this.fileList = []
      this.$refs.upload.clearFiles()
    },
    //设置列表内容
    setFileList(fileList) {
      this.fileList = fileList
    },

    //上传前
    beforeUpload(file) {
      if (this.typeLimit.length === 0) {
        return true
      } else {
        let result = this.typeLimit.some(item => {
          let arr = file.name.split('.')
          return arr[arr.length - 1].toLowerCase().includes(item)
        })
        if (!result) {
          this.$message.error('上传格式只能是[' + this.typeLimit + ']')
          this.fullscreenLoading = false
          // this.$emit('uploadSuccess', file);
        }
        return result
      }
    },

    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      // var fileType = file.raw.type ? (file.raw.type.split('/')[0]).toUpperCase() : '';
    },

    // 删除文件之前的钩子
    beforeRemove(file, fileList) {
      if (fileList == undefined) {
        fileList = this.fileList
      }
      this.$emit('deleteFile', file)
    },

    // 文件上传成功时的钩子
    handleSuccess(res) {
      this.$emit('uploadSuccess', res)
    },
    // 文件状态改变时的钩子
    handleChange(file, fileList) {
      this.$emit('uploadChange', file, fileList)
      this.setFileList(fileList)
    },

    //手动上传
    submit() {
      this.$refs.upload.submit()
    }
  }
}
</script>

<style lang="scss" scoped>
.fileUploadPage {
  /*.upload-demo {
      margin: 20px 0 0 10px;
    }*/

  .el-upload__tip {
    margin: 20px 0;
  }

  .upload-demo + .uploadListBox {
    padding: 10px 0;
  }

  /*  .uploadListBox {
        margin: 0;
        padding: 10px;
        list-style: none;

        li {
          margin: 10px 0;
          line-height: 1;

          span {
            display: inline-block;
            min-width: 40%;
            max-width: 85%;
            line-height: 1;
            margin-right: 10px;
          }

          button {
            padding: 0;
          }
        }
      }*/
}
</style>
