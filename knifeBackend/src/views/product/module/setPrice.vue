<template>
  <div class="setPriceTable">
    <el-form :model="priceFormData" :rules="priceFormRules" ref="setPriceTable" :validate-on-rule-change="false">
      <el-table :data="priceFormData.list" border class="table-border" :header-row-class-name="tableRowClassName">
        <template v-for="({ prop, label }, index) in priceColData">
          <el-table-column v-if="prop == 'size'" :key="index" :prop="prop" :label="label" align="center">
          </el-table-column>
          <el-table-column v-else :key="index" :prop="prop" :label="label" align="center">
            <template v-slot="{ row, $index }">
              <el-form-item :prop="prop + $index" v-if="isInputVisible">
                <el-input
                  v-model="priceFormData[`${prop}${$index}`]"
                  :disabled="isSet"
                  class="tableInput"
                ></el-input>
              </el-form-item>
              <span v-else>{{ row[`${prop}`] || '暂无' }}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-form>
  </div>
</template>

<script>
var priceReg = /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
var validatePrice = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('价格不能为空!!'))
  }
  if (!priceReg.test(value)) {
    callback(new Error('价格必须为数值且不能少于0'))
  } else {
    callback()
  }
}
export default {
  props: {
    priceData: Array,
    priceColData: Array,
    isSet: {
      type: Boolean,
      default: true
    },
    isInputVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      priceFormData: {
        list: this.priceData
      },
      priceFormRules: {}
    }
  },
  watch: {
    priceData: {
      handler(n) {
        let { priceData, priceColData, priceFormRules } = this
        priceFormRules = {}
        priceData.forEach((row, rowIndex) => {
          const { ids, size, size_id, ...rest } = row
          const formKeys = Object.keys(rest).sort((a, b) => {
            return +a.replace('price', '') - +b.replace('price', '')
          })
          formKeys.map((key) => {
            priceFormRules[`${key}${rowIndex}`] = [{ required: true, validator: validatePrice, trigger: 'blur' }]
            this.$set(this.priceFormData, key + '' + rowIndex, row[key])
          })
        })
        this.priceFormRules = priceFormRules
        // this.$nextTick(function () {
        //   this.$refs.setPriceTable.clearValidate()
        // })
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.$emit('takeRef', this.$refs.setPriceTable, this.priceFormData)
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'tableHeader'
      } else {
        return
      }
    }
  }
}
</script>

<style scoped lang="scss">
.setPriceTable {
  margin-top: 20px;
  .table-border {
    border-left: 1px solid #ebeef5;
  }
  .el-table {
    border-collapse: collapse !important;
    ::v-deep {
      .tableHeader th {
        border: 1px solid #ebeef5 !important;
      }
    }
  }
}
</style>
