<template>
  <div class="tablePart">
    <el-table @selection-change="handleSelectionChange" :data="orderListData" border stripe>
      <template v-for="({ type, label, width, prop }, index) in attributeData">
        <el-table-column :key="index" v-if="type == 'selection'" :type="type"> </el-table-column>
        <el-table-column v-else-if="label == '物流'" :key="index" :label="label" :min-width="width">
          <template slot-scope="scope">
            <span class="Psize"
              ><b>收货人:</b> <i>{{ scope.row.consigneeName }}</i></span
            >
            <span class="Psize"
              ><b>国家:</b> <i>{{ scope.row.consigneeCountryCode }}</i></span
            >
            <br />
            <span class="Psize"
              ><b>物流方式:</b> <i>{{ getLabel('expressCompanyId', scope.row.expressCompanyId) }}</i></span
            >
            <span class="Psize"
              ><b>运单号:</b> <i>{{ scope.row.expressWaybillCode }}</i></span
            >
          </template>
        </el-table-column>
        <el-table-column :key="index" v-else-if="prop == 'isCustomsDeclaredExported'" :min-width="width" :label="label">
          <template slot-scope="{ row }">
            {{ row.isCustomsDeclaredExported ? '已导出' : '未导出' }}
          </template>
        </el-table-column>
        <el-table-column v-else-if="label == '物流到期时间'" :key="index" :label="label" :min-width="width">
          <template slot-scope="scope">
            <div v-if="parseInt(scope.row.expressExpireTime) <= 3">
              {{ scope.row.expressExpireTime }}
              <el-tag type="danger" size="mini" class="tixing">临近提醒</el-tag>
            </div>
            <div v-else>
              {{ scope.row.expressExpireTime }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :key="index" v-else-if="label == '订单状态'" :min-width="width" :label="label">
          <template slot-scope="{ row }">
            {{ ORDER_STATUS_LIST[row.orderStatus] }}
          </template>
        </el-table-column>

        <el-table-column :key="index" v-else :label="label" :min-width="width" :prop="prop"></el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
import { ORDER_STATUS_LIST } from '@/utils/constant'
import { attributeData } from './formData'
import { getLabel } from '@/components/avue/utils/util'

export default {
  props: {
    orderListData: {
      type: Array,
      required: true,
      default: []
    }
  },
  data() {
    return {
      ORDER_STATUS_LIST,
      attributeData,
      selectedData: []
    }
  },
  methods: {
    getLabel,
    handleSelectionChange(selection) {
      this.selectedData = selection
      this.$emit('updateSelectedData', selection)
    }
  }
}
</script>

<style scoped lang="scss">
.Psize {
  margin: 0 10px 0 0;
}
.tixing {
  margin-left: 10px;
}
</style>
