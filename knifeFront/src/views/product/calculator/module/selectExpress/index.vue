<template>
  <el-dialog :visible.sync="dialogVisible" title="选择物流" width="820px" v-el-drag-dialog custom-class="select-express">
    <el-table :data="tableData[countryId]" v-loading="tableLoading" border max-height="550px" class="table-border"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" class-name="checkbox-small"></el-table-column>
      <el-table-column prop="shippingMethodName" label="物流渠道"></el-table-column>
      <el-table-column prop="$expressCost" label="运费">
        <template #default="{ row }">
          ￥{{ row.$expressCostData.cost }}
        </template>
      </el-table-column>
      <el-table-column prop="timeLimit" label="快递参考时效">
        <template #default="{ row }">
          {{ row.startReferTimeLimitation }}~{{ row.endReferTimeLimitation }}天
        </template>
      </el-table-column>
    </el-table>
    
    <div class="text-center mt30">
      <el-button size="small" @click="dialogVisible = false">返回</el-button>
      <el-button size="small" type="primary" @click="onsubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { dialogComponentsMixin } from '@/mixins'
import { waybillSupportListByCountry } from '@/api/order/calculator'
import { debounce, getExpressCost } from '@/utils'
import { validatenull } from '@/components/avue/utils/validate'

export default {
  mixins: [
    dialogComponentsMixin
  ],
  props: {
    countryId: {
      type: String | Number,
      required: true
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      tableData: {},
      tableLoading: false,
      multipleSelection: []
    }
  },
  watch: {
    dialogVisible(n) {
      console.log(n)
      if (n) {
        this.getList()
      }
    }
  },
  methods: {
    onsubmit() {
      let { multipleSelection } = this
      if (multipleSelection.length === 0) {
        return this.$message.warning('请选择物流渠道')
      }
      this.$emit('submit', this.multipleSelection)
      this.dialogVisible = false
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
    getList: debounce(
      async function () {
        let { tableData, countryId } = this
        if (!tableData[countryId] && !validatenull(countryId)) {
          this.tableLoading = true
          let [, res] = await awaitWrap(waybillSupportListByCountry({
            countryIdList: [countryId]
          }))
          if (res) {
            this.$set(tableData, countryId, res.detail)
          }
          this.tableLoading = false
        }
        tableData[countryId] && tableData[countryId].forEach(item => {
          item.$expressCostData = getExpressCost(
            this.data,
            item.expressFreightTemplateConfigList,
            item.expressFreightTemplate
          )
        })
      },
      200,
      true
    )
  }
}
</script>

<style lang="scss">
.select-express {
  .el-dialog__body {
    padding: 30px 20px 40px;
  }
  
  .el-table__header-wrapper {
    .cell {
      color: #9DA3AC;
    }
  }
}
</style>
