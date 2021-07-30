<template>
  <section class="app-container knifePage app-flex-col-container">
    <div class="flex-col-content">
      <el-row :gutter="15">
        <el-col :span="8" :key="index" v-for="(form, index) in data">
          <BaseForm customClass="customClass" ref="form" label-width="80px" :cols="formField" :form="form">
            <template #size_nameSlot="{ scoped: { prop } }">
              <el-tag type="primary">
                {{ form[prop] + (form.status == 1 ? '(已上架)' : '') }}
              </el-tag>
            </template>
            <template #filesSlot="{ scoped: { prop } }">
              <FileUpload :hideDialog="form.status == '1'" :files.sync="form[prop]" :limit="1" />
            </template>
          </BaseForm>
        </el-col>
      </el-row>
    </div>

    <div class="bottom">
      <el-button type="default" @click="$router.replace('/product/maintain/knifeMange')"> 返回 </el-button>
      <el-button type="primary" @click="doSubmit"> 保存并进行下一步 </el-button>
    </div>
  </section>
</template>

<script>
import FileUpload from '@/components/fileUpload/fileUpload'
import { sizesPsdsFiled as formField } from './field'
import { mapMutations } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'

import { getSizesAndPsds as list } from '@/api/product/productApi'

export default {
  components: {
    FileUpload
  },
  data() {
    return {
      formField,
      data: [],
      isStandard: true
    }
  },
  created() {
    this.list()
  },
  methods: {
    ...mapMutations(['SET_KNIFE_PSDS', 'SET_KNIFE_STANDARD_STATUS']),

    async doSubmit() {
      const success = await this.validForms()
      if (!success) return
      const data = this.data.filter(({ files }) => {
        if (!files[0]) return false
        if (files[0].url) {
          return false
        }
        return true
      })
      if (!data.length) {
        this.$message.warning(
          'psd文件未进行编辑，还是历史文件，无法进行下一步操作。请至少更新一个你需要更新的文件，再进行此操作！'
        )
        return
      }
      this.SET_KNIFE_STANDARD_STATUS(this.isStandard)
      this.SET_KNIFE_PSDS(cloneDeep(data))
      let url = '/knife/check'
      if (!this.isStandard) {
        url = `/knife/check?primId=${this.$route.query.id}`
      }
      this.$router.push(url)
    },
    async validForms() {
      const { form } = this.$refs
      const forms = Array.isArray(form) ? form : [form]
      const valids = await Promise.all(
        forms.map(async (node) => {
          try {
            return await node.validate()
          } catch (err) {
            return false
          }
        })
      )
      return valids.some((bool) => bool)
    },
    async list() {
      const { detail, code } = await list(this.$route.query.id)
      if ($SUC({ code })) {
        const { size, base } = detail
        this.isStandard = !!base && base.length
        this.data = size.map((item) => {
          item.files = item.kl_docs || []
          this.$delete(item, 'kl_docs')
          return item
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.knifePage {
  .customClass {
    margin-bottom: 15px;
    border: 1px solid $border-color;
    border-radius: 4px;
  }
}
</style>
