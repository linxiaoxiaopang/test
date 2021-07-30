<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="查看 SKU"
    :before-close="handleClose"
    width="638px"
  >
    <avue-crud
      :data="skuData"
      :option="option"
      :row-class-name="tableRowClassName"
      :span-method="spanMethod"
    >
      <template #product="{ row }">
        <div class="flex-middle">
          <el-image
            :src="product.prod_show_images[0].path"
            style="width: 32px; height: 32px"
            class="mr10"
          >
            <div slot="error" class="image-slot">
              <img
                src="@/assets/images/default.png"
                width="32"
                height="32"
                alt=""
                class="block"
              />
            </div>
          </el-image>
          {{ data.chinese_name }}
        </div>
      </template>
      <template #SKU="{ row, $index }">
        <div v-if="showEditSkuBtn !== $index">
          <span>{{ row.custom_sku || '暂无' }}</span>
          <i
            class="el-icon-edit editCustomBtn"
            @click="editCustomSkuBtn($index)"
          ></i>
        </div>
        <el-input
          :class="[`custom_sku${$index}`]"
          v-show="showEditSkuBtn === $index"
          size="small"
          v-model="row.custom_sku"
          @blur="showEditSkuBtn = -1"
          @change="changeCustomSku(row)"
        ></el-input>
      </template>

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
            @click="cliclCopy"
            >复制
          </el-button>
        </template>
      </template>
    </avue-crud>
    <span slot="footer">
      <div class="text-center">
        <el-button type="primary" size="small" @click="clickSureBtn"
          >确定</el-button
        >
      </div>
    </span>
  </el-dialog>
</template>

<script>
import { dialogComponentsMixin } from '@/mixins'
import { validatenull } from '@/components/avue/utils/validate'
import { editMyCustomSku } from '@/api/product/index'

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
        editBtn: false,
        delBtn: false,
        column: [
          {
            label: '产品图片/产品名称',
            prop: 'product',
            slot: true
          },
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
      },
      showEditSkuBtn: -1
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
    handleClose() {
      this.clickSureBtn()
    },
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
    cliclCopy() {
      this.$message.warning('暂无SKU')
    },
    editCustomSkuBtn($index) {
      this.showEditSkuBtn = $index
      this.$nextTick(function () {
        // el-table会生成多个table
        // 用ref获取不到tbody列里的元素
        document
          .querySelectorAll(
            `.el-table__body-wrapper .custom_sku${$index} .el-input__inner`
          )[0]
          .select()
      })
    },
    async changeCustomSku(row) {
      const [err, res] = await awaitWrap(
        editMyCustomSku(row.id, {
          custom_sku: row.custom_sku
        })
      )
      if (res) {
        this.$message.success('成功修改自定义SKU')
      } else {
        this.$message.info('修改自定义SKU失败')
      }
    },
    async clickSureBtn() {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style lang="scss">
.editCustomBtn {
  color: $--color-primary;
  margin-left: 15px;
  cursor: pointer;
}
</style>
