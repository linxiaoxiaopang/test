<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdded" class="addButton">+ 添加</el-button>
    <div class="top-warpper">
      <div class="continent-warpper">
        所属洲：
        <span @click="clickAll" :class="[{ active: seletcedIndex === -1 }, 'all']">全部</span>
        <ul
          v-for="(state, index) in continentDictCode"
          :key="index"
          class="continent-whole"
          :class="{ active: seletcedIndex === index }"
          @click="searchName(index, state.id)"
        >
          <li>{{ state.itemName }}</li>
        </ul>
        <span style="margin-left: 9px">搜索类型：</span>
        <el-input
          placeholder="输入国家/地区名称、代码进行搜索"
          size="mini"
          style="width: 240px"
          clearable
          v-model="content"
          @change="search()"
          @clear="search()"
        >
          <i class="el-icon-search" style="line-height: 30px" slot="suffix" @click="search(item.index)"> </i
        ></el-input>
      </div>
    </div>
    <countryDialog
      :form="form"
      :id="id"
      :addDialog.sync="addDialog"
      :type="type"
      :radio.sync="radio"
      :sup_this="sup_this"
    />
    <CommonTable :selection="false" :tableLoading="tableLoading" :cols="cols" :infoData="data" style="margin-top: 40px">
      <template #continentSlot="{ scoped: row }"> {{ getCurrentcontinent(row) }} </template>
      <slot>
        <el-table-column fixed="right" label="操作" width="200px" align="center">
          <template slot-scope="{ row }">
            <span style="color: #3841db; cursor: pointer" @click="onEdit(row)">编辑</span>
            <span class="line"></span>
            <Popover @sureHandler="onDelete(row.id)">
              <template #tip>
                <p>您确定要删除已添加的国家/地区么?</p>
              </template>
              <template #reference="{ scope: loading }">
                <color-text-btn class="update-btn" :loading="loading" size="mini" type="danger">删除</color-text-btn>
              </template>
            </Popover>
          </template>
        </el-table-column>
      </slot>
    </CommonTable>
    <PaginationBar ref="paginationBar" @refreshTableEventFun="refreshTableEventFun" :total="total" />
  </div>
</template>

<script>
import { deleteCounrty } from '@/api/country'
import { delMixin } from '@/mixins'
import { countryListCols as cols } from '@/views/fedex/cols'
import { mapGetters } from 'vuex'
import initDataMixin from '@/mixins/initData'
import { debounce } from '@/utils'
import countryDialog from './module/countryDialog.vue'
export default {
  mixins: [initDataMixin],
  components: { countryDialog },
  data() {
    return {
      sup_this: this,
      cols,
      url: '/system/countryCode/complexList',
      method: 'post',
      addDialog: false,
      mergeData: {
        isDeleted: 0
      },
      query: {},
      seletcedIndex: -1,
      currentType: '国家/地区中文名称',
      id: null,
      content: '',
      continent: null,
      countrycn: null,
      countryen: null,
      counrtyId: null,
      code: null,
      type: 'add',
      radio: null,
      form: {
        continent: null,
        countrycn: null,
        countryen: null,
        code: null
      }
    }
  },
  computed: {
    ...mapGetters(['continentDictCode'])
  },
  methods: {
    handleSelected(type) {
      this.currentType = type
    },
    handleAdded() {
      this.type = 'add'
      this.radio = this.continentDictCode[0].id
      this.form = {
        continent: this.continentDictCode[0].id,
        countrycn: null,
        countryen: null,
        code: null
      }

      this.addDialog = true
    },
    getCurrentcontinent(row) {
      const id = row.continentDictCode
      const currentItem = this.continentDictCode.find((item) => item.id === id)
      if (!currentItem) return
      else return currentItem.itemName
    },
    searchName: debounce(function (index, id) {
      this.seletcedIndex = index
      this.query.continentDictCode = id
      this.countryId = id
      this.searchChange()
    }),
    onDelete(idList) {
      const id = [idList]
      deleteCounrty({ idList: id }).then((res) => {
        this.init()
        this.$message.success('国家删除成功！')
      })
    },
    onEdit(data) {
      this.type = 'edit'
      const { continentDictCode, countryCnName, countryEnName, twoCharCode, id } = data
      this.radio = continentDictCode
      this.id = id
      this.continent = continentDictCode
      this.countrycn = countryCnName
      this.countryen = countryEnName
      this.code = twoCharCode
      this.form.continent = continentDictCode
      this.form.countrycn = countryCnName
      this.form.countryen = countryEnName
      this.form.code = twoCharCode
      this.addDialog = true
    },
    clickAll() {
      delete this.query.continentDictCode
      this.query.twoCharCode = this.content || undefined
      this.seletcedIndex = -1
      this.searchChange()
    },
    search() {
      this.query.twoCharCode = this.content
      this.searchChange()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  flex-direction: column;
  .top-warpper {
    display: flex;
    align-items: center;
    margin-top: 20px;
    background-color: #f0f2f5;
    padding: 20px;
    .continent-warpper {
      width: 1200px;
      font-size: 14px;
      display: flex;
      align-items: center;
      .active {
        color: #3841db;
        border: 1px solid #3841db !important;
        border-radius: 2px !important;
      }
      .actived {
        color: #3841db;
      }
      .all,
      .continent-whole {
        padding: 10px;
        border: 1px solid #dcdee0;
        border-radius: 2px;
        margin-right: 12px;
        cursor: pointer;
        li {
          list-style: none;
        }
      }
    }
  }
  .popover {
    ::v-deep {
      .el-popover {
        padding: 0;
        border: none;
      }
    }
  }
  .dialog-footer {
    ::v-deep {
      .el-button {
        width: 62px;
        height: 32px;
        border-radius: 2px;
        padding: 0;
      }
    }
  }
}

.addButton,
.searchButton {
  display: flex;
  justify-content: center;
  align-items: center;
}
.addButton {
  width: 72px;
  height: 32px;
  margin-right: 20px;
}
.searchButton {
  width: 48px;
  height: 32px;
}
</style>
