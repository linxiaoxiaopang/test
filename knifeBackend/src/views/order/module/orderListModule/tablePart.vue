<template>
  <div class="tablePart">
    <el-table v-loading="tableLoading" :data="orderListData" border @selection-change="selectionChange">
      <template v-for="({ type, label, prop, width }, index) in tableFormData">
        <el-table-column :key="index" v-if="type == 'selection'" :type="type"></el-table-column>
        <el-table-column :key="index" v-else-if="label == '物流到期时间'" :min-width="width" :label="label">
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
        <el-table-column :key="index" v-else-if="label == '刀版图状态'" :min-width="width" :label="label">
          <template slot-scope="{ row: { isKnifeLayoutCreated } }">
            {{ KnifeLayout(isKnifeLayoutCreated) }}
          </template>
        </el-table-column>

        <el-table-column :key="index" v-else-if="label == '物流渠道'" :min-width="width" :label="label">
          <template slot-scope="{ row: { expressCompanyId } }">
            {{ getLabel('expressCompanyId', expressCompanyId) }}
          </template>
        </el-table-column>

        <el-table-column
          :key="index"
          v-else-if="label == '操作'"
          :min-width="width"
          :label="label"
          fixed="right"
          align="center"
        >
          <template slot-scope="scoped">
            <changeStateBtn :data="scoped.row" :sup_this="sup_this" v-p="['order:order:update']"></changeStateBtn>
            <span class="line"></span>
            <Edit
              v-if="canEdit(scoped.row)"
              :data="scoped.row"
              :type="1"
              :id="scoped.row.id"
              :sup_this="sup_this"
              :orderStatus="orderStatus"
              v-p="['order:orderItem:update']"
            >
              编辑
            </Edit>
            <Edit :data="scoped.row" :isProTable="true" :id="scoped.row.id" v-p="['order:orderItem:list']">
              查看详情
            </Edit>
          </template>
        </el-table-column>
        <el-table-column :key="index" v-else :prop="prop" :min-width="width" :label="label"></el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
import { tableFormData } from './tablePartData'
import changeStateBtn from './changeStateBtn'
import orderDetile from './orderDetile'
import editBtn from './editBtn'
import Edit from './edit'
import { WAIT_RELATION, WAIT_GENERATE_WAYBILL, WAIT_DISPATCH, IN_DISPATCH, DELIVER, FINISH } from '@/utils/constant'
import { deepClone, getLabel } from '@/components/avue/utils/util'

export default {
  components: {
    changeStateBtn,
    orderDetile,
    editBtn,
    Edit
  },
  props: {
    orderListData: {
      type: Array,
      required: true,
      default: [],
      factoryData: []
    },
    tableLoading: {
      type: Boolean,
      default: false
    },
    sup_this: {
      type: Object,
      required: true
    },
    orderStatus: {
      type: String
    }
  },
  data() {
    return {
      tableFormData
    }
  },
  computed: {
    canEdit() {
      return (row) => {
        const { orderStatus } = row
        const temArr = [WAIT_RELATION, WAIT_GENERATE_WAYBILL, WAIT_DISPATCH, IN_DISPATCH]
        return true
        return temArr.includes(orderStatus)
      }
    },
    KnifeLayout() {
      return (data) => {
        if (data == '0') {
          return '未全部生成'
        } else {
          return '已全部生成'
        }
      }
    },
    expressCompany() {
      return (data) => {
        switch (data) {
          case 1:
            return '申通'
            break
          case 4:
            return '顺丰'
            break
          case 2:
            return 'fedex'
            break
          case 6:
            return '极兔'
            break
        }
      }
    }
  },
  watch: {
    'sup_this.orderStatus': {
      handler(n) {
        this.tableFormData = deepClone(tableFormData)
        if (![DELIVER, FINISH].includes(n)) {
          this.tableFormData.splice(tableFormData.length - 2, 1)
        }
        if ([WAIT_RELATION].includes(n)) {
          const knifeLayoutCreatedProp = 'isKnifeLayoutCreated'
          const index = this.tableFormData.findIndex(({ prop }) => prop === knifeLayoutCreatedProp)
          if (index >= 0) {
            this.tableFormData.splice(index, 1)
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    getLabel,
    selectionChange(selection) {
      this.factoryData = []
      const that = this
      selection.filter((value) => {
        const id = value.id
        that.factoryData.push(id)
      })
      this.$emit('takeFactory', this.factoryData)
    }
  }
}
</script>

<style lang="scss" scoped>
.tablePart {
  margin-top: 20px;
}
.tixing {
  margin-left: 10px;
}
</style>
