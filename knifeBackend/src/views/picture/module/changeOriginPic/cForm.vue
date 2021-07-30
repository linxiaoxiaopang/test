<template>
  <BaseDialog ref="baseDialog" top="5vh" width="500px" :dialogVisible.sync="dialog" :title="title">
    <template>
      <BaseForm v-loading="loading" ref="form" label-width="100px" :cols="formField" :form="form" :formVisible="dialog">
        <template #thumbnail_pathSlot="{ scoped: { prop } }">
          <ImgUpload
            ref="imgUpload"
            action="#"
            :hideDialog="true"
            :showFileName="true"
            :hiddenUploadBtn="true"
            :limit="1"
            :files.sync="form[prop]"
          />
        </template>
        <template #pathSlot="{ scoped: { prop } }">
          <ImgUpload
            ref="imgUpload"
            class="fileUpload"
            action="#"
            :showFileName="true"
            :limit="1"
            :files.sync="form[prop]"
          />
        </template>
      </BaseForm>
    </template>
    <template #footer>
      <LoadingBtn type="primary" @click="doSubmit"> 确认 </LoadingBtn>
      <LoadingBtn @click="cancel"> 取消 </LoadingBtn>
    </template>
  </BaseDialog>
</template>
<script>
import ImgUpload from '@/components/fileUpload/imgUpload'
import formField from './field'
import { update, changePublicUpdate as publicUpdate } from '@/api/imageApi'
import { compressFile, getPicName } from '@/utils'
import { commonFromMixin } from '@/mixins'

export default {
  mixins: [commonFromMixin],
  components: {
    ImgUpload
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    form: {
      type: Object,
      required: true
    },
    isPublic: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formField,
      loading: false
    }
  },

  methods: {
    isSamePic(name) {
      const { title } = this.data
      return title === name
    },

    async doSubmit() {
      const valid = await this.$refs['form'].validate()
      if (!valid) return
      const {
        path: [file]
      } = this.form
      if (!this.isSamePic(getPicName(file.name))) {
        return this.$message.error('原图上传有误， 请确保和更换前原图名一致。')
      }
      this.loading = true

      const { id } = this.data
      try {
        const formData = new FormData()
        const { file: thumbnail_path, naturalWidth: width, naturalHeight: height } = await compressFile(file)

        formData.append('thumbnail_path', thumbnail_path, file.name)
        formData.append('width', width)
        formData.append('height', height)
        formData.append('path', file)
        const api = this.isPublic ? publicUpdate : update
        const { code } = await api(id, formData)
        if ($SUC({ code })) {
          setTimeout(() => {
            this.success()
          }, 100)
        }
      } catch (err) {
        console.log('err', err)
      }
      this.loading = false
    }
  }
}
</script>
