<template>
  <div class="app-container personalInfoPage">
    <avue-crud
      ref="crud"
      :data="finalData"
      :table-loading="tableLoading"
      :option="tableOption"
      :page="tablePage"
      :span-method="spanMethod"
      @size-change="sizeChange"
      @current-change="pageChange"
      @search-reset="searchChange"
      @search-change="searchChange"
      class="flex-one-page"
    >
      <template #product="{ row: { path, chinese_name, products, $rowIndex } }">
        <div class="product-info">
          <el-image :src="path[0]" :preview-src-list="path">
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
          <div class="text-cut">{{ validData(chinese_name, '暂无') }}</div>
        </div>
        <el-carousel
          :autoplay="false"
          indicator-position="none"
          height="50px"
          class="colors-carousel"
          :arrow="products.length <= 5 ? 'never' : 'hover'"
        >
          <el-carousel-item
            v-for="(item, itemIndex) in Math.ceil(products.length / 5)"
            :key="itemIndex"
          >
            <div class="colors">
              <div
                class="color-wrapper"
                v-for="(product, index) in products.slice(
                  itemIndex * 5,
                  item * 5
                )"
                :key="index"
                :style="{ background: product.color_value }"
                @click.stop.prevent="handleProductClick($rowIndex, index)"
              >
                <div
                  :class="[
                    'color',
                    tableData[$rowIndex] &&
                      tableData[$rowIndex].$productIndex === index &&
                      'active'
                  ]"
                ></div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </template>
      <template #user_sku="{ row, $index }">
        <el-tooltip
          v-if="row.owner_name"
          class="flex-middle hover-input"
          effect="dark"
          :content="row.user_sku"
        >
          <div>
            <el-input
              :ref="`user_sku${$index}`"
              v-model="row.user_sku"
              v-show="focusRowIndex === $index"
              :class="['input-text', `user_sku${$index}`]"
              size="mini"
              @blur="focusRowIndex = -1"
              @change="handleSkuChange(row)"
              @keydown.enter="handleSkuChange(row)"
            ></el-input>
            <span v-show="focusRowIndex !== $index" class="text-cut">
              {{row.user_sku}}
            </span>
            <el-button
              v-show="focusRowIndex !== $index"
              type="text"
              icon="el-icon-edit"
              @click="handleSkuClick($index)"
            ></el-button>
          </div>
        </el-tooltip>
      </template>
      <template #create_time="{ row }">
        {{ parseCharacterTime(row.create_time) }}
      </template>
      <template #menu="{ row }">
        <el-button
          v-if="row.owner_name"
          type="text"
          @click="delRelationSku(row.id)"
          v-p="['product:sku_map:delete']"
          >取消关联
        </el-button>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { tableOption } from '@/views/product/public/constant'
import { avueCrud } from '@/mixins'
import { getRelationProduct as getList } from '@/api/product'
import { editRelationSku, delRelationSku } from '@/api/product/knifeApi'
import { validatenull } from '@/components/avue/utils/validate'
import { parseCharacterTime } from '@/utils'

