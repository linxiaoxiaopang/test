<template>
  <div class="basics-edit-component">
    <div class="form-item">
      <div class="form-label is-custom-required">原型款式</div>
      <div class="form-content">
        <structForm ref="structForm" :productData="value.productData" :data="structForms"></structForm>
      </div>
    </div>
    <div class="form-item">
      <div class="form-label is-custom-required">
        原型尺码
        <span v-if="noValForSizeForms" class="text-danger ml10">尺码至少需要存在一个！</span>
      </div>
      <div class="form-content">
        <sizeForm ref="sizeForm" :productData="value.productData" :data="sizeForms" :option="sizeFormsOption">
          <template #menuRight>注：编辑排序同步到原型尺码表</template>
        </sizeForm>
      </div>
    </div>
  </div>
</template>

<script>
import structForm from '@/views/components/structForm'
import sizeForm from '@/views/components/sizeForm'
import { isInteger } from '@/utils'
export default {
  components: {
    sizeForm,
    structForm
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    let packRules = {
      validator: isInteger
    }
    return {
      structForms: [],
      sizeForms: [],
      sizeFormsOption: {
        addSizeBtn: true,
        menu: true,
        column: [
          {
            label: '尺码',
            prop: 'size_name',
            required: true
          },
          {
            label: '包装尺寸 (cm) (长*宽*高)',
            minWidth: 250,
            required: true,
            inputList: [
              {
                label: '长:',
                prop: 'length',
                rules: packRules
              },
              {
                label: '宽:',
                prop: 'width',
                rules: packRules
              },
              {
                label: '高:',
                prop: 'height',
                rules: packRules
              }
            ]
          },
          {
            label: '包装重量 (g)',
            prop: 'weight',
            type: 'input',
            rules: packRules,
            required: true
          }
        ]
      }
    }
  },
  computed: {
    noValForSizeForms({ sizeForms }) {
      return sizeForms.length === 0
    }
  },
  watch: {
    value: {
      handler(n) {
        if (!n.structForms) this.$set(n, 'structForms', [])
        this.structForms = n.structForms

        if (!n.sizeForms) this.$set(n, 'sizeForms', [])
        this.sizeForms = n.sizeForms
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    async doSubmit() {
      this.$refs.structForm.doSubmit()
      this.$refs.sizeForm.doSubmit()
    },
    async doFunc() {
      let valids = await Promise.all([
        this.$refs.structForm.doFunc(),
        this.$refs.sizeForm.doFunc()
      ])
      return valids.every(valid => valid)
    },

    async validate() {
      let structValid = await this.$refs.structForm.validate()
      
      let sizeValid = await this.$refs.sizeForm.validate()

      return structValid && sizeValid
    }
  }
}
</script>

<style lang="scss">

</style>
