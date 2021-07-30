<template>
  <span>
    <el-button type="primary" size="mini" class="filter-item" @click="to">
      <span><img :src="require('./ic_upload_image1.svg')" />上传图片</span>
    </el-button>
    <PicUploadDialog
      title="上传图片"
      :dialogVisible.sync="dialogVisible"
      @picsReadyHandler="picsReadyHandler"
    />
    <PicUploadTableDialog
      ref="PicUploadTableDialog"
      v-if="uploadTableVisible"
      title="上传图片"
      :dialogVisible.sync="uploadTableVisible"
      :data="fileList"
      :cols="cols"
      :sup_this="sup_this"
      @uploadMorePic="to"
    />
  </span>
</template>
<script>
import PicUploadDialog from '@/components/picUploadDialog'
import PicUploadTableDialog from '../module/picUploadTableDialog'
import { uploadTableDialogCols as cols } from './cols'
import { getPicName } from '@/utils'
export default {
  components: {
    PicUploadDialog,
    PicUploadTableDialog
  },
  props: {
    sup_this: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      cols,
      fileList: [],
      dialogVisible: false,
      uploadTableVisible: false
    }
  },
  methods: {
    to() {
      this.dialogVisible = true
    },
    picsReadyHandler(fileList) {
      this.fileList = fileList.map((item) => {
        this.$set(item, 'isShare', true)
        this.$set(item, 'title', getPicName(item.name || ''))
        return item
      })
      this.uploadTableVisible = true
      this.$nextTick(function () {
        this.$refs.PicUploadTableDialog.check()
      })
    }
  }
}
</script>
<style scoped lang="scss">
.el-button {
  span {
    line-height: 20px;
    display: inline-block;
  }
  img {
    margin-top: -4px;
    margin-right: 5px;
    height: 18px;
    vertical-align: middle;
  }
}
</style>
