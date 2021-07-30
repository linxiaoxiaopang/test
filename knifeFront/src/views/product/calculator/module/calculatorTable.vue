<template>
  <div v-show="dialogVisible" class="product-calculator-table">
    <el-table
      :data="tableData"
      border
      class="table-border first-header-transparent"
      :span-method="spanMethod"
      :row-class-name="rowClassName"
    >
      <el-table-column>
        <template #header="{ row }">
          <span>建议采购数量：</span>
          <span class="text-striking">{{ optimalMethod.count }}</span>
          <span class="ml40">建议物流：</span>
          <span class="text-striking">{{ optimalMethod.shippingMethodName }}</span>
          <span class="ml40">最低均摊单件成本：</span>
          <span class="text-striking">{{ optimalMethod.averageUnitCost }}</span>
        </template>
        <el-table-column prop="name" label="规格" min-width="200" class-name="bg-white">
          <template #default="{ row }">
            <span v-if="productInfo.$isCustom">自定义</span>
            <div v-else class="text-center">
              <div>
                {{ productInfo.name }} ({{ productInfo.sex }})
              </div>
              <div>
                <div class="inline-block nowrap">颜色：{{ productInfo.color }}</div>
                <div class="inline-block nowrap ml10">尺码：{{ productInfo.size }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="物流" min-width="188" class-name="bg-white">
          <template #default="{ row }">
            <div>{{ row.shippingMethodName }}</div>
            <div>
              参考物流时效：{{ row.startReferTimeLimitation }}~{{ row.endReferTimeLimitation }}天
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="count" label="购买数量"></el-table-column>
        <el-table-column prop="timeLimit" label="计费重量 (g)" min-width="218">
          <template #default="{ row }">
            <div>
              估算总重：{{ row.$chargedWeight.toFixed(2) }}
              <el-tooltip v-if="row.$isByVolumetricWeight" class="ml20" effect="dark" placement="top-start">
                <template #content>
                  <div class="mb5">计泡重量 > 实际重量，计费重量采取计泡重量</div>
                  <div>计泡重量 = 长 * 宽 * 高 / 材积除数</div>
                </template>
                <span class="text-mini text-primary">
                  计泡
                  <svg-icon icon-class="prompt1" class-name="svg-icon-prompt"></svg-icon>
                </span>
              </el-tooltip>
            </div>
            <div>({{ row.length }}*{{ row.width }}*{{ row.height }}*{{ row.count }}cm³)</div>
          </template>
        </el-table-column>
        <el-table-column prop="timeLimit" label="产品/物流成本明细 (￥)" min-width="188">
          <template #default="{ row }">
            <div>产品单价：{{ row.price }}</div>
            <div>产品总价：{{ row.productTotalPrice }}</div>
            <div>
              物流费用：
              <span v-if="row.$isOverflow" class="text-striking">不在重量范围内</span>
              <expressCostProcess v-else :data="row"></expressCostProcess>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="totalPrice" label="总成本 (￥)" min-width="98"></el-table-column>
        <el-table-column prop="averageUnitCost" label="均摊单价成本 (￥)" min-width="138"></el-table-column>
        <el-table-column prop="timeLimit" label="收益 (￥)" min-width="158">
          <template #default="{ row }">
            <template v-if="row.$isOverflow || !row.sellingPrice"> — — </template>
            <template v-else>
              <div>单件收益：{{ row.singleIncome }}</div>
              <div>总收益：{{ row.totalIncome }}</div>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="profitRatePerUnit" label="单件利润率" min-width="98"></el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import getPrivateRowValue from '@/views/product/calculator/module/selectProduct/getPrivateRowValue'
import {dialogComponentsMixin} from '@/mixins'
import expressCostProcess from './expressCostProcess'
import { accAdd, accDiv, accMul, accSub, getExpressCost } from '@/utils'

export default {
  mixins: [dialogComponentsMixin, getPrivateRowValue],
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    expressCostProcess
  },
  data() {
    return {
      tableData: [],
      optimalMethod: {}
    }
  },
  computed: {
    productInfo({ data }) {
      let {
        product: {
          $isCustom,
          name,
          $sex: sex,
          structs = [],
          sizes = []
        } = {},
        form: {
          color,
          size,
          count = []
        } = {}
      } = data
      return {
        $isCustom,
        name,
        sex,
        color: structs[color] && structs[color].color_name,
        size: sizes[size] && sizes[size].size_name,
        count: count.filter(num => num).sort((a, b) => a - b)
      }
    }
  },
  watch: {
    data: {
      handler(n) {
        console.log(n)
        if (this.dialogVisible) {
          let tableData = []
          n.form.expressChannel.forEach(channel => {
            let {
              $expressCostData: {
                templateConfigList = [],
                template = {},
                cost = 0
              } = {}
            } = channel
            let counts = n.form.count.filter(count => count)
            counts.forEach((count, index) => {
              let expressCostData = getExpressCost(
                n.form,
                templateConfigList,
                {
                  calculateMode: template.$calculateMode,
                  isByActualWeight: template.isByActualWeight,
                  isByVolumetricWeight: template.isByVolumetricWeight,
                  volumeDivisor: template.$volumeDivisor
                },
                count
              )
              templateConfigList = expressCostData.templateConfigList
              template = expressCostData.template
              cost = expressCostData.cost
              // console.log(expressCostData)
              
              let productTotalPrice = accMul(n.form.price, count)
              let totalPrice = ' — — '
      
              let averageUnitCost = ' — — '
              let singleIncome
              let totalIncome
              let profitRatePerUnit = ' — — '
              if (!template.$isOverflow) {
                totalPrice = accAdd(productTotalPrice, cost)
                averageUnitCost = accDiv(totalPrice, count)
        
                if (n.form.sellingPrice) {
                  singleIncome = accSub(n.form.sellingPrice, averageUnitCost)
                  totalIncome = accMul(singleIncome, count)
                  profitRatePerUnit = (accDiv(singleIncome, averageUnitCost) * 100).toFixed(2) + '%'
  
                  singleIncome = singleIncome.toFixed(2)
                  totalIncome = totalIncome.toFixed(2)
                }
              
                totalPrice = totalPrice.toFixed(2)
                averageUnitCost = Number(averageUnitCost.toFixed(2))
              }
              productTotalPrice = productTotalPrice.toFixed(2)
      
              tableData.push({
                ...channel,
                ...n.form,
                ...template,
                templateConfigList,
                isFirstCount: index === 0,
                countsLength: counts.length,
                cost: cost.toFixed(2),
                count,
                productTotalPrice,
                averageUnitCost,
                totalPrice,
                profitRatePerUnit,
                singleIncome,
                totalIncome
              })
            })
          })
          if (tableData.length) {
            this.optimalMethod = tableData.reduce((prev, next) => {
              if (!prev) {
                return next
              }
    
              if (prev.$isOverflow && next.$isOverflow) {
                return prev
              } else if (!prev.$isOverflow && !next.$isOverflow) {
                // console.log(prev.averageUnitCost, next.averageUnitCost, prev.averageUnitCost > next.averageUnitCost)
                if (prev.averageUnitCost > next.averageUnitCost) {
                  return next
                } else {
                  return prev
                }
              } else if (!prev.$isOverflow) {
                return prev
              } else if (!next.$isOverflow) {
                return next
              }
    
            })
            // console.log(this.optimalMethod, tableData)
            this.optimalMethod.isSelected = true
          }
          this.tableData = tableData
        }
      },
      deep: true
    }
  },
  methods: {
    spanMethod({ row, rowIndex, columnIndex }) {
      // console.log(column.label, rowIndex, columnIndex)
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return [this.tableData.length, 1]
        } else {
          return [0, 0]
        }
      }
      
      if (columnIndex === 1) {
        if (row.isFirstCount) {
          return [row.countsLength, 1]
        } else {
          return [0, 0]
        }
      }
      return [1, 1]
    },
    rowClassName({ row }) {
      if (row.isSelected) return 'row-selected'
    }
  }
}
</script>

<style lang="scss">
.product-calculator-table {
  margin: 18px 0 58px;
  .svg-icon.svg-icon-prompt {
    font-size: 14px;
  }
}
.el-table .row-selected {
  background-color: rgba(56, 65, 219, .03);
}
</style>
