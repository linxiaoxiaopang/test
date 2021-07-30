<template>
    <el-upload
      :limit="item.limit"
      :action="item.action || '/minio/upload'"
      :headers="item.headers || headers"
      :multiple="item.multiple"
      :on-preview="handlePreview"
      :on-success="handleSuccess"
      :show-file-list="item.showFileList === true"
      class="cu-upload"
    >
      <el-button type="primary" :icon="item.uploadBtnIcon">{{ item.uploadBtnText || '点击上传' }}</el-button>
    </el-upload>
</template>

<script>
  import { getToken } from '@/utils/auth';
  export default {
    name: 'cuUpload',
    props: {
      value: {
        type: Array | String,
      },
      item: {
        type: Object,
        default() {
          return {}
        }
      },
    },
    data() {
      return {
        headers: {Authorization: 'Bearer ' + getToken()},
        fileList: null
      }
    },
    watch: {
      value: {
        handler(val) {
          this.fileList = val;
        },
        immediate: true
      },
    },
    created() {
      this.fileList = this.item.multiple ? [] : '';
    },
    methods: {
      handlePreview(val) {
        // this.$emit('input', val);
      },
      handleSuccess(res, file, fileList) {
        this.$emit('success', res, file, fileList);
        // console.log(res, file, fileList);
        this.item.multiple
          ?this.fileList.push(res.data)
          :this.fileList = res.data;
        this.$emit('input', this.fileList);
      },
    }
  }
</script>

<style lang="scss">
  .cu-upload {
    .el-button {
      height: 36px;
      line-height: 36px;
      padding: 0 18px;
    }
    [class*="el-icon-"] {
      vertical-align: middle;
      font-size: 1.5em;
    }
  }
</style>
