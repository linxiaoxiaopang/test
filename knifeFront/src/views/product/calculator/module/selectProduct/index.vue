<template>
  <el-dialog
      :visible.sync="dialogVisible"
      title="选择产品"
      width="820px"
      v-el-drag-dialog
      custom-class="select-product"
  >
    <el-form
        ref="form"
        size="small"
        :inline="true"
        :model="searchForm"
        class="demo-form-inline"
        @submit.native.prevent
    >
      <el-form-item prop="name">
        <avue-crud-input
            v-model="searchForm.name"
            placeholder="搜索产品名称"
            suffix-icon="el-icon-search"
            @keyup.native.enter="searchChange"
        ></avue-crud-input>
      </el-form-item>
      <el-form-item prop="category">
        <el-cascader
            v-model="searchForm.category"
            :options="delDicEmptyChildren(proCategory)"
            :props="{ ...proCategoryProps, checkStrictly: true, emitPath: false }"
            :show-all-levels="false"
            clearable
            placeholder="请选择分类"
            @change="searchChange"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchChange">搜索</el-button>
        <el-button @click="onreset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="tableData"
        border
        max-height="550px"
        class="table-border"
        @cell-click="handleCellClick"
    >
      <el-table-column
          label="产品信息"
      >
        <template slot-scope="{ row }">
          <div class="flex-middle">
            <el-image
                :src="getShowImg(row)"
                fit="contain"
                style="width: 115px; height: 115px"
                class="block ml10"
            >
              <img
                  slot="error"
                  src="@/assets/images/default.png"
                  width="115"
                  height="115"
                  alt=""
                  class="block"
              />
            </el-image>
            <div class="cell-product-info">
              <div class="info-item flex-middle">
                <span>{{ vaildData(row.name) }}</span>
                <el-divider direction="vertical"></el-divider>
                <span>{{ vaildData(row.english_name) }}</span>
              </div>
              <div class="info-item">
                <span class="label">颜色:</span>
                <span class="ml10">{{ getStructAbbrs(row).join('、') }}</span>
              </div>
              <div class="info-item">
                <span class="label">尺码:</span>
                <span class="ml10">{{ getSizeNames(row).join('、') }}</span>
              </div>
              <div class="info-item">
                <span class="label">分类:</span>
                <span class="ml10">{{ row.$category }}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <PaginationBar
        ref="paginationBar"
        @refreshTableEventFun="refreshTableEventFun"
        :page="tablePage.pageIndex"
        :total="tablePage.total"
        :fSize="[10, 15, 20, 25]"
    />
  </el-dialog>
</template>

<script>
import {dialogComponentsMixin, avueCrud} from '@/mixins'
import {getMyProduct as getList} from '@/api/product'
import {mapGetters} from 'vuex'
import { delDicEmptyChildren } from '@/components/avue/utils/util'
import getPrivateRowValue from '@/views/product/calculator/module/selectProduct/getPrivateRowValue'

export default {
  mixins: [
    getPrivateRowValue,
    dialogComponentsMixin,
    avueCrud({
      getList,
      request: 'python'
    })
  ],
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['proCategory', 'proCategoryProps'])
  },
  // watch: {
  //   searchForm: {
  //     handler(n) {
  //       console.log(n)
  //     },
  //     deep: true
  //   }
  // },
  methods: {
    onreset() {
      this.searchForm = {}
      this.searchChange()
    },
    
    handleCellClick(row, column, cell, event) {
      // console.log(row, column, cell, event)
      this.$emit('submit', row, column, cell, event)
      this.dialogVisible = false
    },
    refreshTableEventFun({ page, size }) {
      this.tablePage.pageIndex = page
      this.tablePage.pageSize = size
      this.init()
    },
  
    afterInit() {
      this.tableData.forEach(row => {
        row.$category = this.getLabel('proCategory', row.category)
      })
    },

    delDicEmptyChildren
  }
}
</script>

<style lang="scss">
.select-product {
  .el-dialog__body {
    padding-top: 30px;
  }
  .el-table__header-wrapper {
    .cell {
      padding-left: 47px;
      color: #9DA3AC;
    }
  }
}
</style>
