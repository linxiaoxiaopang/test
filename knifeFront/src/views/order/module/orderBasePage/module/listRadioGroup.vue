<template>
  <div class="search-radio-group">
    <div>
      <el-radio-group
        v-if="!openMore"
        v-model="curVal"
        size="mini"
        @change="onchange"
      >
        <el-radio label="all" border>全部</el-radio>
        <el-radio
          v-for="(item, index) in sliceList.list[0]"
          :key="index"
          :label="item[props.value]"
          border
        >
          {{ item[props.label] }}
        </el-radio>
      </el-radio-group>
      <div v-if="sliceList.isMore" class="more-btn-wrapper">
        <more-btn v-model="openMore"></more-btn>
      </div>
    </div>
    <el-card v-if="sliceList.isMore" v-show="openMore" shadow="never">
      <div class="card-header">
        <el-radio-group
          v-if="curSearchList.length"
          v-model="curSearchType"
          size="mini"
        >
          <el-radio label="all" border>全部</el-radio>
          <el-radio
            v-for="(item, index) in curSearchList"
            :key="index"
            :label="item[searchProps.value]"
            border
          >
            {{ item[searchProps.label] }}
          </el-radio>
        </el-radio-group>
        <div v-else></div>
        <el-input
          v-model="moreSearchInput"
          suffix-icon="el-icon-search"
          placeholder="输入关键字"
        >
        </el-input>
      </div>

      <el-radio-group v-model="curVal" size="mini" @change="onchange">
        <el-radio
          v-for="(item, index) in moreList"
          :key="index"
          :label="item[props.value]"
          border
        >
          {{ item[props.label] }}
        </el-radio>
      </el-radio-group>
    </el-card>
  </div>
</template>

<script>
import moreBtn from '../../moreBtn'
export default {
  components: {
    moreBtn
  },
  props: {
    // 绑定值
    value: {},
    // 单选列表字典
    list: Array,
    // 收缩时按钮展示数量
    topSize: {
      type: Number,
      default: 10
    },
    // label: 字典的名称属性值
    // value: 字典的值属性值
    props: {
      type: Object,
      default() {
        return {
          label: 'label',
          value: 'value'
        }
      }
    },
    // 展开后，搜索框字段
    searchInputProp: {
      type: String,
      default: 'label'
    },
    // 展开后，搜索单选默认值
    searchType: {},
    // 展开后，搜索单选列表字典
    searchList: {
      type: Array,
      default: () => []
    },
    // 展开后，搜索单选列表字典
    // label: 字典的名称属性值
    // value: 字典的值属性值
    searchProps: {
      type: Object,
      default() {
        return {
          label: 'label',
          value: 'value'
        }
      }
    },
    // 展开后，搜索单选列表字段
    searchRadioProp: {
      type: String,
      default: 'value'
    }
  },
  data() {
    return {
      moreSearchInput: '',
      openMore: false,
      curVal: '',
      curSearchType: ''
    }
  },
  computed: {
    // 收缩时，单选列表字典
    sliceList({ list, topSize }) {
      return {
        topSize,
        // 展开按钮是否显示
        isMore: list.length > topSize,
        // 根据topSize，将单选列表字典切割成两份
        list: [list.slice(0, topSize), list.slice(topSize)]
      }
    },
    // 展开时，单选列表字典
    moreList({ sliceList, validateBySearchInput, validateBySearchRadio }) {
      let allSliceList = []
      allSliceList = allSliceList.concat(sliceList.list[0], sliceList.list[1])
      return allSliceList.filter(
        (item) => validateBySearchInput(item) && validateBySearchRadio(item)
      )
    },
    // 通过搜索框值，验证字典项是否正确（筛选单选列表字典）
    validateBySearchInput({ curSearchInputProp, moreSearchInput }) {
      let regExp = new RegExp(moreSearchInput, 'img')
      return (item) => {
        regExp.lastIndex = 0
        return regExp.test(item[curSearchInputProp])
      }
    },
    // 搜索框字段
    curSearchInputProp({ props, searchInputProp }) {
      return props[searchInputProp] || searchInputProp
    },
    // 通过搜索单选值，验证字典项是否正确（筛选单选列表字典）
    validateBySearchRadio({ curSearchRadioProp, curSearchType }) {
      let regExp = new RegExp(
        curSearchType === 'all' ? '' : curSearchType,
        'img'
      )
      return (item) => {
        regExp.lastIndex = 0
        return regExp.test(item[curSearchRadioProp])
      }
    },
    // 搜索单选字段
    curSearchRadioProp({ searchProps, searchRadioProp }) {
      return searchProps[searchRadioProp] || searchRadioProp
    },
    // 展开后，搜索单选列表字典
    curSearchList({ searchList }) {
      console.log(searchList)
      return searchList.slice(0, 7)
    }
  },
  watch: {
    value: {
      handler(n) {
        this.curVal = n
      },
      immediate: true
    },
    curVal(n) {
      this.$emit('input', n)
    },
    searchType: {
      handler(n) {
        this.curSearchType = n
      },
      immediate: true
    },
    curSearchType(n) {
      this.$emit('update:searchType', n)
    }
  },
  methods: {
    onchange(val) {
      this.$emit('change', val)
    }
  }
}
</script>

<style lang="scss">
.search-radio-group {
  position: relative;
  margin-right: 5.5%;
  .more-btn-wrapper {
    position: absolute;
    top: 0;
    right: 0;
  }
  .el-card {
    margin: 5px 66px 10px 0;
    .el-card__body {
      padding: 0;
    }
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 40px;
      padding: 0 20px;
      background-color: #f7f8fa;
      .el-radio-group {
        margin-left: -20px;
        white-space: nowrap;
      }
      .el-radio {
        background-color: #ffffff;
        border-color: #e6e6e6;
        &.is-bordered.is-checked {
          border-color: #3841db;
        }
      }
      .el-input {
        width: 300px;
      }
    }
    .el-radio-group {
      min-height: 40px;
      max-height: 80px;
      padding: 0 5px 0 15px;
      overflow: auto;
    }
  }
  .el-radio.el-radio--mini.is-bordered {
    height: 24px;
    line-height: 22px;
    padding: 0 9px;
    color: #636c78;
    border-radius: 2px;
  }
}
</style>