export default {
  mixins: [
    avueCrud({
      tableOption,
      getList,
      request: 'python'
    })
  ],
  data() {
    return {
      focusRowIndex: -1,
      finalData: []
    }
  },
  mounted() {
    document.body.style.overflow = 'hidden'
    this.$once('hook:destroyed', () => {
      document.body.style.overflow = ''
    })
  },
  methods: {
    handleProductClick($rowIndex, index) {
      if (this.tableData[$rowIndex]) {
        if (
          this.validateProductRelation(
            this.tableData[$rowIndex].products[index]
          )
        ) {
          this.tableData[$rowIndex].$productIndex = index
          this.getFinalData()
        } else {
          this.$message.warning('该款式没有关联任何的sku')
        }
      }
    },
    // 验证产品款式是否已关联外部sku
    validateProductRelation(product) {
      return product.spec_prods.some((sysSku) => !validatenull(sysSku.sku_maps))
    },
    handleSkuClick(rowIndex) {
      this.focusRowIndex = rowIndex
      this.$nextTick(function () {
        // el-table会生成多个table
        // 用ref获取不到tbody列里的元素
        document
          .querySelectorAll(
            `.el-table__body-wrapper .user_sku${rowIndex} .el-input__inner`
          )[0]
          .select()
      })
    },
    handleSkuChange(row) {
      editRelationSku(row.id, {
        user_sku: row.user_sku
      }).then((res) => {
        this.$isSuccess({
          ...res,
          success: this.init
        })
      })
    },
    afterInit() {
      this.tableData.forEach((row) => {
        this.$set(row, '$productIndex', 0)
      })
      this.getFinalData()
    },
    getFinalData() {
      this.finalData = []
      let { sys_sku, user_sku, custom_sku } = this.postData
      let sysSkuReg = new RegExp(sys_sku && sys_sku.trim(), 'img')
      let userSkuReg = new RegExp(user_sku && user_sku.trim(), 'img')
      let customSkuReg = new RegExp(custom_sku && custom_sku.trim(), 'img')
      this.tableData.forEach((row, rowIndex) => {
        let products = row.products.filter(product => {
          return product.spec_prods.some(sysSku => {
            sysSkuReg.lastIndex = 0
            customSkuReg.lastIndex = 0

            return (
                    validatenull(sys_sku) ||
                    sysSkuReg.test(sysSku.SKU)
                ) &&
                (
                    validatenull(custom_sku) ||
                    customSkuReg.test(sysSku.custom_sku)
                )
          })
        })
        let product = products[row.$productIndex]
        let productUserSku = [] // 产品当前款式的所有外部sku
        if (product) {
          product.spec_prods.forEach((sysSku) => {
            sysSkuReg.lastIndex = 0
            customSkuReg.lastIndex = 0
            if (
              (
                validatenull(sys_sku) ||
                sysSkuReg.test(sysSku.SKU)
              ) &&
              (
                validatenull(custom_sku) ||
                customSkuReg.test(sysSku.custom_sku)
              )
            ) {
              let sysSkuUserSku = [] // 该内部SKU对应的外部SKU
      
              let sku_maps = sysSku.sku_maps
      
              sku_maps.forEach((userSku) => {
                userSkuReg.lastIndex = 0
                if (
                  validatenull(user_sku) ||
                  userSkuReg.test(userSku.user_sku)
                ) {
                  userSku.$rowIndex = rowIndex
          
                  userSku.chinese_name = row.chinese_name
          
                  userSku.products = products
          
                  userSku.path = (product.prod_show_images ?? []).map(
                    (image) => image.path
                  )
          
                  userSku.size = sysSku.size
                  userSku.SKU = sysSku.SKU
                  userSku.custom_sku = sysSku.custom_sku || '暂无'
          
                  sysSkuUserSku.push(userSku)
                }
              })
              // console.log('sysSkuUserSku', sysSkuUserSku)
              if (!validatenull(sysSkuUserSku)) {
                sysSkuUserSku[0].sysSkuUserSkuLen = sysSkuUserSku.length // 该内部SKU对应的外部SKU总数
                sysSkuUserSku[0].sysSkuUserSkuIndex = 0 // 该内部SKU对应的第一个外部SKU
                productUserSku = productUserSku.concat(sysSkuUserSku)
              }
            }
          })
          // console.log('productUserSku', productUserSku)
          if (!validatenull(productUserSku)) {
            productUserSku[0].productUserSkuLen = productUserSku.length // 产品当前款式的所有外部sku总数
            productUserSku[0].productUserSkuIndex = 0 // 产品当前款式的第一个外部sku
            this.finalData = this.finalData.concat(productUserSku)
          }
        }
      })
    },
    spanMethod({ row, columnIndex }) {
      if (columnIndex === 0) {
        if (row.productUserSkuIndex === 0) {
          return [row.productUserSkuLen, 1]
        } else {
          return [0, 0]
        }
      } else if ([1, 2].includes(columnIndex)) {
        if (row.sysSkuUserSkuIndex === 0) {
          return [row.sysSkuUserSkuLen, 1]
        } else {
          return [0, 0]
        }
      } else {
        return [1, 1]
      }
    },
    getColors(products) {
      return products.filter((product) =>
        product.spec_prods.every((sys_sku) => !validatenull(sys_sku.sku_maps))
      )
    },
    parseCharacterTime,
    delRelationSku(id) {
      this.$reconfirm({
        success: () => {
          delRelationSku(id).then((res) => {
            this.$isSuccess({
              ...res,
              success: this.init
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.hover-input {
  $border-bottom: 1px dotted;

  .el-input__inner {
    padding: 0;
    background-color: transparent;
  }

  .el-button {
    display: none;
  }

  .el-input {
    border-bottom: $border-bottom;
  }

  &:hover {
    .text-cut {
      border-bottom: $border-bottom;
    }

    .el-button {
      display: inline-block;
    }
  }
}

.product-info {
  display: flex;
  align-items: center;

  .el-image {
    width: 56px;
    height: 56px;
    margin-right: 5px;
  }

  .text-cut {
    width: calc(100% - 61px);
  }
}

.flex-one-page {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  height: 100%;
  .el-table {
    flex: 1;
    overflow: auto;
  }
}
</style>
