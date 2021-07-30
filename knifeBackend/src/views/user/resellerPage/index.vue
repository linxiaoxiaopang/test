<template>
  <div class="app-container">
    <div class="radioBtn list-state-group">
      <el-radio-group v-model="radioValue" @change="getTableData">
        <el-radio-button v-for="{ label } in radioGroupBtn" :label="label" :key="label"> </el-radio-button>
      </el-radio-group>
    </div>
    <div class="formPart">
      <el-form :model="formData" inline size="small">
        <template v-for="{ label, placeholder, prop } in form">
          <!-- 创建时间 / '-->
          <el-form-item v-if="prop == 'date_joined'" :key="prop" :label="label">
            <el-date-picker
              v-model="formData[`${prop}`]"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="search"
            >
            </el-date-picker>
          </el-form-item>
          <!-- 定制时间 -->
          <el-form-item v-else-if="prop == 'proTime'" :key="prop" :label="label">
            <el-date-picker v-model="formData[`${prop}`]" type="datetime" :placeholder="placeholder" @change="search"> </el-date-picker>
          </el-form-item>
          <!-- 定制产品名称 -->
          <!-- <el-form-item v-else-if="prop == 'chinese_name'" :key="prop" :label="label">
            <el-input v-model="formData.name" :placeholder="placeholder" @keyup.native.enter="search"></el-input>
          </el-form-item> -->
          <!-- 图片分类 -->
          <el-form-item v-else-if="prop == 'category_name'" :key="prop" :label="label">
            <el-cascader
              v-model="formData[`${prop}`]"
              :options="phoKindOptions"
              :props="{ checkStrictly: true }"
              clearable
              @change="search"
            ></el-cascader>
          </el-form-item>
          <!-- 图片上传时间 -->
          <el-form-item v-else-if="prop == 'create_time'" :key="prop" :label="label">
            <el-date-picker
              v-model="formData[`${prop}`]"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
               @change="search"
            >
            </el-date-picker>
          </el-form-item>
          <!-- 选择物流方式 -->
          <el-form-item v-else-if="prop == 'expressShippingMethodId'" :key="prop" :label="label">
            <el-select v-model="formData[`${prop}`]" :placeholder="placeholder" clearable  @change="search">
              <el-option v-for="item in chinnalOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 选择订单状态 -->
          <el-form-item v-else-if="prop == 'orderStatus'" :key="prop" :label="label">
            <el-select v-model="formData[`${prop}`]" :placeholder="placeholder" clearable  @change="search">
              <el-option v-for="item in orderStatusData" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 导入时间 -->
          <el-form-item v-else-if="prop == 'importTime'" :key="prop" :label="label">
            <el-date-picker
              v-model="formData[`${prop}`]"
              type="daterange"
              value-format="yyyy-MM-dd"
              :placeholder="placeholder"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="search"
            >
            </el-date-picker>
          </el-form-item>
          <!-- 通用 -->
          <el-form-item v-else-if="prop == 'search'" :key="prop">
            <el-button class="el-icon-search" type="primary" @click="search" size="mini"></el-button>
          </el-form-item>
          <el-form-item v-else :key="prop" :label="label" :prop="prop">
            <el-input :placeholder="placeholder" v-model="formData[`${prop}`]" @keyup.native.enter="search"></el-input>
          </el-form-item>
        </template>
      </el-form>
    </div>
    <div class="tablePart">
      <el-table :data="data" border v-loading="tableLoading">
        <template v-for="{ label, prop } in tableColum">
          <!-- account -->
          <el-table-column
            v-if="prop == 'operation1'"
            :key="prop"
            :label="label"
            :prop="prop"
            align="center"
            width="300"
          >
            <template slot-scope="scope">
              <edit :menus="distors" :data="scope.row" :sup_this="sup_this"></edit>
            </template>
          </el-table-column>
          <el-table-column v-else-if="prop == 'date_joined'" :key="prop" :label="label" :prop="prop">
            <template slot-scope="{ row }">
              {{ row.date_joined&&row.date_joined.slice(0, 10) }}
            </template>
          </el-table-column>
          <!-- photo -->
          <el-table-column v-else-if="prop == 'thumbnail_path'" :key="prop" :label="label" :prop="prop">
            <template slot-scope="{ row }">
              <el-image style="height: 100px" :src="row.path" :preview-src-list="[row.path]" fit="contain"> </el-image>
            </template>
          </el-table-column>
          <el-table-column v-else-if="prop == 'path'" :key="prop" :label="label" :prop="prop">
            <template slot-scope="{ row }">
              {{ row.path && row.path.split('.')[row.path && row.path.split('.').length - 1] }}
            </template>
          </el-table-column>
          <el-table-column v-else-if="prop == 'create_time'" :key="prop" :label="label" :prop="prop">
            <template slot-scope="{ row }">
              {{ row.create_time && row.create_time.slice(0, 10) }}
            </template>
          </el-table-column>
          <el-table-column v-else-if="prop == 'height'" :key="prop" :label="label" :prop="prop">
            <template slot-scope="{ row }">
              {{ row.height + '*' + row.width }}
            </template>
          </el-table-column>
          <el-table-column v-else-if="prop == 'disable'" :key="prop" :label="label" :prop="prop">
            <template slot-scope="{ row }">
              {{ row.disable ? '禁用' : '启用' }}
            </template>
          </el-table-column>
          <el-table-column v-else-if="prop == 'operation2'" :key="prop" :label="label" :prop="prop" align="center">
            <template>
              <disabledBtn></disabledBtn>
            </template>
          </el-table-column>
          <!-- order -->
          <el-table-column v-else-if="prop == 'expressShippingMethodCnName'" :key="prop" :label="label" :prop="prop">
            <template slot-scope="{ row }">
              {{ row.expressShippingMethodCnName || '暂无' }}
            </template>
          </el-table-column>
          <el-table-column v-else-if="prop == 'isKnifeLayoutCreated'" :key="prop" :label="label" :prop="prop">
            <template slot-scope="{ row }">
              {{ row.isKnifeLayoutCreated == 0 ? '未全部生成' : '已全部生成' }}
            </template>
          </el-table-column>
          <el-table-column v-else-if="prop == 'orderStatus'" :key="prop" :label="label" :prop="prop">
            <template slot-scope="{ row }">
              {{ ORDER_STATUS_LIST[`${row.orderStatus}`] }}
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="prop == 'operation3'"
            :key="prop"
            :label="label"
            :prop="prop"
            align="center"
            width="300"
          >
            <template slot-scope="scoped">
              <changeStateBtn :data="scoped.row" :sup_this="sup_this"></changeStateBtn>
              <editOrderBtn
                v-if="canEdit(scoped.row)"
                :data="scoped.row"
                :type="1"
                :id="scoped.row.id"
                :sup_this="sup_this"
              >
                编辑
              </editOrderBtn>
              <editOrderBtn :data="scoped.row" :isProTable="true" :id="scoped.row.id"> 查看详情 </editOrderBtn>
            </template>
          </el-table-column>
          <!-- pro -->
          <el-table-column v-else-if="prop == 'chinese_name'" :key="prop" :label="label" :prop="prop">
            <template slot-scope="{ row }">
              {{ row.name || '暂无' }}
            </template>
          </el-table-column>
          <el-table-column v-else-if="prop == 'english_name'" :key="prop" :label="label" :prop="prop">
            <template slot-scope="{ row }">
              {{ row.english_name || '暂无' }}
            </template>
          </el-table-column>
          <el-table-column v-else-if="prop == 'images_path'" :key="prop" :label="label" :prop="prop">
            <template slot-scope="{ row }">
              <div class="merge-wrapper">
                <el-popover placement="right" trigger="hover" :visible-arrow="false">
                  <div slot="reference">
                    <el-image
                      fit="contain"
                      :src="row.images && row.images[0] && row.images[0].thumbnail_path"
                      :z-index="9999"
                    />
                  </div>
                  <div style="height: 40px; line-height: 32px; background: #fff">
                    {{ row.chinese_name }}
                  </div>
                  <el-image
                    fit="contain"
                    :src="row.images && row.images[0] && row.images[0].thumbnail_path"
                    style="width: 450px; height: 450px"
                    :z-index="9999"
                  >
                  </el-image>
                </el-popover>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-else-if="prop == 'struct_name'" :key="prop" :label="label" :prop="prop">
            <template v-slot="{ row }">
              <el-tag style="margin-right: 5px" type="primary" :key="index" v-for="(item, index) in handleStyle(row)">
                {{ item }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column v-else-if="prop == 'size_name'" :key="prop" :label="label" :prop="prop">
            <template v-slot="{ row }">
              <el-tag style="margin-right: 5px" type="primary" :key="sku" v-for="{ size_name, sku } in handleSize(row)">
                {{ size_name }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column v-else-if="prop == 'spec_prods_path'" :key="prop" :label="label" :prop="prop">
            <template #default="{ row }">
              {{ handleState(row) }}
            </template>
          </el-table-column>
          <el-table-column v-else-if="prop == 'create_time1'" :key="prop" :label="label" :prop="prop">
            <template #default="{ row }">
              <span>{{ row.create_time | formatTime }}</span>
            </template>
          </el-table-column>

          <el-table-column v-else-if="prop == 'operation4'" :key="prop" :label="label" :prop="prop" align="center">
            <!-- <template #default="{ row }">
              <proDetail :detailData="row"></proDetail>
            </template> -->
            <template slot-scope="{ row }">
              <ColorTextBtn class="watch" @click="onWatch(row)">查看详情</ColorTextBtn>
            </template>
          </el-table-column>
          <!-- 通用 -->
          <el-table-column v-else :key="prop" :label="label" :prop="prop"></el-table-column>
        </template>
      </el-table>
    </div>
    <watchDialog :visible.sync="show" :product="designedProduct" />
    <PaginationBar ref="paginationBar" @refreshTableEventFun="refreshTableEventFun" :total="total" />
  </div>
</template>

<script>
import watchDialog from '../../designedProductManage/module/watchDialog.vue'
import { getcategory, getExpressMethod, getDetail } from './resellerAPI'
import { WAIT_RELATION, WAIT_GENERATE_WAYBILL, WAIT_DISPATCH, IN_DISPATCH, DELIVER, FINISH } from '@/utils/constant'
import {
  radioGroupBtn,
  accountForm,
  accountTable,
  accountFormData,
  proForm,
  proFormData,
  proTable,
  photoForm,
  photoFormData,
  phoTable,
  orderForm,
  orderFormData,
  orderTable,
  orderStatusData
} from './resellerPageData'
// expressExpireTime
import cloneDeep from 'lodash/cloneDeep'
import { parseCharacterTime } from '@/utils'
import changeStateBtn from './module/changeStateBtn.vue'
import initDataMixin from '@/mixins/initData'
import disabledBtn from './module/disabledBtn.vue'
import edit from '../module/edit.vue'
import editOrderBtn from './module/edit'
import proDetail from './module/proDetail.vue'
import { ORDER_STATUS_LIST } from '@/utils/constant'
export default {
  mixins: [initDataMixin],
  components: {
    disabledBtn,
    edit,
    changeStateBtn,
    editOrderBtn,
    proDetail,
    watchDialog
  },
  data() {
    return {
      id: '',
      ORDER_STATUS_LIST,
      radioGroupBtn,
      sup_this: this,
      distors: [],
      radioValue: '子账号管理',
      accountForm,
      accountTable,
      accountFormData: cloneDeep(accountFormData),
      accountTableData: [],
      proForm,
      proFormData,
      proTable,
      proTableData: [],
      photoForm,
      photoFormData: cloneDeep(photoFormData),
      phoKindOptions: [],
      phoTable,
      phoTableData: [],
      orderForm,
      orderFormData: cloneDeep(orderFormData),
      orderStatusData,
      orderTable,
      orderTableData: [],
      chinnalOptions: [],
      loading: true,
      url: '/api/rbac/common_users/child_user/',
      method: 'get',
      show: false,
      designedProduct: {},
      orderItems: [
        {
          asc: false,
          column: 'import_time'
        },
        {
          asc: false,
          column: 'id'
        }
      ]
    }
  },

  async mounted() {
    const { detail } = await getcategory()
    const categoryData = detail.map((item) => {
      const tempObj = {}
      if (item.children.length) {
        const children = []
        item.children.map((item) => {
          children.push({
            value: item.id,
            label: item.name
          })
        })
        tempObj.children = children
      }
      tempObj.value = item.id
      tempObj.label = item.name
      return tempObj
    })
    this.phoKindOptions = categoryData
    const { detail: expressMethod } = await getExpressMethod({})
    const chinnalOptions = expressMethod.map(({ cnName, id }) => {
      return {
        value: id,
        label: cnName
      }
    })
    this.chinnalOptions = chinnalOptions
  },

  watch: {
    radioValue() {
      //在berforeInit之前，初始化this.query
      this.beforeInitCallback()
      if (this.radioValue == '子账号管理') {
        this.method = 'get'
        this.url = '/api/rbac/common_users/child_user/'
      } else if (this.radioValue == '分销商图片管理') {
        this.method = 'get'
        this.url = '/api/image/image'
      } else if (this.radioValue == '分销商订单管理') {
        this.method = 'post'
        this.url = '/order/order/list'
      } else {
        this.method = 'get'
        this.url = '/api/product/back_prim_prod'
      }
      this.searchChange()
    }
  },

  computed: {
    formData() {
      if (this.radioValue == '子账号管理') {
        return this.accountFormData
      } else if (this.radioValue == '分销商图片管理') {
        return this.photoFormData
      } else if (this.radioValue == '分销商订单管理') {
        return this.orderFormData
      } else {
        return this.proFormData
      }
    },
    form() {
      if (this.radioValue == '子账号管理') {
        return this.accountForm
      } else if (this.radioValue == '分销商图片管理') {
        return this.photoForm
      } else if (this.radioValue == '分销商订单管理') {
        return this.orderForm
      } else {
        return this.proForm
      }
    },
    tableColum() {
      if (this.radioValue == '子账号管理') {
        return this.accountTable
      } else if (this.radioValue == '分销商图片管理') {
        return this.phoTable
      } else if (this.radioValue == '分销商订单管理') {
        return this.orderTable
      } else {
        return this.proTable
      }
    },
    search() {
      if (this.radioValue === '子账号管理') {
        return this.accountSearch
      } else if (this.radioValue === '分销商图片管理') {
        return this.photoSearch
      } else if (this.radioValue === '分销商订单管理') {
        return this.orderSearch
      } else {
        return this.proSearch
      }
    },
    canEdit() {
      return (row) => {
        const { orderStatus } = row
        const temArr = [WAIT_RELATION, WAIT_GENERATE_WAYBILL, WAIT_DISPATCH, IN_DISPATCH]
        return true
      }
    }
  },

  methods: {
    testEnter() {
      console.log(111)
    },
    delParams(key) {
      const tmpArr = ['parent_id', 'create_by', 'userId', 'orderItems', 'isRelatedData']
      tmpArr.map((item) => {
        if (item != key) {
          delete this.query[item]
        }
      })
    },
    beforeInitCallback() {
      const id = this.$route.query.id
      let query = this.query
      if (this.radioValue == '子账号管理') {
        query.parent_id = id
        this.delParams('parent_id')
      } else if (this.radioValue == '分销商图片管理') {
        query.create_by = id
        this.delParams('create_by')
      } else if (this.radioValue == '分销商订单管理') {
        this.query.userId = id
        this.delParams('userId')
        this.query.orderItems = this.orderItems
        this.query.isReturnRelatedData = 1
      } else {
        query.create_by = id
        this.delParams('create_by')
      }
      this.query = query
    },
    cleanQuery(queryObj) {
      for (let key in queryObj) {
        queryObj[key] = ''
      }
    },
    // 四个搜索方法对应四个部分
    accountSearch() {
      let params = cloneDeep(this.accountFormData)
      const tmpArr = params.date_joined
      if (tmpArr) {
        const timeProp = 'date_joined'
        delete params.date_joined
        params[`${timeProp}_after`] = parseCharacterTime(
          new Date(`${tmpArr[0]} 00:00:00`).toString().replace(' GMT', '')
        )
        params[`${timeProp}_before`] = parseCharacterTime(
          new Date(`${tmpArr[1]} 23:59:59`).toString().replace(' GMT', '')
        )
      }
      this.query = params

      this.init()
    },
    photoSearch() {
      let params = cloneDeep(this.photoFormData)
      const tmpArr = params.create_time
      if (tmpArr) {
        const timeProp = 'create_time'
        delete params.create_time
        params[`${timeProp}_after`] = parseCharacterTime(
          new Date(`${tmpArr[0]} 00:00:00`).toString().replace(' GMT', '')
        )
        params[`${timeProp}_before`] = parseCharacterTime(
          new Date(`${tmpArr[1]} 23:59:59`).toString().replace(' GMT', '')
        )
      }
      params.category = params.category_name[params.category_name.length - 1]
      delete params.category_name
      this.query = params

      this.init()
    },
    orderSearch() {
      let params = cloneDeep(this.orderFormData)
      if (params.importTime) {
        const importTime = params.importTime
        params.importStartTime = params.importTime[0]
        params.importEndTime = params.importTime[1]
      }
      delete params.importTime
      this.query = params

      this.init()
    },
    proSearch() {
      let params = cloneDeep(this.proFormData)
      const tmpArr = params.create_time
      if (tmpArr) {
        const timeProp = 'create_time'
        delete params.create_time
        params[`${timeProp}_after`] = parseCharacterTime(
          new Date(`${tmpArr[0]} 00:00:00`).toString().replace(' GMT', '')
        )
        params[`${timeProp}_before`] = parseCharacterTime(
          new Date(`${tmpArr[1]} 23:59:59`).toString().replace(' GMT', '')
        )
      }
      if(!params.chinese_name) {
        delete params.chinese_name
      }else {
        params.name = params.chinese_name
        delete params.chinese_name
      }
      this.query = params

      this.init()
    },
    getTableData(value) {
      if (value == '子账号管理') {
        this.cleanQuery(this.accountFormData)
      } else if (value == '分销商图片管理') {
        this.cleanQuery(this.photoFormData)
      } else if (value == '分销商订单管理') {
        this.cleanQuery(this.orderFormData)
      } else {
        this.cleanQuery(this.proFormData)
      }
    },
    handleStyle(data) {
      if (Array.isArray(data.products)) {
        return data.products.map((item) => {
          return item.struct_name
        })
      }
      return []
    },
    handleSize(data) {
      if (Array.isArray(data.products)) {
        return data.products[0].spec_prods.map((item) => {
          return item
        })
      }
      return []
    },
    handleState(data) {
      if (Array.isArray(data.products)) {
        let message = '已全部生成'
        data.products.map((product) => {
          product.spec_prods.find((item) => {
            if (item.path === null) {
              message = '未全部生成'
            }
          })
        })
        return message
      }
      return []
    },
    async onWatch(data) {
      const { id } = data
      await getDetail({ id }).then(({ detail }) => {
        this.designedProduct = detail
      })
      this.show = true
    }
  }
}
</script>

<style scoped lang="scss">
.formPart {
  margin-top: 25px;
  padding: 20px;
  background: #f7f8fa;
  .el-form-item {
    margin-right: 15px;
  }
}
.tablePart {
  margin-top: 25px;
}
.merge-wrapper {
  display: flex;
  align-items: center;
  .el-image {
    flex: 0 0 44px;
    width: 44px;
    height: 44px;
    background: $bg-color;
  }
  .name {
    margin-left: 10px;
    flex: 1;
  }
}
</style>
