<template>
  <section class="designDetail">
    <div class="info-wrapper">
      <Exhibition class="exhibition" :data="figures"/>
      <PrototypeInfo
        class="prototype-info"
        :data="protoObj"
        :sup_this="sup_this"
        @updateCurPrimStruct="updateCurPrimStruct"
      />
    </div>
    <div class="info-wrapper">
      <anchorPointTabs :tabs="tabs">
        <template #productDetails>
          <el-row>
            <el-col :span="9" class="mb10">
              <span>中文名称:</span>
              <span class="ml10">{{ data.productDetails.name }}</span>
            </el-col>
            <el-col :span="9" class="mb10">
              <span>英文名称:</span>
              <span class="ml10">{{ data.productDetails.english_name }}</span>
            </el-col>
            <el-col :span="9">
              <span>生产工艺:</span>
              <span class="ml10">{{ data.productDetails.technology }}</span>
            </el-col>
            <el-col :span="9">
              <span>产品材质:</span>
              <span class="ml10">{{ data.productDetails.material }}</span>
            </el-col>
            <el-col :span="24" class="mt40">
              <span>其他描述:</span>
              <div class="mt10 a-color-default" v-html="data.productDetails.detail"></div>
            </el-col>
          </el-row>
        </template>
        <template #productSPEC>
          <sizeForm :data="sizeForms" :option="sizeFormsOption.productSPEC"></sizeForm>
        </template>
        <template #packSPEC>
          <sizeForm :data="sizeForms" :option="sizeFormsOption.packSPEC"></sizeForm>
        </template>
      </anchorPointTabs>
    </div>
  </section>
</template>

<script>
import Exhibition from './module/exhibition'
import PrototypeInfo from './module/prototypeInfo'
import MultipleViewSwiper from '@/components/multipleViewSwiper'
import anchorPointTabs from './module/anchorPointTabs'
import sizeForm from '@/views/components/sizeForm/index'

import { conversionCMToIN, conversionGToLB, file2Base64 } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  components: {
    Exhibition,
    PrototypeInfo,
    MultipleViewSwiper,
    anchorPointTabs,
    sizeForm
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    productData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      sup_this: this,
      protoObj: {},
      figures: [],
      curPrimStruct: {},
      
      tabs: [
        {
          label: '原型详情',
          prop: 'productDetails'
        },
        {
          label: '原型尺码',
          prop: 'productSPEC'
        },
        {
          label: '包装规格',
          prop: 'packSPEC'
        }
      ],
  
      sizeForms: [],
      sizeFormsOption: {
        productSPEC: {
          isDetail: true,
          showAddColumn: true,
          column: [
            {
              label: '尺码',
              prop: 'size_name'
            }
          ],
          addColumn: [
            {
              label: '长度',
              prop: 0
            },
            {
              label: '宽度',
              prop: 1
            }
          ]
        },
        packSPEC: {
          isDetail: true,
          column: [
            {
              label: '尺码',
              prop: 'size_name'
            },
            {
              label: '包装尺寸 (cm)<div class="text-mini">(长*宽*高)</div>',
              prop: 'size'
            },
            {
              label: '包装尺寸 (in)<div class="text-mini">(长*宽*高)</div>',
              prop: '$size'
            },
            {
              label: '包装体积 (cm³)',
              prop: 'volume'
            },
            {
              label: '包装体积 (in³)',
              prop: '$volume'
            },
            {
              label: '包装重量 (g)',
              prop: 'weight'
            },
            {
              label: '包装重量 (ib)',
              prop: '$weight'
            }
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters(['prim_color', 'prim_colorProps']),
    prim_struct({ protoObj: { prim_struct }, prim_color }) {
      prim_struct.forEach(struct => {
        if (struct.color_value) return struct
        struct.color_value = (
          prim_color.find(color => struct.prim_color === color[prim_colorProps.value])
          || {}
        ).color_value
      })
    }
  },
  watch: {
    data: {
      handler(n) {
        console.log('detail data', n, this.productData)
        this.sizeForms = n.sizeForms.map(sizeForm => {
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
        if (n.sizeForms.length === 0 && n.addColumns && n.addColumns.length) {
          this.sizeFormsOption.productSPEC.addColumn = n.addColumns
        }

        let { prim_color, prim_colorProps } = this
        let {
          delivery_time_min,
          delivery_time_max,
          material,
          technology
        } = n.productDetails
        let deliveryTime =
          delivery_time_min > 0 && delivery_time_max > 0 &&
          Number(delivery_time_max) > Number(delivery_time_min)
            ? `${delivery_time_min}~${delivery_time_max}`
            : ''
        this.protoObj.sizes = n.sizeForms.map(sizeForm => {
          return {
            ...sizeForm,
            material,
            technology,
            deliveryTime
          }
        })
        this.protoObj.prim_struct = n.structForms.map(struct => {
          if (struct.color_value) return struct
          return {
            ...struct,
            color_value: (
              prim_color.find(color => struct.prim_color === color[prim_colorProps.value])
              || {}
            ).color_value
          }
        })
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    async updateCurPrimStruct(curPrimStruct) {
      let { figures = [] } = curPrimStruct || {}
      this.curPrimStruct = curPrimStruct
  
      const pArr = []
      for (const figure of figures) {
        if (figure instanceof File) {
          pArr.push(file2Base64(figure))
        } else {
          pArr.push(figure.path)
        }
      }
      const res = await Promise.all(pArr)
      figures = res.map((base64) => {
        return {
          path: base64
        }
      })
      
      this.figures = Array.isArray(figures)
        ? figures.map(({ path }) => ({ small: path, mid: path }))
        : []
    }
  }
}
</script>

<style lang="scss" scoped>
.designDetail {
  width: calc(100% - 20px);
  margin: 0;
  padding: 0;
  color: #495060;
  
  .el-breadcrumb {
    font-size: 18px;
    
    ::v-deep {
      .el-breadcrumb__separator {
        margin: 0 3px;
      }
      
      .el-breadcrumb__item:last-child {
        .el-breadcrumb__inner {
          color: $color-primary !important;
        }
      }
    }
  }
  
  .card {
    box-sizing: border-box;
    width: 100%;
    height: 290px;
    border-radius: 4px;
    text-align: center;
    border: 1px solid $border-color;
  }
  
  .info-wrapper {
    padding-left: 20px;
    margin-top: 20px;
    width: 100%;
    display: flex;
    
    .exhibition {
      flex: 0 0 490px;
      height: 430px;
    }
    
    .prototype-info {
      flex: 1;
      margin-left: 40px;
    }
  }
}
</style>
