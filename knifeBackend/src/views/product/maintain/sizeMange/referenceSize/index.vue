<template>
  <div class="referenceSizeComponent" v-loading="loading">
    <div class="content">
      <ReferenceCanvas ref="referenceCanvas" :forms.sync="forms" :curIndex.sync="curIndex" />
      <BaseForm customClass="customClass" ref="form" label-width="100px" :cols="formField" :form="form">
        <template #nameSlot="{ scoped: { prop, placeholder } }">
          <el-input v-model="form[prop]" style="width: 400px" :placeholder="placeholder"></el-input>
        </template>

        <template #base_group_coverSlot="{ scoped: { prop } }">
          <ImgUpload :files.sync="form[prop]" :limit="1" @updateFiles="updateFiles(form[prop], prop)" />
        </template>

        <template #show_rotateSlot="{ scoped: { prop } }">
          <el-slider :step="45" :max="360" v-model="form[prop]" :marks="marks" style="width: 400px"> </el-slider>
        </template>
      </BaseForm>
    </div>
    <div class="bottom">
      <el-button type="info" @click="back"> 取消 </el-button>
      <el-button type="primary" @click="save"> 保存 </el-button>
    </div>
  </div>
</template>

<script>
import ImgUpload from '@/components/fileUpload/imgUpload'
import ReferenceCanvas from './module/referenceCanvas'
import { MAKER } from '@/utils/constant'
import { list, bulkEdit } from '@/api/product/referenceSizeMangeApi'

import { referenceSizeField as formField } from './field'

export default {
  components: {
    ImgUpload,
    ReferenceCanvas
  },

  data() {
    return {
      id: this.$route.query.id,
      curIndex: 0,
      formField,
      docSrc: '',
      psdInfo: {},
      forms: [],
      loading: false,
      marks: {
        0: '0°',
        45: '45°',
        90: '90°',
        180: '180°',
        270: '270°',
        360: '360°'
      }
    }
  },

  created() {
    this.list()
  },
  watch: {
    curIndex() {
      this.clearValidate()
    }
  },
  computed: {
    form({ forms, curIndex }) {
      return forms[curIndex] || {}
    }
  },

  methods: {
    back() {
      this.$router.back()
    },

    updateFiles(files, prop) {
      this.$refs.form.validateField(prop)
    },

    clearValidate() {
      this.$nextTick(() => {
        const { form } = this.$refs
        if (form) {
          form.clearValidate()
        }
      })
    },

    async validate() {
      return await this.$refs['form'].validate()
    },

    async isFail(forms) {
      const boolArr = []
      const startArr = forms.slice(0, this.curIndex + 1)
      const endArr = forms.slice(this.curIndex + 1)
      for (let i = 0; i < startArr.length; i++) {
        const form = startArr[i]
        const { base_group_cover, name } = form
        if (!base_group_cover.length || !name) {
          boolArr.push(i)
        }
      }

      for (let i = 0; i < endArr.length; i++) {
        const form = endArr[i]
        const { base_group_cover, name } = form
        if (!base_group_cover.length || !name) {
          boolArr.push(startArr.length + i)
        }
      }
      return boolArr
    },

    async save() {
      const failArr = await this.isFail(this.forms)
      if (failArr.length) {
        this.curIndex = failArr[0]
        this.$nextTick(async () => {
          this.validate()
        })
        this.$message.error(`组块编号${failArr.map((num) => num + 1).join('、')}未完善！`)
        return
      }
      this.loading = true
      try {
        const formData = new FormData()
        const params = []
        this.forms.map(({ id, name, base_group_cover: [cover], show_rotate }, index) => {
          params.push({
            group_id: id,
            name,
            show_rotate,
            order: index
          })
          if (cover instanceof File) {
            formData.append([`cover_${id}`], cover)
          } else {
            formData.append([`cover_${id}`], cover.path)
          }
        })
  
        formData.append('base_size_id', this.id)
        formData.append('params', JSON.stringify(params))
        const { code } = await bulkEdit(formData)
        if ($SUC({ code })) {
          this.$message.success('操作成功')
          setTimeout(() => {
            this.back()
          }, 200)
        }
      } catch (err) {}
      this.loading = false
    },

    formatDataToPsdData(detail) {
      const { base_kl_docs = [], base_kl_groups = {} } = detail || {}
      return {
        doc: base_kl_docs,
        group: base_kl_groups
      }
    },

    async list() {
      const id = this.id
      if (!id) {
        return this.$router.back()
      }
      const { detail, code } = await list({ base_size_id: id })
      if ($SUC({ code })) {
        const { base_kl_docs = [], base_kl_groups = [] } = detail
        this.docSrc = base_kl_docs[0] && base_kl_docs[0].base_psd_path
        this.psdInfo = this.formatDataToPsdData(detail)
        this.data = base_kl_groups
        this.forms = base_kl_groups.map(
          ({ base_group_cover, show_rotate, name, id, order, base_kl_images, base_kl_texts = [] }) => {
            const f = base_kl_images.find((fItem) => {
              return fItem.type === MAKER
            })
            const text = (base_kl_texts[0] && base_kl_texts[0].value) || '暂无'

            return {
              base_group_cover: base_group_cover
                ? [
                    {
                      path: base_group_cover
                    }
                  ]
                : [],
              id,
              show_rotate,
              name,
              order,
              img_url: f.img_url,
              text
            }
          }
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.referenceSizeComponent {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: #ebebed;
  height: calc(100vh - 60px);
  .content {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .customClass {
    padding: 0 10px;
    flex: 1;
    margin-top: 10px;
    background: #fff;
    ::v-deep {
      .el-form {
        padding-left: 0;
        padding-right: 0;
      }
    }
  }

  .bottom {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 15px;
    background: #fff;
    padding: 10px 0;
    border-radius: 0 0 4px 4px;
    .el-button {
      width: 150px;
    }
  }
}
</style>
