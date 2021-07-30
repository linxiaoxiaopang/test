<template>
  <el-tabs class="struct-form-component" type="border-card" v-model="activeName" @tab-remove="remove">
    <el-tab-pane
        v-for="form in data"
        :key="form.id | paneName"
        :name="form.id | paneName"
        :closable="!disabled(form)"
        :label="form.structure || '暂无款式'"
    >
      <span slot="label">
        {{ form.structure || '暂无款式' }}
        <color-text-btn v-if="disabled(form)" type="danger">(已上架)</color-text-btn>
      </span>
      <template>
        <BaseForm
            ref="form"
            label-width="90px"
            :isDisable="disabled(form)"
            :cols="formField"
            :form="form"
        >
          <template #prim_colorSlot="{ scoped: { prop } }">
            <!-- <el-color-picker v-model="form[prop]"></el-color-picker> -->
            <ColorSelect :color.sync="form[prop]" :sup_this="sup_this"/>
          </template>
          <template #figuresSlot="{ scoped: { prop } }">
            <ImgUpload
              :hideDialog="disabled(form)"
              :files.sync="form[prop]"
              multiple
              :limit="5"
              @updateFiles="$refs.form.forEach(formRef => formRef.validateField(prop))"
              v-p="[
                'prim_prod:prim_figure:partial_update',
                'prim_prod:prim_figure:create',
                'prim_prod:prim_figure:delete'
              ]"/>
          </template>
        </BaseForm>
      </template>
    </el-tab-pane>

    <el-tab-pane name="addNewTab" disabled>
      <el-button
          slot="label"
          @click="addNewStruct"
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-p="['prim_prod:prim_struct:create']"
      >
        添加款式
      </el-button>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import ImgUpload from '@/components/fileUpload/imgUpload'
import ColorSelect from '@/components/colorSelect/index'

import {structField as formField} from './const'
import { createRandomNum, file2Base64, HasPermission } from '@/utils'
import { STRUCR_ITEM, CUSTOM, SHELVES } from '@/utils/constant'
import { add, del, edit } from '@/api/product/protoStructApi'
import { add as figuresAdd, del as figuresDel, edit as figuresEdit } from '@/api/product/primFigureApi'
import { deepClone, getDiffData } from '@/components/avue/utils/util'

