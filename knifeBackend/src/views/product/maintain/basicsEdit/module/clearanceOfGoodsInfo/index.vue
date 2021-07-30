<template>
  <div class="basics-edit-component">
    <div class="form-item">
      <div class="form-label">报关信息</div>
      <div class="form-content">
        <avue-form ref="form" v-model="form" :option="formOption"></avue-form>
      </div>
    </div>
  </div>
</template>

<script>
import { formOption } from './const'
import { getDeclaredInfo, createDeclaredInfo, editDeclaredInfo } from '@/api/product/productApi'
import { mapState } from 'vuex'
import { getDiffData } from '@/components/avue/utils/util'
import { delPropOfObj } from '@/utils'

export default {
  props: {
    value: {
      type: Object
    }
  },
  data() {
    this.$store.dispatch('HandleOption', formOption)
    return {
      formOption,
      form: {}
    }
  },
  computed: {
    ...mapState({
      declaration(state) {
        return state.dic.declaration.dicData.map(dicItem => dicItem.value)
      }
    }),
    postData({ form, declaration }) {
      let tempObj = {
        declaration: undefined
      }
      declaration.forEach(item => {
        if (form.declaration.includes(item)) {
          tempObj[item] = 1
        } else {
          tempObj[item] = 0
        }
      })

      let purpose = form.purpose || null
      return {
        ...form,
        purpose,
        ...tempObj
      }
    }
  },
  watch: {
    value: {
      handler(n) {
        if (!n.clearanceOfGoodsInfo) n.clearanceOfGoodsInfo = {}
        this.form = n.clearanceOfGoodsInfo
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    async getInfo() {
      let { value: { productData }, form, declaration } = this
      if (productData) {
        let [err, { detail }] = await awaitWrap(getDeclaredInfo(productData.id))
        if (detail.length) {
          form.declaration = []
          declaration.forEach(item => {
            if (detail[0][item] === 1) form.declaration.push(item)
          })
          Object.assign(form, detail[0])
          
          this.oForm = detail[0]
        }
      }
    },
    
    async validate() {
      let [, valid] = await awaitWrap(this.$refs.form.validate())
      return valid
    },
    async doSubmit() {
      let valid = await this.validate()
      if (valid) return await this.doFunc()
    },
    async doFunc() {
      let { form: { id }, value: { productData: { id: proId } = {} } } = this
      if (id) {
        return await this.doEdit(id)
      } else {
        return await this.doAdd(proId)
      }
    },
    async doAdd(prim_prod) {
      // prim_prod为原型id
      console.log(prim_prod)
      if (prim_prod) {
        let [err, res] = await awaitWrap(
          createDeclaredInfo({
            ...this.postData,
            prim_prod
          })
        )
        if ($SUC(res)) {
          return true
        }
      }
    },
    async doEdit(id) {
      let diffData = getDiffData(this.postData, this.oForm)
      delPropOfObj(diffData, ['id', 'declaration'])
      // console.log(diffData, this.postData, this.oForm)
      if (Object.keys(diffData).length) {
        let [err, res] = await awaitWrap(
          editDeclaredInfo(id, diffData)
        )
        if ($SUC(res)) {
          return res.detail
        }
      } else {
        return true
      }
    }
  }
}
</script>

<style lang="scss"></style>
