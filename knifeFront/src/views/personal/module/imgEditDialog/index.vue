<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      title="图片编辑"
      width="428px"
      custom-class="img-edit-dialog"
      @closed="$emit('input', {})"
    >
      <avue-form
        v-loading="loading"
        ref="form"
        :option="formOption"
        @reset-change="dialogVisible = false"
        v-bind="$attrs"
        v-on="$listeners"
        @submit="doSubmit"
      >
        <template #path="{ value }">
          <div style="line-height: normal">
            <el-image :src="value || ''" width="68" height="68">
              <div slot="error" class="image-slot">
                <img src="@/assets/images/default.png" width="68" height="68" alt="" class="block" />
              </div>
            </el-image>
            <div>
              想要替换图片，
              <crud-file-upload class="inline-block" ref="imgUpload" action="#" :limit="2" @updateFiles="updateFiles">
                <el-button type="text">点这里</el-button>
              </crud-file-upload>
            </div>
          </div>
        </template>
      </avue-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dialogComponentsMixin } from '@/mixins'
import { FILE_UPLOAD_PREFIX } from '@/utils/constant'
import { systemFileUpload } from '@/api/system/file'
import { findArray } from '@/components/avue/utils/util'
import { update, bulkAddCategory } from '@/api/imageApi'
import { getPicName, compressFile } from '@/utils'

export default {
  mixins: [dialogComponentsMixin],
  props: {
    isImgEditBulk: {
      type: Boolean,
      default: false
    },
    sup_this: {
      type: Object,
      required: true
    }
  },
  data() {
    let option = {
      column: [
        {
          label: '图片名称',
          prop: 'title',
          type: 'text'
        },
        {
          label: '图片分类',
          prop: 'category',
          type: 'cascader',
          emitPath: false,
          checkStrictly: true,
          showAllLevels: false
        },
        {
          label: '图片',
          prop: 'path',
          formslot: true
        }
      ]
    }
    this.$store.dispatch('HandleOption', option)
    return {
      option,
      loading: false,
      FILE_UPLOAD_PREFIX,
      file: null
    }
  },
  computed: {
    ...mapGetters(['category', 'categoryProps']),
    columnArr() {
      if (this.isImgEditBulk) return [1]
      return [0, 1, 2]
    },
    formOption({ option }) {
      return {
        span: 24,
        column: option.column.filter((item, index) => this.columnArr.includes(index))
      }
    }
  },
  methods: {
    isSamePic(name) {
      const {
        value: { path = '' }
      } = this.$attrs
      const oName = getPicName(path)
      return oName === name
    },
    async doSubmit() {
      this.loading = true
      const file = this.file
      const {
        value: { id, ids, category }
      } = this.$attrs
      try {
        let code = 0
        if (this.isImgEditBulk) {
          code = (await bulkAddCategory({ ids, category })).code
        } else {
          const formData = new FormData()
          formData.append('category', category)
          if (file instanceof File) {
            const { file: thumbnail_path, naturalWidth: width, naturalHeight: height } = await compressFile(file)

            formData.append('thumbnail_path', thumbnail_path, file.name)
            formData.append('path', file)
            formData.append('width', width)
            formData.append('height', height)
          }
          console.log('update', update)
          code = (await update(id, formData)).code
        }
        if ($SUC({ code })) {
          this.$message.success('操作成功')
          this.dialogVisible = false
          this.sup_this && this.sup_this.getList()
        }
      } catch (err) {
        console.log('err', err)
      }
      this.loading = false
    },
    updateFiles(fileList) {
      const file = fileList.slice(-1)[0]
      const name = getPicName(file.name)
      const isSame = this.isSamePic(name)
      if (!isSame) {
        return this.$message.warning('图片名称不一致！')
      }
      this.file = file
      this.$attrs.value.path = URL.createObjectURL(file)
      return
      this.getUploadPath(fileList, this.$attrs.value.id).then((path) => {
        this.$attrs.value.src = path
        console.log(this.$attrs.value.src)
      })
    },

    async getUploadPath(fileList, id = 0) {
      const formData = new FormData()
      formData.append('file', fileList[0])
      formData.append('id', id)
      const { code, detail } = await systemFileUpload({
        data: formData,
        onUploadProgress: this.progressFunc
      })
      if ($SUC({ code })) {
        return detail
      }
      return false
    }
  }
}
</script>

<style lang="scss"></style>
