<template>
  <el-popover
    ref="popover"
    placement="top"
    width="770"
    trigger="hover"
    popper-class="express-cost-process text-title"
    @after-enter="afterEnter">
    <div class="pl15">
      <div v-if="data.$isByVolumetricWeight" class="mb10">
        计费重量 = 最大值({{ data.$volumetricWeight }}, {{ data.weight }})={{ data.$chargedWeight }} 克
        <span class="text-striking">（计泡）</span>
      </div>
      <div class="mb20">
        物流费用 =
        <template v-if="calculateMode === 1">
          【{{ data.firstFreight }}+[({{ data.$chargedWeight }}-{{ data.firstWeight }})/{{ data.continuedWeight }}]*{{ data.continuedFreight }}】+{{ data.registrationFee }}+{{ data.emergencySurcharge }}={{ data.cost }}
        </template>
        <template v-else-if="calculateMode === 2">{{ data.freight }}+{{ data.registrationFee }}+{{ data.emergencySurcharge }}={{ data.cost }} 元</template>
      </div>
    </div>
  
    <el-table
      :data="data.templateConfigList"
      border
      max-height="550px"
      class="table-border first-header-transparent mb10"
      :row-class-name="rowClassName"
    >
      <el-table-column>
        <template #header="{ row }">
          <div class="flex-between">
            <div>
              物流渠道：{{ data.shippingMethodName }}
            </div>
            <div>
              寄达国家：{{ data.$country }}
            </div>
          </div>
        </template>
        <el-table-column
          v-for="(col, index) in column"
          :key="index"
          :prop="col.prop"
        >
          <template #header="{ row }">
            <div class="text-center">
              <div>
                {{ col.label }}
              </div>
              <div>
                {{ col.subLabel }}
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  
    <el-table :data="[{}]" border max-height="550px" class="table-border">
      <el-table-column label="计算公式">
        <template>
          <div class="calculator-description">
            <div v-if="calculateMode === 1">
              物流费用 =【首重价格 +[( 计费重量 - 首重）/ 续重单位重量 ]* 续重单位价格】+ 挂号费 + 紧急情形附加费
            </div>
            <div v-else-if="calculateMode === 2">
              物流费用 = 费用 + 挂号费 + 紧急情形附加费
            </div>
            <div>
              计费重量 = 最大值 ( 总体积 / 材积除数 = 计泡重量，实际重量）
            </div>
            <div>
              注：[( 计费重量 - 首重）/ 续重单位重量 ] 的数据结果需向上取整。
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    
    <span slot="reference" class="text-primary">{{ data.cost }}</span>
  </el-popover>
</template>

<script>
import { columns } from '@/views/product/calculator/module/expressCostProcess/const'

export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      tableData: []
    }
  },
  computed: {
    column({ calculateMode }) {
      return columns[calculateMode]
    },
    calculateMode({ data }) {
      // console.log(data.$calculateMode)
      return data.$calculateMode
    },
    rowClassName({ data }) {
      return ({ row }) => {
        if (row.id === data.id) return 'row-selected'
      }
    }
  },
  methods: {
    afterEnter() {
      this.$refs.popover.updatePopper()
    }
  }
}
</script>

<style lang="scss">
.express-cost-process {
  padding: 20px 20px 30px;
  .el-table {
    &.first-header-transparent {
      thead {
        tr:first-child th {
          height: 45px;
        }
      
        tr:nth-child(2) .cell {
          padding: 0;
        }
      }
    
      .cell {
        color: $color-title;
      }
    }
  
    .el-table__body-wrapper {
      .cell {
        color: $color-content;
      }
    }
  
    thead.is-group th {
      background-color: #F7F8FA;
    }
  }
  .calculator-description {
    line-height: 28px;
  }
  .el-popover__reference {
    cursor: pointer;
  }
}
</style>
