<template>
  <div class="container add-country-button-component">
    <slot name="btn" :scoped="{ addLoading, showDialog }">
      <el-button type="primary" class="addButton" @click="showDialog">+ 添加国家 / 地区</el-button>
    </slot>
    <el-dialog
      append-to-body
      title="添加国家/地区"
      :visible.sync="visible"
      width="80vw"
      :before-close="handleClose"
      class="add-country-button-add-dialog"
    >
      <div class="select-warpper">
        <span class="add" @click="handleAdded" v-if="li && li.length">已选国家/地址：{{ getSelectedCountry(li) }}</span>
        <span class="add" @click="handleAdded" v-else>添加国家 / 地区</span>
      </div>

      <FedexGoodDetail v-if="visible" ref="fedexGoodDetail" :resetData="resetData" />

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCanceled">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="handleConfirmed">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择国家/地区"
      append-to-body
      :visible.sync="addVisible"
      width="824px"
      :before-close="close"
      class="add-country-button-add-dialog dd-country-button-dialog-warpper"
    >
      <div class="whole-warpper" :loading="loading">
        <div class="left">
          <div class="search-warpper">
            <el-input
              size="mini"
              v-model="content"
              placeholder="输入国家/地区名称、二字码"
              style="width: 300px"
              clearable
              @change="search"
              @clear="search"
            >
              <i class="el-icon-search" style="line-height: 30px" slot="suffix" @click="search"> </i
            ></el-input>
          </div>
          <div class="continent-warpper">
            <span @click="clickAll" :class="[{ active: seletcedIndex === -1 }, 'all']">全部</span>
            <ul
              v-for="(state, index) in continentDictCode"
              :key="index"
              class="continent-whole"
              @click="searchName(index, state.id)"
              :class="{ active: seletcedIndex === index }"
            >
              <li>{{ state.itemName }}</li>
            </ul>
          </div>
          <div class="continent-select-warpper">
            <el-checkbox
              :indeterminate="isIndeterminate"
              class="all"
              v-model="checkAll"
              @change="handleCheckAll"
              v-if="countryList && countryList.length"
              >全部</el-checkbox
            >
            <span v-if="!(countryList && countryList.length)">暂无数据</span>
            <el-checkbox-group v-model="checkedCountry" @change="handleChecked">
              <el-checkbox
                :disabled="disabledList.includes(country && country.id)"
                v-for="(country, index) in countryList"
                :label="country.id"
                :key="index"
                >{{ country && country.countryCnName }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </div>
        <div class="right">
          <span class="search-warpper"
            >已选国家/地区：<span class="cancel-all" @click="cancelAllButton">(取消全部)</span></span
          >
          <div class="select">
            <el-checkbox-group v-model="selectCountryList" @change="handleChanged">
              <el-checkbox
                :disabled="disabledList.includes(country && country.id)"
                v-for="(country, index) in uniqueSelectCountry"
                :label="country && country.id"
                :key="index"
                >{{ country && country.name }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { debounce } from '@/utils'
import { getCounrty } from '@/api/country'
import { batchCreateTemplate, getCreatedTemplate } from '@/api/template'
import FedexGoodDetail from './fedexGoodDetail'
import cloneDeep from 'lodash/cloneDeep'
export default {
  components: {
    FedexGoodDetail
  },
  props: {
    templateId: { type: Number },

    sup_this: {
      type: Object
    },

    //复制时候重置data
    resetData: {
      type: Array,
      default: () => []
    },

    list: {
      type: Array
    }
  },
  watch: {
    list() {
      this.li = this.list
      this.disabledList = [
        ...new Set(
          this.list.map((item) => {
            return item.countryId
          })
        )
      ]
    }
  },
  data() {
    return {
      visible: false,
      addVisible: false,
      seletcedIndex: -1,
      checkedCountry: [],
      selectCountryList: [],
      selectCountry: [],
      disabledList: [],
      query: {},
      countryList: [],
      checkAll: false,
      isIndeterminate: false,
      checkedCount: 0,
      loading: false,
      addLoading: false,
      cdc: '',
      content: '',
      li: [],
      allCountry: []
    }
  },
  created() {
    this.getCountryList()
  },
  computed: {
    ...mapGetters(['continentDictCode']),
    uniqueSelectCountry() {
      let tmpArr = []
      this.selectCountry.map((item) => {
        if (!tmpArr.length) {
          tmpArr.push(item)
          return
        }
        const fItem = tmpArr.find(({ id }) => id === item.id)
        if (!fItem) {
          tmpArr.push(item)
        }
      })
      return tmpArr
    }
  },
  methods: {
    initCheck() {
      this.checkAll = false
      this.checkedCount = 0
      this.isIndeterminate = false
      this.checkedCountry = []
    },
    showDialog() {
      this.selectCountryList = cloneDeep(this.disabledList)
      this.li = this.selectCountryList.map((item) => ({
        countryId: item
      }))
      this.addLoading = true
      this.visible = true
    },
    handleConfirmed() {
      this.addLoading = true
      this.loading = true
      const data = {
        countryIdList: this.selectCountryList.filter((item) => {
          return !this.list.find((ha) => ha.countryId === item)
        }),
        templateId: this.templateId,
        list: [{}]
      }
      if (data.countryIdList.length === 0) {
        this.$message.error('请先选择需要添加的国家')
        this.loading = false
        return
      }

      const { fedexGoodDetail } = this.$refs
      if (!fedexGoodDetail) return
      data.list = fedexGoodDetail.data

      batchCreateTemplate(data)
        .then(async () => {
          this.$message.success('创建成功')
          await getCreatedTemplate({ isDeleted: 0, templateId: this.templateId }).then((rs) => {
            this.li = rs.detail
            this.sup_this.init()
            this.loading = false
            this.visible = false
            this.addLoading = false
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleClose() {
      this.visible = false
      this.addLoading = false
    },
    handleCanceled() {
      this.visible = false
      this.addLoading = false
    },
    async handleAdded() {
      await this.getCountryList()
      this.checkedCountry = [...new Set(this.li.map((item) => item.countryId))]
      this.handleChecked(this.checkedCountry)
      this.handle()
      this.seletcedIndex = -1
      this.addVisible = true
    },
    close() {
      this.addVisible = false
      this.query = {}
      this.search = ''
      this.initCheck()
      this.selectCountryList = []
      this.selectCountry = []
      this.seletcedIndex = -1
    },
    cancel() {
      this.addVisible = false
      this.$message.warning('您取消了操作')
    },
    confirm() {
      this.loading = true
      if (this.selectCountry.length === 0 || this.selectCountryList.length === 0) {
        this.$message.warning('请先选择国家/地区')
        this.loading = false
        return
      }

      this.li = this.selectCountryList.map((item) => ({
        countryId: item
      }))
      this.loading = false
      this.addVisible = false
    },
    async getCountryList() {
      const res = await getCounrty({ isDeleted: 0 })
      this.countryList = res.detail || []
      this.allCountry = res.detail || []
    },
    async clickAll() {
      this.seletcedIndex = -1
      this.cdc = undefined
      await getCounrty({
        isDeleted: 0,
        twoCharCode: this.content
      }).then((res) => {
        this.countryList = res.detail || []
        this.initCheck()
        this.test()
      })
    },
    search: debounce(function () {
      getCounrty({
        isDeleted: 0,
        twoCharCode: this.content,
        continentDictCode: this.cdc || undefined
      }).then((res) => {
        this.countryList = res.detail || []
        this.initCheck()
        this.test()
      })
    }),
    searchName: debounce(function (index, id) {
      this.loading = true
      this.seletcedIndex = index
      this.cdc = id
      getCounrty({
        isDeleted: 0,
        continentDictCode: id,
        twoCharCode: this.content || undefined
      }).then((res) => {
        this.countryList = res.detail || []
        this.initCheck()
        this.test()
        this.loading = false
      })
    }),
    test() {
      if (!this.countryList) return
      this.checkedCountry = this.countryList
        .map((item) => {
          return this.selectCountryList.find((item2) => item2 === item.id) ? item.id : null
        })
        .filter((ha) => ha)
      console.log('this.checkedCountry', this.checkedCountry)
      let checkedCount = this.checkedCountry.length
      this.checkAll = checkedCount === this.countryList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.countryList.length
    },
    handleChecked(value) {
      value = [...new Set(value)]
      if (!this.countryList.length) return
      this.checkedCount = value.length
      this.checkAll = this.checkedCount === this.countryList.length
      this.isIndeterminate = this.checkedCount > 0 && this.checkedCount < this.countryList.length

      this.selectCountry = this.selectCountry.filter((item) => {
        return !this.countryList.find((item2) => item2.id === item.id)
      })
      this.selectCountryList = this.selectCountryList
        .map((item) => {
          return !this.countryList.find((item2) => item2.id === item) ? item : null
        })
        .filter((ha) => ha)
      // if (value.length === this.disabledList.length) return
      value.forEach((id) => {
        const fItem = this.countryList.find((item) => item.id === id)
        if (fItem) {
          this.selectCountry.push({
            id,
            name: fItem.countryCnName
          })
          this.selectCountryList.push(id)
        }
      })
    },
    handleCheckAll(val) {
      //切换全选时数组去重
      // if (!val) {
      //   this.selectCountry = []
      // }
      const all = this.countryList.map((item) => {
        return item.id
      })
      this.checkedCountry = val ? all : this.disabledList || []
      this.isIndeterminate = false
      this.handleChecked(this.checkedCountry)
    },
    getSelectedCountry(data) {
      console.log('data', data)
      let countries = data.map((item) => {
        const item1 = this.allCountry.find((item2) => item2.id === item.countryId)
        const name = item1 && item1.countryCnName
        return name
      })
      countries = [...new Set(countries)]

      //["中国", "日本", "美国", "印度"]
      const filterCountries = this.allCountry
        .filter(({ countryCnName }) => countries.includes(countryCnName))
        .filter(({ id }) => !this.disabledList.includes(id))
        .map(({ countryCnName }) => countryCnName)
      return filterCountries.join('、')
      //中国、日本、美国、印度
    },
    cancelAllButton() {
      //selectCountryList选中，数字，selectCountry全部，id和name
      this.selectCountryList = this.selectCountryList
        .map((item) => {
          return this.disabledList.find((item2) => item2 === item)
        })
        .filter(Boolean)
      // this.selectCountry = this.selectCountry.map((item) => {
      //   return this.disabledList.find((item2) => {
      //     item2 === item.id
      //   })
      // })
      this.selectCountry = this.disabledList.map((item) => ({
        id: item
      }))
      this.selectCountry = this.selectCountry
        .map((item) => {
          return this.countryList.find((item2) => item2.id === item.id)
        })
        .filter(Boolean)
      this.selectCountry = this.selectCountry.map((item) => ({
        id: item.id,
        name: item.countryCnName
      }))
      this.checkedCountry = this.checkedCountry
        .map((item) => {
          return this.disabledList.find((item2) => item2 === item)
        })
        .filter(Boolean)
      let checkedCount = this.checkedCountry.length
      this.checkAll = checkedCount === this.countryList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.countryList.length
    },
    handle() {
      console.log('this.checkedCountry', this.checkedCountry)
      console.log('this.countryList', this.countryList)
      if (
        this.checkedCountry &&
        this.checkedCountry.length &&
        this.countryList.length &&
        this.checkedCountry.length < this.countryList.length
      ) {
        this.checkAll = false
        this.isIndeterminate = true
        if (this.checkedCountry.length === 0) {
          this.checkAll = false
          this.isIndeterminate = false
        }
      } else if (
        this.checkedCountry &&
        this.checkedCountry.length &&
        this.countryList.length &&
        this.checkedCountry.length === this.countryList.length
      ) {
        console.log('join')
        this.checkAll = true
        this.isIndeterminate = false
      }
    },
    handleChanged(rightData) {
      this.checkedCountry = this.countryList
        .map((item) => {
          return rightData.find((item2) => item2 === item.id) ? item.id : null
        })
        .filter((ha) => ha)
      this.handle()
    }
  }
}
</script>

<style lang="scss" scoped>
.add-country-button-component {
  display: inline-block;
  margin-left: 8px;
}
.addButton {
  padding: 0;
  width: 128px;
  height: 32px;
}
.dd-country-button-dialog-warpper {
  ::v-deep {
    .el-dialog__body {
      padding: 0;
    }
  }
}
.add-country-button-add-dialog {
  ::v-deep {
    .el-dialog__title {
      font-size: 14px;
      color: #1a1a1a;
    }
    .el-dialog__header {
      height: 52px;
      line-height: 52px;
      padding: 0 0 0 24px;
      border: 1px solid #dcdee0;
    }
  }
  .select-warpper {
    margin-top: 14px;
    font-size: 14px;
    font-weight: 500;
    color: #1a1a1a;
    .add {
      cursor: pointer;
      color: #3841db;
    }
  }
  .whole-warpper {
    display: flex;
    height: 500px;
    .left {
      width: 527px;
      border-right: 1px solid #dcdee0;
      border-bottom: 1px solid #dcdee0;
      .continent-warpper {
        height: 48px;
        align-items: center;
        border-bottom: 1px solid #dcdee0;
        display: flex;
        .active {
          color: #fff !important;
          background: #3841db !important;
          border: 1px solid #3841db !important;
          border-radius: 2px !important;
        }
        .all {
          margin-left: 16px;
        }
        .all,
        .continent-whole {
          padding: 9px;
          border: 1px solid #dcdee0;
          border-radius: 2px;
          margin-right: 12px;
          background: #f5f5f5;
          height: 32px;
          cursor: pointer;
          color: #969799;
          li {
            list-style: none;
          }
        }
      }
      .continent-select-warpper {
        padding: 16px 0 0 16px;
        .all {
          ::v-deep {
            .el-checkbox__label {
              padding-right: 25px;
            }
          }
        }
        ::v-deep {
          .el-checkbox__inner {
            width: 16px;
            height: 16px;
            border: 1px solid #c8c9cc;
            border-radius: 2px;
          }
          .el-checkbox-group {
            display: inline;
          }
          .el-checkbox__label {
            padding-left: 5px;
          }
          .el-checkbox {
            color: #595961;
            font-weight: normal;
            margin-bottom: 13px;
          }
        }
      }
      .search-warpper {
        height: 56px;
        line-height: 56px;
        border-bottom: 1px solid #dcdee0;
        padding-left: 16px;
      }
    }
    .right {
      width: 296px;
      border-bottom: 1px solid #dcdee0;
      .cancel-all {
        color: #3841db;
        cursor: pointer;
      }
      .select {
        padding: 16px 0 0 16px;
        .el-checkbox {
          color: #595961;
          font-weight: normal;
          margin-bottom: 13px;
        }
      }
      .search-warpper {
        display: inline-block;
        height: 56px;
        width: 100%;
        line-height: 56px;
        border-bottom: 1px solid #dcdee0;
        padding-left: 16px;
        color: #1a1a1a;
      }
    }
  }
}
</style>
