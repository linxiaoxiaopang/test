<template>
  <div class="basics-edit-component">
    <div class="form-item">
      <div class="form-label is-custom-required">原型尺码表</div>
      <div class="form-content">
        <sizeForm
          ref="sizeForm"
          :data="sizeForms"
          :option="sizeFormsOption"
          :addColumns.sync="addColumns"
          :product-data="value.productData"
        ></sizeForm>
      </div>
    </div>
  </div>
</template>

<script>
import sizeForm from '@/views/components/sizeForm/index'
import { isInteger, validateNotNegative } from '@/utils'

export default {
  components: {
    sizeForm
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
      sizeForms: [],
      sizeFormsOption: {
        addPropBtn: true,
        column: [
          {
            label: '尺码',
            prop: 'size_name'
          }
        ],
        addColumn: [
          {
            label: '长度',
            prop: 0,
            rules: packRules,
            isHeaderEdit: true,
            isBodyEdit: true
          },
          {
            label: '宽度',
            prop: 1,
            rules: packRules,
            isHeaderEdit: true,
            isBodyEdit: true
          }
        ]
      },
      addColumns: []
    }
  },
  watch: {
    value: {
      handler(n) {
        // console.log('packSPEC value', n)
        if (!n.sizeForms) this.$set(n, 'sizeForms', [])
        /*n.sizeForms.forEach((size, index) => {
         let sort = validateNotNegative(size.sort) ? size.sort : index
         n.sizeForms[sort] = size
         })*/
        this.sizeForms = n.sizeForms
      
        if (!n.addColumns) this.$set(n, 'addColumns', [])
        this.addColumns = n.addColumns
      },
      immediate: true,
      deep: true
    },
    addColumns: {
      handler(n) {
        // console.log('addColumns sync', n)
        this.$set(this.value, 'addColumns', n)
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    async doSubmit() {
      this.$refs.sizeForm.doSubmit()
    },
    async doFunc() {
      return await this.$refs.sizeForm.doFunc()
    },
    async doAdd(id) {
      return await this.$refs.sizeForm.addSizePropInfo(id)
    },

    async validate() {
      if (this.sizeForms.length === 0) {
        return true
      }
      return await this.$refs.sizeForm.validate()
    }
  }
}
</script>

<style lang="scss">

</style>
