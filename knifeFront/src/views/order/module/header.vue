<template>
  <div class="head-form-container search-form">
    <el-form label-width="80px" :model="form" @submit.native.prevent>
      <el-form-item label="用户:">
        <listRadioGroup
          v-model="form.userName"
          :list="userList"
          :props="{
            label: 'username',
            value: 'username'
          }"
          @change="onsubmit"
        ></listRadioGroup>
      </el-form-item>
      <template v-if="hasOrderState">
        <el-divider></el-divider>
        <el-form-item label="订单状态:">
          <listRadioGroup
            v-model="form.orderState"
            :list="orderStateList"
            @change="onsubmit"
          ></listRadioGroup>
        </el-form-item>
      </template>
      <el-divider></el-divider>
      <el-form-item label="来源国家:">
        <listRadioGroup
          v-model="form.consigneeCountryCode"
          :list="consigneeCountryCode"
          :props="consigneeCountryCodeProps"
          :search-type.sync="countryType"
          :search-list="continentDictCode"
          :search-props="continentDictCodeProps"
          search-radio-prop="continentDictCode"
          @change="onsubmit"
        ></listRadioGroup>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item label="搜索类型:" class="search-type">
        <div class="form-item-wrapper">
          <el-radio-group v-model="searchType" size="mini">
            <el-radio
              v-for="(item, index) in searchTypeOptions"
              :key="item.prop"
              ref="searchTypeItems"
              :label="index"
              border
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
          <div class="el-input-wrapper el-popper" x-placement="bottom-start">
            <component
              :is="getSingleComponent(currentSearchType.type)"
              v-model="form[currentSearchType.prop]"
              v-bind="currentSearchType"
              dicData=""
              :dic="currentSearchType.dicData"
              size="small"
              @focus="searchTypeFocus = true"
              @blur="searchTypeFocus = false"
              @clear="onsubmit"
              @search-change="onsubmit"
              @keyup.enter.native="onsubmit"
            ></component>
            <div
              class="popper__arrow"
              :class="{ 'is-focus': searchTypeFocus }"
              :style="`left: ${searchTypeArrowLeft}px;`"
            ></div>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import moreBtn from './moreBtn'
import listRadioGroup from './orderBasePage/module/listRadioGroup'
import { searchTypeOptions, orderStateList } from '@/views/order/field'
import { deepClone, getSingleComponent } from '@/components/avue/utils/util'

import { debounce, uniqueArray } from '@/utils'
import { mapGetters, mapState } from 'vuex'
import { validatenull } from '@/components/avue/utils/validate'
import { WAIT_RELATION, WAIT_GENERATE_WAYBILL } from '@/utils/constant'

export default {
  components: {
    moreBtn,
    listRadioGroup
  },
  props: {
    query: {
      type: Object,
      default: () => ({})
    },
    sup_this: {
      type: Object,
      required: true
    },
    // 搜索表单 - 搜索类型 - 类型列表选择
    searchTypeOptionKey: {
      type: String,
      default: 'default'
    },
    // 搜索表单 - 订单状态 显隐控制
    hasOrderState: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        userName: 'all',
        consigneeCountryCode: 'all',
        orderState: 'all'
      },
      orderStateList,
      countryType: 'all',
      searchType: 0,
      searchTypeItems: [],
      searchTypeFocus: false
    }
  },
  computed: {
    ...mapGetters([
      'id',
      'name',
      'consigneeCountryCode',
      'consigneeCountryCodeProps',
      'continentDictCode',
      'continentDictCodeProps'
    ]),
    ...mapState({
      userList(state) {
        let userList = deepClone(state.user.childUser)
        userList.unshift({
          username: state.user.name
        })
        return userList
      }
    }),
    // 搜索类型 类型列表
    searchTypeOptions({ searchTypeOptionKey }) {
      this.searchType = 0
      this.$nextTick(function () {
        // this.$refs.searchTypeItems排序跟searchTypeOptions[searchTypeOptionKey]不一致
        this.searchTypeItems = this.$refs.searchTypeItems.sort(
          (a, b) => a.label - b.label
        )
      })
      return searchTypeOptions[searchTypeOptionKey] || searchTypeOptions.default
    },
    // 搜索类型 输入框三角形移动
    searchTypeArrowLeft({ searchTypeItems, searchType }) {
      if (!searchTypeItems || searchTypeItems.length === 0) return 0
      // console.log(searchTypeItems.map(item => item.label))
      let { offsetLeft, offsetWidth } = searchTypeItems[searchType].$el
      return offsetLeft + offsetWidth / 2 - 16
    },
    // 搜索类型 当前类型配置
    currentSearchType({ searchTypeOptions, searchType }) {
      return searchTypeOptions[searchType]
    },
    // 搜索类型 类型prop数组
    searchTypeOptionsProps({ searchTypeOptions }) {
      return searchTypeOptions.map((item) => item.prop)
    },
    // 忽略搜索表单的字段
    // 因为每个订单状态的请求字段不一致
    ignoreSearchFormKey({ orderStateList }) {
      return uniqueArray(
        orderStateList.reduce((prev, next) => {
          for (const key in next.searchValue) {
            prev.push(key)
          }
          return prev
        }, [])
      )
    }
  },
  watch: {
    query: {
      handler(n) {
        for (const nKey in n) {
          this.$set(this.form, nKey, n[nKey])
        }
      },
      immediate: true,
      deep: true
    },
    form: {
      handler() {
        this.updateQuery()
      },
      deep: true
    }
  },
  methods: {
    getSingleComponent,
    onsubmit: debounce(function () {
      this.updateQuery()
      this.sup_this.searchChange()
    }),
    updateQuery() {
      let tempObj = {}
      let {
        form,
        searchTypeOptionsProps,
        currentSearchType: { prop },
        ignoreSearchFormKey
      } = this
      for (const key in form) {
        let value = form[key]
        // 'all'为全部选项值，排除
        if (!validatenull(value) && value !== 'all') {
          // 搜索类型，只有当前被选中的字段能作为请求参数
          if (searchTypeOptionsProps.includes(key) && key !== prop) {
            continue
          }

          // 订单状态字段orderState
          if (key === 'orderState') {
            // 获取真实参数
            Object.assign(tempObj, orderStateList[value].searchValue)
            continue
          }
          // 忽略上一次的订单状态请求参数
          if (ignoreSearchFormKey.includes(key)) continue

          tempObj[key] = value
        }
      }
      this.$emit('update:query', tempObj)
      this.$emit('change', tempObj)
    }
  }
}
</script>
<style lang="scss">
.head-form-container.search-form {
  .el-divider {
    margin: 10px 0;
    background-color: #e8e8e8;
  }
  .el-form-item {
    height: auto;
    margin-left: 3%;
    .el-form-item__label {
      text-align: left;
    }
    .el-form-item__content {
      display: block;
    }
  }
  .search-type {
    .form-item-wrapper {
      position: relative;
      display: inline-block;
    }
    .el-radio-group {
      margin-bottom: 40px;
    }
    .el-radio.is-checked {
      border-color: transparent !important;
    }
    .el-input-wrapper {
      position: absolute;
      bottom: 0;
      left: 10px;
      min-width: 200px;
      width: calc(100% - 20px);
      .popper__arrow {
        top: -1px;
        border-bottom-color: #dcdee0;
        transition: all 0.2s;

        &.is-focus {
          border-bottom-color: $--color-primary;
        }
      }
    }
    .el-icon-search {
      color: #3841db;
    }
  }
}
</style>
