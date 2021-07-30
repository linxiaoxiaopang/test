<template>
  <div class="prototypeInfoComponent">
    <div class="top-info mb30">
      <div class="name-wrapper">
        <div class="name">{{ data.name }}</div>
        <div class="primary-btn" @click="$router.push('/product/calculator')">￥成本计算器</div>
      </div>
    </div>
    <priceTable :priceData="allSizesData[size] || []" class="mb30"></priceTable>
  
    <div class="mb30 flex-middle">
      <span class="label">参数</span>
      <div class="el-row flex-one">
        <div
          v-for="item in paramsList"
          :key="item.prop"
          class="el-col-6 text-left"
        >
          <div class="inline-block text-center">
            <div class="mb10">{{
                curSizeData[item.prop]
                  ? curSizeData[item.prop] + (item.unit || '')
                  : '暂无'
              }}</div>
            <div class="text-content">{{ item.label }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="mb30">
      <span class="label">颜色</span>
      <el-radio-group v-model="color" size="mini">
        <el-radio
          border
          class="color-radio"
          :key="index"
          :label="id"
          :style="{
          'margin-left': 0,
          backgroundColor: color_value
        }"
          v-for="({ prim_color, color_value, id }, index) in primStructs"
        >
          <span :style="{ backgroundColor: prim_color.color_value }"></span>
        </el-radio>
      </el-radio-group>
    </div>
    
    <div class="mb30">
      <span class="label">尺码</span>
      <el-radio-group v-model="size" size="mini">
        <el-radio
          border
          :key="index"
          :label="id"
          class="size-radio"
          v-for="({ size_name, id }, index) in sizes"
        >
          <span class="size-name">{{ size_name }}</span>
        </el-radio>
      </el-radio-group>
    </div>
    
    <div class="btn-wrapper">
      <el-button type="primary" @click="linkToDesign"> 开始设计 </el-button>
      <div class="collection" @click="love">
        <i
          :class="[
            'fa',
            (data.collect && 'el-icon-star-on active') || 'el-icon-star-off'
          ]"
          aria-hidden="true"
        ></i>
        <span>{{ data.collect ? '取消收藏' : '收藏' }} </span>
      </div>
    </div>
  </div>
</template>

<script>
import collectionPrivateMixin from '../../mixins/collectionPrivateMixin'
import priceTable from './priceTable'
export default {
  mixins: [collectionPrivateMixin],
  props: {
    data: {
      type: Object,
      required: false
    }
  },
  async created() {},

  data() {
    return {
      size: undefined,
      color: undefined,
      figures: [],
      priceData: [],
      priceColData: [],
      openFont: '展开',
      paramsList: [
        {
          label: '发货时效',
          prop: 'deliveryTime',
          unit: ' 天'
        },
        {
          label: '重量（含包装）',
          prop: 'weight',
          unit: 'g'
        },
        {
          label: '材质',
          prop: 'material'
        },
        {
          label: '生产工艺',
          prop: 'technology'
        }
      ]
    }
  },
  components: {
    priceTable
  },
  watch: {
    color(newVal) {
      if (newVal) {
        const curPrimStruct = this.findInfoById(newVal, this.primStructs || [])
        this.$emit('updateCurPrimStruct', curPrimStruct)
      }
    }
  },

  computed: {
    // cover() {
    //   return (figures) => {
    //     try {
    //       return figures[0].path || require("@/assets/images/default.png");
    //     } catch (e) {
    //       return require("@/assets/images/default.png");
    //     }
    //   };
    // },
    allSizesData() {
      try {
        const tmpObj = {}
        const { sizes } = this.data
        sizes.map((item) => {
          const { price_confs, id } = item
          tmpObj[id] = []
          let lastIndex = price_confs.length - 1
          price_confs.map((cItem, index) => {
            const {
              gear_conf: { min_count, max_count },
              price
            } = cItem
            if (lastIndex === index) {
              tmpObj[id].push({
                price,
                batch: `${min_count}+件价格`
              })
            } else {
              tmpObj[id].push({
                price,
                batch: `${min_count}-${max_count}件价格`
              })
            }
          })
        })
        // console.log('tmpObj[id]',tmpObj[id]);
        return tmpObj
      } catch (err) {
        return {}
      }
    },
    primStructs() {
      const { prim_struct = [] } = this.data || {}
      if (!this.color) {
        this.color = prim_struct[0] && prim_struct[0].id
      }
      return prim_struct
    },
    sizes() {
      const sizes = this.data.sizes || []
      if (!this.size) {
        this.size = sizes[0] && sizes[0].id
      }
      return sizes
    },
    baseSizeId() {
      const baseSizes = this.data.base_sizes || []
      if (baseSizes.length) {
        return baseSizes[0]
      }
    },
    curSizeData({ data }) {
      if (data.deliveryTime === undefined) {
        let {
          delivery_time_min,
          delivery_time_max
        } = data
        data.deliveryTime = delivery_time_min > 0 && delivery_time_max > 0
          ? `${delivery_time_min}~${delivery_time_max}`
          : ''
      }
      let tempObj = {
        ...data
      }
      if (this.size) {
        Object.assign(tempObj, this.findInfoById(this.size, this.sizes || []))
      }
      return tempObj
    }
  },
  methods: {
    findInfoById(id, arr) {
      const data = arr.filter(({ id: itemId }) => {
        return itemId == id
      })
      return data[0] || {}
    },
    opendetialInfo() {
      if(this.openFont == '展开') {
        this.$emit('getOpenFontData',true)
        this.openFont = '收起'

      } else {
        this.openFont = '展开'
        this.openFontData = !this.openFontData
        this.$emit('getOpenFontData',false)
      }
    },
    linkToDesign() {
      this.$router.push(
        `/design/designContainer?id=${this.baseSizeId}&protoId=${this.data.id}&structId=${this.color}`
      )
    }
  }
}
</script>

