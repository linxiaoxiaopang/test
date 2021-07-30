<template>
  <div class="basics-edit-component el-form-required-position">
    <div class="form-item">
      <div class="form-label">原型详情</div>
      <div class="form-content">
        <avue-form
          ref="form"
          v-model="form"
          :option="formOption"
        >
          <template #deliveryTime="scoped">
            <rangeInput
              ref="rangeInput"
              v-model="form"
              v-bind="{
                ...scoped,
                ...scoped.column
              }"
            >
              <span slot="suffix" class="ml10">天</span>
            </rangeInput>
          </template>
          <template #detail="{ prop, placeholder }">
            <Editor
              id="basisEditor"
              :val.sync="form[prop]"
              :placeholder="placeholder"
              :height="300"
              serverUrl="serverUrl"
              useObjectStr="CONTENT_UEDITOR_FILE"
            />
          </template>
        </avue-form>
      </div>
    </div>
  </div>
</template>

<script>
import { formOption } from './const'
import rangeInput from '@/views/components/rangeInput'
import Editor from '@/components/editor'
import { deepClone, getDiffData } from '@/components/avue/utils/util'
import { file2Base64 } from '@/utils'
import { createProto } from '@/api/product/protoApi'
import { edit as productEdit } from '@/api/product/protoBasisApi'
export default {
  components: {
    rangeInput,
    Editor
  },
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      formOption,
      form: {}
    }
  },
  computed: {
    formProps() {
      return {
        sizeForms: ['size_name', 'weight', 'length', 'width', 'height']
      }
    }
  },
  watch: {
    value: {
      handler(n) {
        if (!n.productDetails) n.productDetails = {}
        this.form = n.productDetails
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    async doSubmit() {
      let valid = await this.validate()
      if (valid) return await this.doFunc()
    },
    async doFunc() {
      let { productData } = this.value
      if (productData === undefined) {
        return await this.doAdd()
      } else {
        return await this.doEdit(productData.id)
      }
    },
    async doAdd() {
      let { value: form, formProps } = this
      let structs = deepClone(form.structForms)
      for (let i = 0; i < structs.length; i++) {
        const item = structs[i]
        const pArr = item.figures.map(async (figure) => await file2Base64(figure))
        const res = await Promise.all(pArr)
        item.figures = res.map((base64, index) => {
          return {
            isCover: index === 0,
            path: base64
          }
        })
      }
      let sizes = form.sizeForms.map(size => {
        return formProps.sizeForms.reduce((total, prop) => {
          total[prop] = size[prop]
          return total
        }, {})
      })
  
      const jsonStr = JSON.stringify({
        basic: {
          ...form.topForm,
          ...form.productDetails,
          sex: Number(form.topForm.sex),
          season: Number(form.topForm.season),
          level: Number(form.topForm.level || 1)
        },
        structs,
        sizes
      })
      const formData = new FormData()
      formData.append('jsonStr', jsonStr)
      let [, res] = await awaitWrap(createProto(formData))
      if ($SUC(res)) return res.detail
    },
    async doEdit(id) {
      let { value: form } = this
      let basic = {
        ...form.topForm,
        ...form.productDetails,
        sex: Number(form.topForm.sex),
        season: Number(form.topForm.season),
        level: Number(form.topForm.level || 1)
      }
      for (const key in basic) {
        if (basic[key] === '') basic[key] = null
      }
      let basicDiff = getDiffData(basic, form.productData)
      console.log(basicDiff)
      if (Object.keys(basicDiff).length) {
        let [, res] = await awaitWrap(productEdit(id, basicDiff))
        if ($SUC(res)) return res.detail
      } else {
        return true
      }
    },
    
    async validate() {
      let [, valid] = await awaitWrap(this.$refs.form.validate())
      let [, rangeValid] = await awaitWrap(this.$refs.rangeInput.validate())
      return valid && rangeValid
    }
  }
}
</script>

<style lang="scss"></style>
