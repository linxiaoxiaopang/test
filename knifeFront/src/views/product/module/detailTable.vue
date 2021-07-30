<template>
  <div class="productInfo">
    <avue-crud
      :data="skuData"
      :option="option"
      :row-class-name="tableRowClassName"
    >
      <template #SKU="{ row }">
        {{ row.custom_sku || '暂无' }}
      </template>
      <template> </template>
      <template #menu="{ row }">
        <template v-if="row.custom_sku">
          <el-button
            :key="row.custom_sku"
            type="text"
            size="small"
            icon="el-icon-copy-document"
            v-copy="row.custom_sku"
            >复制
          </el-button>
        </template>
        <template v-else>
          <el-button
            :key="row.custom_sku"
            type="text"
            size="small"
            icon="el-icon-copy-document"
            @click="clickCopy"
            >复制
          </el-button>
        </template>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { dialogComponentsMixin } from '@/mixins'
import { validatenull } from '@/components/avue/utils/validate'

export default {
  mixins: [dialogComponentsMixin],
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      option: {
        menuWidth: 100,
        maxHeight: 290,
        editBtn: false,
        delBtn: false,
        menuFixed: 'normal',
        column: [
          {
            label: '尺码',
            prop: 'size'
          },
          {
            label: 'SKU',
            prop: 'SKU',
            slot: true
          }
        ]
      }
    }
  },
  computed: {
    product({ data }) {
      console.log(data)
      if (!validatenull(data.productIndex))
        return data.products[data.productIndex]
      return {}
    },
    skuData({ product }) {
      return product.spec_prods || []
    }
  },
  methods: {
    spanMethod({ row, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return [this.skuData.length, 1]
        } else {
          return [0, 0]
        }
      } else {
        return [1, 1]
      }
    },
    tableRowClassName() {},
    clickCopy() {
      this.$message.warning('暂无sku')
    }
  }
}
</script>

<style lang="scss">
.productInfo {
  .el-table--border::after,
  .el-table--group::after {
    width: 0px;
  }
  .el-table::before {
    width: 0px;
  }
}
</style>