export default {
  components: {
    ImgUpload,
    ColorSelect
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    productData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      sup_this: this,
      formField,
      activeName: null
    }
  },
  watch: {
    data: {
      handler(n) {
        if (n.length === 0) {
          this.addNewStruct()
        } else if (this.activeName === null) {
          this.activeName = n[0].id.toString()
        }
      },
      immediate: true
    }
  },
  filters: {
    paneName(id) {
      return id && id.toString()
    }
  },
  computed: {
    disabled() {
      return (data) => {
        return data.status == SHELVES
      }
    },
    oStructs({ productData: { prim_struct } }) {
      return prim_struct.filter(({ status }) => status != SHELVES) || []
    }
  },
  methods: {
    remove(name) {
      const prim_struct = this.data
      if (prim_struct.length <= 1) {
        return this.$message.warning('款式至少需要存在一个！')
      }
      const nameIndex = this.data.findIndex(({ id }) => id == name)
      if (nameIndex >= 0) {
        const sIndex = Math.max(0, nameIndex - 1)
        this.$delete(prim_struct, nameIndex)
        this.activeName = prim_struct[sIndex].id.toString()
      }
    },
    addNewStruct() {
      const tmpObj = {
        ...STRUCR_ITEM,
        id: `${CUSTOM}-${createRandomNum()}`
      }

      this.data.push(tmpObj)
      this.activeName = tmpObj.id
    },
  
    async validate() {
      const { form } = this.$refs
      const forms = Array.isArray(form) ? form : [form]
      const validData = await Promise.all(
        forms.map(async (node) => {
          try {
            return await node.validate()
          } catch (err) {
            return false
          }
        })
      )
      const validIndex = validData.findIndex((bool) => {
        return bool == false
      })
      if (validIndex >= 0) {
        this.activeName = this.data[validIndex].id.toString()
        return false
      }
      if (this.existSameSizeName()) {
        this.$message.warning('存在两个一样的款式，款式编码必须唯一')
        return 0
      }
      return true
    },
    existSameSizeName() {
      const prim_struct = this.data
      const set = [...new Set(prim_struct.map(({ structure }) => structure.toUpperCase()))]
      return set.length < prim_struct.length
    },
    async doSubmit() {
      const validData = await this.validate()
      if (!validData) return
      return await this.doFunc()
    },
    async doFunc() {
      try {
        const { productData: { id }, data: allPrim_struct } = this
        const prim_struct = allPrim_struct.filter(({ status }) => status != SHELVES)
        const delRes = await Promise.all([...this.doDel(prim_struct)])
        const delSuccessBool = delRes.every(({ code }) => $SUC({ code }))
        if (!delSuccessBool) {
          return this.$message.error('发生错误')
        }
        const addFuncArr = this.doAdd(id, prim_struct)
        const res = await Promise.all([...addFuncArr, ...this.doEdit(prim_struct)])
        const successBool = res.every(({ code }) => $SUC({ code }))
        if (successBool) {
          // prim_struct为当前未上架款式
          // （删除的款式会被移除，即不包含已删除的款式，因此不会处理已删除款式的图片）
          const fPArr = prim_struct.map(struct => {
            return this.doFiguresFunc(struct)
          })
          const res = await Promise.all(fPArr)
          const allSuccess = res.every((bool) => bool)
          if (!allSuccess) {
            return this.$message.error('图片编辑发生错误')
          }
          // if (addFuncArr.length) {
          //   this.linkToCreateCoordPage()
          // }
          return true
        }
      } catch (err) {
        this.$message.error(err.msg || err || '发生错误')
      }
    },
    doDel(prim_struct) {
      const delArr = this.oStructs.filter(({ id }) => {
        return prim_struct.every((item) => item.id != id)
      })
      return delArr.map(({ id }) => del(id))
    },
    doAdd(id, prim_struct) {
      const addArr = prim_struct.filter(({ id }) => {
        if (!id) return true
        return id.toString().indexOf(CUSTOM) >= 0
      })
      return addArr.map(async (form) => {
        const copyFrom = deepClone(form)
        const pArr = copyFrom.figures.map(async (row) => {
          return await file2Base64(row)
        })
        const res = await Promise.all(pArr)
        const figures = res.map((base64, index) => {
          return {
            isCover: index == 0,
            path: base64
          }
        })
        return add({
          ...form,
          id: undefined,
          prim_prod: id,
          figures
        })
      })
    },
    doEdit(prim_struct) {
      let { oStructs } = this
      
      const editArr = prim_struct.filter(({ id }) => {
        return oStructs.some((item) => {
          if (id.toString().indexOf(CUSTOM) >= 0) return false
          return item.id == id
        })
      })
  
      let diffData = []
      editArr.forEach((item) => {
        let diffItem = getDiffData(item, oStructs.find(({ id }) => item.id === id))
        delete diffItem.psd_file
        delete diffItem.figures
        // console.log(diffItem, item, oStructs.find(({ id }) => item.id === id))
        if (Object.keys(diffItem).length) diffData.push(item)
      })
      if (diffData.length === 0) return []
  
      return diffData.map(({ id, psd_file, figures, ...form }) => {
        return edit(id, {
          ...form
        })
      })
    },
    async doFiguresFunc(struct) {
      let oFigures = (this.oStructs.find(({ id }) => struct.id === id) || {}).figures
      if (!Array.isArray(oFigures)) {
        return true
      }
      let figures = struct.figures
      const res = await Promise.all([
        ...this.doFiguresDel(figures, oFigures),
        ...this.doFiguresAdd(figures, oFigures, struct.id)
      ])
    
      return res.every(({ code }) => $SUC({ code }))
    },
    doFiguresDel(figures, oFigures) {
      const delArr = oFigures.filter(({ id }) => {
        return figures.every((item) => item.id != id)
      })
      return delArr.map(({ id }) => figuresDel(id))
    },
    doFiguresAdd(figures, oFigures, prim_struct) {
      const [firstAdd, ...otherAdd] = figures
      const addArr = otherAdd.filter(({ id }) => {
        return !id
      })
      const tmpArr = []
      if (firstAdd.id && !firstAdd.isCover) {
        const { id } = firstAdd
        const formData = new FormData()
        formData.append('isCover', true)
        formData.append('prim_struct', prim_struct)
        tmpArr.push(figuresEdit(id, formData))
      }
      if (!firstAdd.id) {
        const formData = new FormData()
        formData.append('isCover', true)
        formData.append('prim_struct', prim_struct)
        formData.append('path', firstAdd)
        tmpArr.push(figuresAdd(formData))
      }
      addArr.map((row) => {
        const formData = new FormData()
        formData.append('isCover', false)
        formData.append('prim_struct', prim_struct)
        formData.append('path', row)
        tmpArr.push(figuresAdd(formData))
      })
      return tmpArr
    },
    linkToCreateCoordPage() {
      try {
        const { productData: { base_sizes, prim_struct = [] } } = this
        const existCoord = prim_struct.some(({ prim_show_groups }) => prim_show_groups && prim_show_groups.length)
        if (!existCoord || !base_sizes || base_sizes.length == 0) {
          return
        }
        const structIds = prim_struct.map(({ id }) => id)
        const id = base_sizes[0] && base_sizes[0].id
        this.$confirm('新增款式之后需要重新生成坐标图, 是否跳转到坐标图页面?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$router.push(
              `/product/maintain/createCoordPic?id=${id}&&structId=${structIds}&&protoId=${this.id}`
            )
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消跳转'
            })
          })
      } catch (err) {}
    
      // console.log('this.data', this.data)
    },

    HasPermission
  }
}
</script>
<style lang="scss">
.struct-form-component {
  .is-disabled {
    .el-icon-close {
      opacity: 0;
    }
  }
  /*&.el-tabs--border-card {
    box-shadow: none;
    &>.el-tabs__header {
      border-bottom: none;
      background-color: transparent;
    }
    .el-tabs__item {
      border: none;
    }
  }*/
  .el-tabs__content {
    padding-bottom: 0;
  }
  .tableForm .el-form {
    padding: 1rem 0 0;
  }
}
</style>
