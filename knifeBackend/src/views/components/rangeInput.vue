<template>
  <el-form
    ref="rangeForm"
    :model="rangeForm"
    :rules="rangeFormRules"
    class="range-input flex-middle"
    v-bind="$attrs"
    @submit.native.prevent
  >
    <el-form-item :prop="minProp" :error="error">
      <el-input
        v-model="rangeForm[minProp]"
        :placeholder="'请输入最小' + label"
        @keyup.enter.native="searchChange"
      />
    </el-form-item>
    <slot name="separator"><span class="mlr10">-</span></slot>
    <el-form-item :prop="maxProp" :error="error">
      <el-input
        v-model="rangeForm[maxProp]"
        :placeholder="'请输入最大' + label"
        @keyup.enter.native="searchChange"
      />
    </el-form-item>
    <slot name="suffix"></slot>
  </el-form>
</template>

<script>
import { deepClone } from '@/components/avue/utils/util'
import { validatenull } from '@/components/avue/utils/validate'

export default {
  props: {
    value: String|Number,
    label: String,
    prop: String,
    minProp: {
      type: String,
      default: 'min'
    },
    maxProp: {
      type: String,
      default: 'max'
    },
    rules: {
      type: Array|Object
    }
  },
  data() {
    return {
      rangeForm: {},
      error: ''
    }
  },
  computed: {
    rangeFormRules({ rules, minProp, maxProp }) {
      // console.log('rangeFormRules')
      rules = Array.isArray(rules) ? rules : [rules]
      let minRules = deepClone(rules)
      minRules.push({
        validator: (rule, value, callback) => {
          const one = value
          const max = this.rangeForm[this.maxProp]
          // console.log(one, max, !one, !max, Number(one) < Number(max), this.validateFromOtherField)
          if (!one || !max || Number(one) < Number(max)) {
            this.validateFromOtherField = !this.validateFromOtherField
            if (this.validateFromOtherField) {
              this.validateField(this.maxProp)
            }
            return callback()
          }
          return callback(new Error('输入值不得大于最大阈值'))
        }
      })
      let maxRules = deepClone(rules)
      maxRules.push({
        validator: (rule, value, callback) => {
          const one = value
          const min = this.rangeForm[this.minProp]
          // console.log(one, min, !one, !min, Number(one) > Number(min), this.validateFromOtherField)
          if (!one || !min || Number(one) > Number(min)) {
            this.validateFromOtherField = !this.validateFromOtherField
            if (this.validateFromOtherField) {
              this.validateField(this.minProp)
            }
            return callback()
          }
          return callback(new Error('输入值不得小于最小阈值'))
        }
      })
      return {
        [minProp]: minRules,
        [maxProp]: maxRules
      }
    }
  },
  watch: {
    value: {
      handler(n) {
        let { prop } = this
        n[prop] = undefined
        // console.log(this.$attrs)
        this.rangeForm = n
      },
      immediate: true,
      deep: true
    }/*,
    rangeFormRules: {
      handler(n) {
        console.log(n)
      },
      immediate: true,
      deep: true
    }*/
  },
  methods: {
    onchange() {
      this.$emit('change', this.rangeForm)
    },
    searchChange() {
      this.$emit('searchChange', this.rangeForm)
    },
    
    async validate() {
      this.error = ''
      let valid = await this.$refs.rangeForm.validate()
      if (!valid) return valid
      let { label, minProp, maxProp, rangeForm } = this
      let { [minProp]: minVal,[maxProp]: maxVal } = rangeForm
      let isMinValNull = validatenull(minVal)
      let isMaxValNull = validatenull(maxVal)
      if (
        !(
          (isMinValNull && isMaxValNull) ||
          (!isMinValNull && !isMaxValNull)
        )
      ) {
        this.error = label + '应全填或不填'
        return false
      }
      return true
    },
    validateField(field) {
      return this.$refs.rangeForm.validateField(field)
    },
    resetFields() {
      return this.$refs.rangeForm.resetFields()
    },
    clearValidate(prop) {
      return this.$refs.rangeForm.clearValidate(prop)
    }
  }
};
</script>

<style lang="scss">
.range-input.el-form {
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
