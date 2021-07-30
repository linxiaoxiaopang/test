<template>
  <div class="fedex-good-detail-page">
    <div class="header" v-if="!isBatch && isFristWeight">
      <div class="tip">
        <i class="el-icon-warning icon"></i>
        运费=首重价格+((计费重量-首重)/续重单位重量)* 续费单位价格+挂号费+紧急情形附加费
      </div>
      <ColorTextBtn class="add-btn" @click="addWeightItem"> 添加重量范围 </ColorTextBtn>
    </div>

    <div class="header" v-if="!isBatch && !isFristWeight">
      <div class="tip">
        <i class="el-icon-warning icon"></i>
        运费 = 费用 + 挂号费 + 紧急情形附加费
      </div>
      <ColorTextBtn class="add-btn" @click="addWeightItem"> 添加重量范围 </ColorTextBtn>
    </div>

    <div class="table-header" v-if="isBatch">
      <span class="name">{{ countryName }}</span>
      <ColorTextBtn class="table-add-btn" @click="addWeightItem"> 添加重量范围 </ColorTextBtn>
    </div>

    <CommonTable height="auto" :selection="false" :cols="cols" :infoData="data">
      <template #weightRangeSlot> 重量范围 </template>
      <template #startWeightSlot="{ scoped: { index, prop } }">
        <el-input-number
          disabled
          size="small"
          v-model="data[index][prop]"
          controls-position="right"
          :min="1"
        ></el-input-number>
      </template>

      <template #endWeightSlot="{ scoped: { index, prop } }">
        <el-input-number
          size="small"
          v-model="data[index][prop]"
          controls-position="right"
          @change="endWeightSChange($event, index)"
          :min="data[index].minEndWeight || 1"
        ></el-input-number>
      </template>

      <template #weightSlot="{ scoped: { index, prop } }">
        <el-input-number size="small" v-model="data[index][prop]" controls-position="right" :min="1"></el-input-number>
      </template>

      <template #priceSlot="{ scoped: { index, prop } }" :precision="2">
        <el-input-number size="small" v-model="data[index][prop]" controls-position="right" :min="0"></el-input-number>
      </template>

      <el-table-column fixed="right" align="center" label="操作" width="100px">
        <template slot-scope="{ $index }">
          <ColorTextBtn @click="delWeightItem($index)" type="danger" v-if="showDelBtn($index)"> 刪除 </ColorTextBtn>
        </template>
      </el-table-column>
    </CommonTable>
  </div>
</template>

<script>
import { fedexGoodDetailByFirstWeightCols, fedexGoodDetailBySameWeightCols } from './cols'
import cloneDeep from 'lodash/cloneDeep'

import { FRIST_WEIGHT, SAME_WEIGHT } from '@/utils/constant'

export default {
  props: {
    type: [String, Number],
    isBatch: Boolean,
    countryName: String,
    resetData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      data: [],
      calculateMode: this.$route.query.calculateMode
    }
  },
  created() {
    this.initData()
  },
  computed: {
    //根据首重和一样重量两种不同的模式返回不同的数据
    cols() {
      const tmpObj = {
        [FRIST_WEIGHT]: fedexGoodDetailByFirstWeightCols,
        [SAME_WEIGHT]: fedexGoodDetailBySameWeightCols
      }
      return tmpObj[this.calculateMode]
    },

    //隐藏第一项的删除
    showDelBtn() {
      return (index) => {
        return !!index
      }
    },

    //是否是首重
    isFristWeight() {
      return this.calculateMode == FRIST_WEIGHT
    },

    weightInfo() {
      const tmpObj = {}
      this.cols.map(({ noProp, prop }) => {
        if (!noProp) {
          tmpObj[prop] = ''
        }
      })
      return tmpObj
    }
  },
  methods: {
    initData() {
      this.data = []
      if (this.resetData.length) {
        this.data = this.resetData
        this.data.map((item) => {
          const { startWeight } = item
          item.minEndWeight = startWeight
          return item
        })
      } else {
        this.addWeightItem()
      }
    },
    //新增重量项目
    addWeightItem() {
      const weightInfo = cloneDeep(this.weightInfo)
      this.data.push(weightInfo)
      const len = this.data.length
      if (len <= 1) return
      const preObj = this.data.slice(-2)[0]
      this.$nextTick(() => {
        this.formatInfoByItem(this.data[len - 1], preObj.endWeight)
      })
    },

    //刪除重量项目
    delWeightItem(index) {
      const preVal = this.data[index - 1].endWeight
      this.data.splice(index, 1)
      this.updateDataWeight(preVal, index - 1)
    },

    endWeightSChange(val, index) {
      if (!this.data[index + 1]) return
      this.updateDataWeight(val, index)
    },

    formatInfoByItem(item, preVal) {
      this.$set(item, 'startWeight', preVal + 1)
      this.$set(item, 'minEndWeight', preVal + 1)
      if (item.endWeight < item.startWeight) {
        this.$set(item, 'endWeight', item.startWeight)
      }
    },

    updateDataWeight(val, index) {
      const data = this.data.slice(index + 1)
      let preVal = val
      data.map((item) => {
        this.formatInfoByItem(item, preVal)
        preVal = item.endWeight
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.fedex-good-detail-page {
  max-height: 50vh;
  overflow: auto;
  margin-top: 20px;
  .header {
    display: flex;
    justify-content: space-between;
    .tip {
      color: #969799;
      font-size: 14px;
      .icon {
        font-size: 16px;
        color: $color-warning;
      }
    }
  }
  .table-header {
    position: relative;
    text-align: center;
    background: #ebeef5;
    height: 46px;
    line-height: 46px;
    .name {
      color: #595961;
    }
    .table-add-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 10px;
    }
  }
  .add-btn {
    font-size: 16px;
  }
}
</style>