<style lang="scss" coped>
.prototypeInfoComponent {
  color: $color-title;
  font-size: 14px;
  .top-info {
    display: flex;
    justify-content: space-between;
    .name-wrapper {
      display: flex;
      justify-content: space-between;
      flex: 1;
      text-align: left;
      line-height: 28px;
      .name {
        flex: 1;
        font-size: 20px;
        color: $color-title;
        font-weight: 600;
      }
      .sub-title {
        span {
          color: $color-gray;
          margin-right: 10px;
          font-size: 14px;
        }
      }
    }
    .money-wrapper {
      text-align: center;
      color: $color-danger;
      font-weight: 600;
      line-height: 28px;

      .time {
        font-size: 20px;
        font-weight: 600;
      }
      .average {
        font-size: 12px;
      }
    }
  }
  .el-tag {
    margin-right: 5px;
    margin-top: 5px;
  }

  .label {
    margin-right: 30px;
    line-height: 40px;
  }

  .color {
    display: inline-block;
    padding: 5px 10px;
    margin-right: 10px;
    border: 1px solid $border-color;
    border-radius: 5px;
    cursor: pointer;
  }
  .color-radio {
    padding: 0;
    height: 35px;
    width: 35px;
    border: 1px solid #666;
    background-color: transparent;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
  }
  .size-radio {
    padding: 0 6px;
    box-shadow: 0px 0px 3px 1px rgba($color: #666, $alpha: 0.3);
    outline: none;
    height: auto;
    font-size: 0;
    width: auto;
    height: 35px;
    line-height: 35px;
    margin-right: 5px;
    .el-radio__label.el-radio__label.el-radio__label {
      margin: 0;
      display: inline-block;
      outline: none;
      width: 100%;
      color: #333;
      height: 100%;
      padding: 0;
      text-align: center;
      padding: 0 5px;
    }
    .size-name {
      font-size: 12px;
      margin: 0;
    }
  }
  .el-radio__inner {
    display: none !important;
  }
  .el-radio.el-radio.el-radio {
    margin-right: 5px;
    margin-bottom: 5px;
    margin-left: 0;
  }
  .btn-wrapper {
    margin-top: 30px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    .el-button {
      flex: 0 0 320px;
      height: 60px;
      font-size: 20px;
      margin-left: 0px;
    }
    i {
      position: relative;
      top: 3px;
      font-size: 20px;
    }
    i.active {
      color: $menuBg;
    }
    .el-icon-star-on {
      font-size: 26px;
    }
    .collection {
      cursor: pointer;
      display: inline-block;
      margin-left: 10px;
      background: $bg-color;
      width: 168px;
      text-align: center;
      height: 60px;
      line-height: 60px;
      font-size: 20px;
      i {
        margin-right: 10px;
      }
    }
  }
  .tip {
    color: $color-gray;
    font-size: 12px;
    margin-bottom: 20px;
  }
  .openDetial {
    display: inline-block;
    padding-bottom: 10px;
    border-bottom: 1px solid #dcdee0;
    cursor: pointer;
    user-select: none;
  }
}
</style>
