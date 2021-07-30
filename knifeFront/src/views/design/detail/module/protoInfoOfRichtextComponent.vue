<template>
  <div class="protoInfoOfRichtextComponent">
    <anchorPointTabs :tabs="tabs">
      <template #productDetails>
        <el-row>
          <el-col
            v-for="{ prop, label } in productInfoData"
            :key="prop"
            :span="9"
            class="mb10"
          >
            <span>{{ label }}</span>
            <span class="ml10">{{ data[prop] || '暂无' }}</span>
          </el-col>
          <el-col :span="24" class="mt20">
            <span>其他描述:</span>
            <div class="mt10 a-color-default" v-html="htmlStr || '暂无'"></div>
          </el-col>
        </el-row>
      </template>
      <template #productSPEC>
        <el-table class="productSizeTable" :data="productSizeData" stripe border="">
          <template v-for="{ prop, label, minWidth } in productSizeColum">
            <el-table-column
              :key="prop"
              :prop="prop"
              :label="label"
              :min-width="minWidth"
              align="center"
            ></el-table-column>
          </template>
        </el-table>
      </template>
      <template #packSPEC>
        <el-table class="packingTable" :data="packingTableData" stripe border="">
          <template v-for="{ prop, label, minWidth } in packingTableColum">
            <el-table-column
              :key="prop"
              :prop="prop"
              :label="label"
              :min-width="minWidth"
              align="center"
            ></el-table-column>
          </template>
        </el-table>
      </template>
      <template #recommend>
        <Recommend :hasTitle="false"></Recommend>
      </template>
    </anchorPointTabs>
  </div>
</template>

<script>
import { deepClone } from '@/components/avue/utils/util'
import { conversionCMToIN, conversionGToLB, getValueFromObj } from '@/utils'
import anchorPointTabs from './anchorPointTabs'
import Recommend from './recommend'
export default {
  components: {
    anchorPointTabs,
    Recommend
  },
  props: {
    label: String,
    htmlStr: String,
    openData: {
      type: Boolean,
      required: true
    },
    data: Object
  },
  data() {
    return {
      tabs: [
        {
          label: '产品详情',
          prop: 'productDetails'
        },
        {
          label: '产品尺码',
          prop: 'productSPEC'
        },
        {
          label: '包装规格',
          prop: 'packSPEC'
        },
        {
          label: '推荐产品',
          prop: 'recommend'
        }
      ],
      
      productInfoData: [
        { prop: 'name', label: '中文名称:' },
        { prop: 'english_name', label: '英文名称:' },
        { prop: 'technology', label: '生产工艺:' },
        { prop: 'material', label: '产品材质:' }
      ],
      designInfoData: [
        { prop: 'design1', label: '设计说明:' },
        { prop: 'design2', label: '设计区域:' },
        { prop: 'design3', label: '图片要求:' }
      ],
      productSizeColum: [],
      productSizeData: [],
      packingTableColum: [
        { prop: 'size_name', label: '尺码', minWidth: 100 },
        { prop: 'size', label: '包装尺寸(cm)', minWidth: 100 },
        { prop: '$size', label: '包装尺寸(in)', minWidth: 100 },
        { prop: 'volume', label: '包装体积(cm³)', minWidth: 100 },
        { prop: '$volume', label: '包装体积(in³)', minWidth: 100 },
        { prop: 'weight', label: '包装重量(g)', minWidth: 100 },
        { prop: '$weight', label: '包装重量(lb)', minWidth: 100 }
      ],
      packingTableData: []
    }
  },
  watch: {
    data: {
      handler(n) {
        if (n.introduce_attr) {
          this.productSizeColum = [{ prop: 'size_name', label: '尺码', minWidth: 100 }]
          this.productSizeData = deepClone(n.sizes)

          let introduce_detail = getValueFromObj(n, 'introduce_attr[0].introduce_detail')
          // console.log(introduce_detail)
          if (introduce_detail) {
            let propColDatas = JSON.parse(introduce_detail)
            console.log(propColDatas)
            for (const key in propColDatas[0]) {
              this.productSizeColum.push({
                label: propColDatas[0][key].label + '(cm/in)',
                prop: key,
                minWidth: 100
              })
            }
            this.productSizeData.forEach((row, index) => {
              for (const key in propColDatas[index]) {
                let value = propColDatas[index][key].value
                row[key] = `${value}/${conversionCMToIN(value)}`
              }
            })
          }

          this.packingTableData = n.sizes.map((sizeForm) => {
            let {
              length,
              width,
              height,
              weight
            } = sizeForm
            length = length || 0
            width = width || 0
            height = height || 0
            weight = weight || 0
            let $length = conversionCMToIN(length)
            let $width = conversionCMToIN(width)
            let $height = conversionCMToIN(height)
            return {
              ...sizeForm,
              size: `${length}*${width}*${height}`,
              $size: `${$length}*${$width}*${$height}`,
              volume: length * width * height,
              $volume: $length * $width * $height,
              weight,
              $weight: conversionGToLB(weight)
            }
          })
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.protoInfoOfRichtextComponent {
  padding: 30px 0px;
  // border: 1px solid $border-color;
  margin: 20px 0;
  border-radius: 4px;
  color: $color-title;
  font-size: 14px;
  .title {
    border-bottom: 1px dashed #dcdee0;
    padding-bottom: 20px;
  }
  .productInfo {
    .productInfoContainer {
      margin-top: 20px;
      font-size: 12px;
      padding-bottom: 20px;
      .productInfoContainer1 {
        display: flex;
        height: 50px;
        flex-wrap: wrap;
        .productInfoContainer1Item {
          margin-bottom: 10px;
          width: 300px;
          .productInfoContainerTitle {
            color: #999;
          }
          .productInfoContainerFont {
            color: #666;
            margin-left: 10px;
          }
        }
      }
      .productInfoContainer2 {
        margin-top: 20px;
        .productInfoContainerTitle {
          color: #333;
        }
        .productInfoContainerFont {
          margin-top: 10px;
          color: #666;
        }
      }
    }
  }
  .designInfo {
    padding-bottom: 20px;
    .designInfoContainer {
      margin-top: 20px;
      font-size: 12px;
      .designInfoContainerItem {
        margin-bottom: 10px;
        .designInfoContainerTitle {
          color: #333;
        }
        .designInfoContainerFont {
          color: #666;
          margin-left: 10px;
        }
      }
    }
  }
  .productSize {
    padding-bottom: 20px;
    .productSizeTable {
      margin-top: 20px;
      border-left: 1px solid #ebeef5;
    }
  }
  .packingInfo {
    .packingTable {
      margin-top: 20px;
      border-left: 1px solid #ebeef5;
    }
  }
  ::v-deep .recommendComponent {
    padding: 0;
    margin-top: 0;
    > .swiper-container {
      padding: 0 50px;
    }
    .swiper-button-next {
      margin-right: 0;
    }
    .swiper-button-prev {
      margin-left: 0;
    }
  }
}
</style>
