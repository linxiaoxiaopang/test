<template>
  <div class="posReferenceSizeComponent" v-loading="loading">
    <div class="content">
      <ReferenceCanvas ref="referenceCanvas" :forms.sync="forms" :curIndex.sync="curIndex" />
      <BaseForm customClass="customClass" ref="form" label-width="120px" :cols="formField" :form="form">
        <template #nameSlot="{ scoped: { prop, placeholder } }">
          <el-input
              v-model="form[prop]"
              style="width: 400px"
              :placeholder="placeholder"
              @change="handleNameChange"
          ></el-input>
        </template>

        <template #base_group_coverSlot="{ scoped: { prop } }">
          <ImgUpload :files.sync="form[prop]" :limit="1" />
        </template>

        <template #base_group_markSlot="{ scoped: { prop } }">
          <ImgUpload :files.sync="form[prop]" :limit="1" />
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

import { posReferenceSizeField as formField } from './field'
import {
  getKlProdSite as list,
  setKlProdDesignPic as bulkAdd,
  updateKlProdDesignPic as bulkEdit,
  updateKlProdSiteName as bulkEditName
} from '@/api/product/protoSizeApi'

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
      // console.log(this.forms.map(({oldSort}) => oldSort))
      this.$nextTick(() => {
        const { form } = this.$refs
        if (form) {
          form.clearValidate()
        }
      })
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

    async validate() {
      let [err, valid] = await awaitWrap(this.$refs['form'].validate())
      return valid
    },

    async isFail(forms) {
      let { curIndex } = this
      return forms.reduce(
        (
          failArr,
          {
            base_group_cover,
            base_group_mark,
            name
          },
          index
        ) => {
          if (!base_group_cover.length || !base_group_mark.length || !name) {
            failArr.push(index)
          }
          return failArr
        },
        []
      )
    },

    async save() {
      const failArr = await this.isFail(this.forms)
      if (failArr.length) {
        if (!failArr.includes(this.curIndex)) {
          this.curIndex = failArr[0]
        }
        this.$nextTick(() => {
          this.$nextTick(() => {
            this.validate()
          })
        })
        this.$message.error(`组块编号${failArr.map((num) => num + 1).join('、')}未完善！`)
        return
      }
      let p = []
      let bulkEditNameArr = []
      let addIds = []
      const addFormData = new FormData()
      let editIds = []
      const editFormData = new FormData()
      this.forms.forEach(({ isEdit, id, name, oldSort, base_group_cover: [cover], base_group_mark: [mark] }, sort) => {
        if (isEdit.oldName !== name || oldSort !== sort) {
          bulkEditNameArr.push({
            id,
            name,
            sort
          })
        }
        if (!(cover instanceof File || mark instanceof File)) return
        if (isEdit.cover) {
          if (cover instanceof File) {
            editFormData.append(`cover_${isEdit.design_pic_id}`, cover)
          }
          if (mark instanceof File) {
            editFormData.append(`chart_${isEdit.design_pic_id}`, mark)
          }
          editIds.push({
            id: isEdit.design_pic_id,
            type: isEdit.type
          })
        } else {
          addIds.push({
            combination_id: id,
            type: '0'
          })
          if (cover instanceof File) {
            addFormData.append(`cover_${id}`, cover)
          }
          if (mark instanceof File) {
            addFormData.append(`chart_${id}`, mark)
          }
        }
      })
      if (bulkEditNameArr.length) {
        p.push(bulkEditName({
          base_size_id: this.id,
          params: bulkEditNameArr
        }))
      }
      if (editIds.length) {
        editFormData.append('params', JSON.stringify(editIds))
        editFormData.append('base_size_id', this.id)
        p.push(bulkEdit(editFormData))
      }
      if (addIds.length) {
        addFormData.append('params', JSON.stringify(addIds))
        addFormData.append('base_size_id', this.id)
        p.push(bulkAdd(addFormData))
      }
      if (p.length === 0) {
        this.$message.warning('无任何修改内容')
        return
      }
      this.loading = true
      console.log(this.forms)
      const [err, res] = await awaitWrap(Promise.all(p))
      console.log(res)
      if (res) {
        let valid = res.every(item => $SUC(item))
        if (valid) {
          this.$message.success('操作成功')
          setTimeout(() => {
            this.back()
          }, 200)
        }
      } else {
        this.$message.success('操作失败')
      }
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
      const [err, { detail, code }] = await awaitWrap(list(id))
      if ($SUC({ code })) {
        this.forms = detail.map(
          ({ display_img, design_pic: [{ chart_path, cover_path, id: design_pic_id, type } = {}], name, id }, oldSort) => {
            return {
              isEdit: {
                type,
                cover: design_pic_id || design_pic_id === 0,
                design_pic_id,
                oldName: name
              },
              base_group_cover: cover_path
                ? [
                  {
                    path: cover_path
                  }
                ]
                : [],
              base_group_mark: chart_path
                ? [
                  {
                    path: chart_path
                  }
                ]
                : [],
              id,
              name,
              oldSort,
              img_url: display_img,
              text: name
            }
          }
        )
        console.log(this.forms)
      }
    },

    handleNameChange() {
      let { form } = this
      form.isNameChange = form.name !== form.isEdit.oldName
    }
  }
}
</script>

<style lang="scss" scoped>
.posReferenceSizeComponent {
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
