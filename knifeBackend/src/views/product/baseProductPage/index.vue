<template>
  <section class="app-container shelvesPage">
    <slot name="top" :sup_this="sup_this"></slot>
    <EHeader :sup_this="sup_this" :query="query" :formField="formField" @searchChange="SearchChange" />
    <slot name="batchOperation" :sup_this="sup_this">
      <div style="min-height: 30px"></div>
    </slot>
    <slot name="tips" :sup_this="sup_this">
      
    </slot>

    <div class="table-wrapper">
      <CommonTable
        height="100%"
        :tableLoading="tableLoading"
        :cols="cols"
        :infoData="data"
        :class="{ editCommonTable: isEdit }"
        @selection-change="handleSelectionChange"
      >
        <template #mergeSlot="{ scoped }">
          <div class="merge-slot-class">
            <el-image style="width: 60px; height: 60px" :src="figure(scoped)" fit="contain"></el-image>
            <div>
              <div>
                {{ scoped.name || '暂无名字' }}
              </div>
              <div class="customs-code">
                {{ scoped.customs_code || '暂无海关编码' }}
              </div>
            </div>
          </div>
        </template>
        <template #mergeManageSlot="{ scoped }">
          <div class="merge-slot-class">
            <div>
              <div>
                {{ scoped.name || '暂无名字' }}
              </div>
              <div class="customs-code">
                {{ scoped.customs_code || '暂无海关编码' }}
              </div>
            </div>
          </div>
        </template>
        <template #sexSlot="{ scoped }">
          <el-tag type="primary">
            {{ SEX_LIST[scoped[scoped.prop] || 0] }}
          </el-tag>
        </template>

        <template #sizesSlot="{ scoped }">
          <el-tag type="primary" :key="id" v-for="{ size_name, id, psd_file, status } in sizes(scoped)">
            {{ size_name }}
            <color-text-btn v-if="isShelves({ status })" type="danger">(已上架) </color-text-btn>
            <color-text-btn type="danger" v-if="!psd_file">(psd未上传)</color-text-btn>
          </el-tag>
          <!--<SizesEdit
            v-if="isEdit"
            :sup_this="sup_this"
            :data="scoped"
            class="sizes-edit"
            v-p="['product:size_spec:partial_update', 'product:size_spec:create', 'product:size_spec:set_size_sort']"
          />-->
        </template>

        <template #sizesSlotManage="{ scoped }">
          <el-tag type="primary" :key="id" v-for="{ size_name, id, psd_file } in scoped[scoped.prop] || []">
            {{ size_name }}
          </el-tag>
        </template>

        <template #prim_structSlot="{ scoped }">
          <SwiperWrapper
            ref="swiperWrapper"
            :slideStyle="{
              width: '90px',
              height: '80px'
            }"
            :defaultSwiperOptions="swiperOption"
            :swiperData="primStructSwiperData(scoped.row)"
          >
            <template v-slot="{ scoped: swiperItem }">
              <div class="img-wrapper">
                <el-image
                  v-if="swiperItem.noPath"
                  fit="contain"
                  style="width: 80px; height: 80px"
                  :src="swiperItem.image"
                />

                <el-image
                  v-else
                  fit="contain"
                  style="width: 80px; height: 80px"
                  :src="swiperItem.white_show | formatUrl('min')"
                />
              </div>
            </template>
          </SwiperWrapper>
          <div class="structure-list">
            <div
              :class="['structure', index == (data[scoped.index] || {}).curIndex && 'active']"
              :key="id"
              @click="toggleCurIndexByStruct(scoped.index, index)"
              v-for="({ structure, id, prim_show_groups }, index) in data[scoped.index][scoped.prop]"
            >
              {{ structure }}
              <span type="danger" style="color: #ff4949" v-if="!existProShow(prim_show_groups)"> (缺图) </span>
            </div>
          </div>
        </template>

        <template #base_sizesSlot="{ scoped }">
          <span :key="id" v-for="{ size_name, id } in scoped[scoped.prop] || []">
            {{ size_name }}
          </span>
        </template>
        <template #seasonSlot="{ scoped }">
          <el-tag type="primary">
            {{ SEASONS_LSIT[scoped[scoped.prop] || 0] }}
          </el-tag>
        </template>

        <template #structSlot="{ scoped }">
          <el-tag type="primary" :key="id" v-for="{ structure, id, status } in structs(scoped) || []">
            {{ structure }}
            <color-text-btn v-if="isShelves({ status })" type="danger">(已上架) </color-text-btn>
          </el-tag>
          <structEdit
            v-if="isEdit"
            :sup_this="sup_this"
            :data="scoped"
            class="struct-edit"
            v-p="[
              'prim_prod:prim_struct:partial_update',
              'prim_prod:prim_struct:create',
              'prim_prod:prim_struct:delete',
              'prim_prod:prim_figure:partial_update',
              'prim_prod:prim_figure:create',
              'prim_prod:prim_figure:delete'
            ]"
          />
        </template>

        <template #structSlotManage="{ scoped }">
          <el-tag type="primary" :key="id" v-for="{ structure, id } in structs(scoped) || []">
            {{ structure }}
          </el-tag>
        </template>

        <template #off_timeSlot="{ scoped }">
          <span>{{ parseTime(scoped[scoped.prop]) }}</span>
        </template>
        <template #create_timeSlot="{ scoped }">
          <span>{{ parseTime(scoped[scoped.prop]) }}</span>
        </template>
        <template #put_on_timeSlot="{ scoped }">
          <span>{{ parseTime(scoped[scoped.prop]) }}</span>
        </template>
        <template #gearsCateTimeSlot="{ scoped }">
          <span>{{ parseTime(scoped[scoped.prop]) }}</span>
        </template>
        <template #priceSlot="{ scoped }">
          <div class="flex-column">
            <template v-if="hasPrice(scoped)">
              <div>￥{{ minPrice(scoped) }} - ￥{{ maxPrice(scoped) }}</div>
              <el-button
                :loading="scoped.loading"
                type="text"
                size="mini"
                class="filter-item"
                @click="showPrice(scoped, scoped.index)"
              >查看价格</el-button
              >
            </template>
            <div v-else>暂无数据</div>
          </div>
        </template>
        <slot :sup_this="sup_this"></slot>
      </CommonTable>
    </div>
    <PaginationBar ref="paginationBar" @refreshTableEventFun="refreshTableEventFun" :total="total" />
    <BaseDialog
      v-if="showDialog"
      style="text-align: left"
      :dialogVisible.sync="showDialog"
      :append-to-body="false"
      :modal-append-to-body="false"
      width="70vw"
      height="395px"
      title="原型价格"
    >
      <div class="price-wrapper">
        <div class="flex">
          <el-image :src="cover" fit="cover" class="product-image" />
          <div class="product-name">{{ product.name }}</div>
        </div>
        <div class="table">
          <priceTable :priceData="priceData" :priceColData="priceColData"></priceTable>
        </div>
      </div>
      <template #footer>
        <span></span>
      </template>
    </BaseDialog>
  </section>
</template>

<script>
import SwiperWrapper from '@/components/swiperWrapper'
import priceTable from '../module/setPrice'
import EHeader from './module/header'
import ProtoType from './module/protoType'
import Edit from './module/edit'
import SizesEdit from './module/sizesEdit'
import PsdBtn from './module/psdBtn'
import StructEdit from './module/structEdit'

import { initDataMixin } from '@/mixins'
import { SEX_LIST, SEASONS_LSIT, PIC_SIZE, SHELVES } from '@/utils/constant'
import { parseTime } from '@/utils'

export default {
  mixins: [initDataMixin],
  props: {
    cols: {
      type: Array,
      required: true
    },
    formField: {
      type: Array,
      required: true
    },
    status: {
      default: 0
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    resetUrl: String
  },
  components: {
    SwiperWrapper,
    ProtoType,
    priceTable,
    EHeader,
    SizesEdit,
    StructEdit,
    PsdBtn,
    Edit
  },
  data() {
    return {
      PIC_SIZE,
      SEX_LIST,
      SEASONS_LSIT,
      sup_this: this,
      url: `/api/prim_prod/prim_product/?status=${this.status}`,
      showDialog: false,
      product: {},
      proLen: 0,
      swiperOption: {
        slidesPerView: 'auto',
        autoplay: false,
        pagination: {},
        navigation: {}
      },
      priceData: [
        // { size: '70*60', price: 12.6, price1: 12.4, price2: 12.2 },
        // { size: '60*50', price: 11.6, price1: 11.4, price2: 11.2 },
        // { size: '50*40', price: 10.6, price1: 10.4, price2: 10.2 }
      ],
      priceColData: [
        // { prop: 'size', label: '尺寸' },
        // { prop: 'price', label: '1-6件价格' },
        // { prop: 'price1', label: '7-20件价格' },
        // { prop: 'price2', label: '20+件价格' }
      ],
      dataFilterForm: {
        structName: '',
        psdStatus: ''
      }
    }
  },
  created() {
    if (this.resetUrl) {
      this.url = this.resetUrl
    }
  },

  computed: {
    hasPrice() {
      return ({ sizes }) => {
        return sizes.some(({ price_confs }) => price_confs.some(({ price }) => price || price === 0))
      }
    },
    minPrice() {
      return (data) => {
        const { sizes } = data
        let priceArr = []
        sizes.map((size) => {
          const { price_confs } = size
          price_confs.map((item) => {
            priceArr.push(Number(item.price))
          })
        })
        let min = priceArr[0]
        for (let i = 1; i < priceArr.length; i++) {
          if (priceArr[i] < min) {
            min = priceArr[i]
          }
        }
        return min
      }
    },
    maxPrice() {
      return (data) => {
        const { sizes } = data
        let priceArr = []
        sizes.map((size) => {
          const { price_confs } = size
          price_confs.map((item) => {
            priceArr.push(Number(item.price))
          })
        })
        let max = priceArr[0]
        for (let i = 1; i < priceArr.length; i++) {
          if (priceArr[i] > max) {
            max = priceArr[i]
          }
        }
        return max
      }
    },
    isShelves() {
      return (data) => {
        return data.status == SHELVES
      }
    },
    cover() {
      try {
        if (!this.product.prim_struct[0].figures.length) {
          return require('@/assets/images/default.png')
        }
        return this.product.prim_struct[0].figures[0].path
      } catch (err) {
        return require('@/assets/images/default.png')
      }
    },
    primStruct() {
      return (row) => {
        if (row.curIndex === undefined) {
          row.curIndex = 0
        }
        return row.prim_struct[row.curIndex] || {}
      }
    },
    primStructSwiperData({ primStruct }) {
      let defaultShowImg = [
        {
          image: require('@/assets/images/default.png'),
          noPath: true
        }
      ]
      return (row) => {
        let {
          prim_show_groups: [
            {
              prim_show_img = []
            } = {}
          ] = []
        } = primStruct(row)
        return prim_show_img.length ? prim_show_img : defaultShowImg
      }
    },
    structs({ dataFilterForm: { structName } }) {
      return (row) => {
        let { prim_struct = [] } = row
        return prim_struct.filter(
          ({ structure }) => {
            if (!structName) return true
            structName.lastIndex = 0
            return structName.test(structure)
          }
        )
      }
    },
    sizes({ dataFilterForm: { psdStatus } }) {
      if (![undefined, null].includes(psdStatus)) psdStatus = psdStatus + ''
      return (row) => {
        let sizes = row[row.prop]
        sizes = sizes || []
        return sizes.filter(
          ({ psd_file }) => {
            if (!psdStatus) return true
            if (psdStatus === '0') {
              return !psd_file
            } else if (psdStatus === '1') {
              return psd_file
            }
          }
        )
      }
    },
    figure() {
      return (row) => {
        try {
          const {
            prim_struct: [{ figures = [] }]
          } = row || {}
          if (!figures || !figures.length) {
            return require('@/assets/images/default.png')
          }
          const cover = figures.filter(({ isCover }) => isCover)
          return (cover[0] && cover[0].path) || require('@/assets/images/default.png')
        } catch (err) {
          return require('@/assets/images/default.png')
        }
      }
    },
    existProShow() {
      return (prim_show_groups) => {
        try {
          return !!prim_show_groups[0].prim_show_img.length
        } catch (err) {
          return false
        }
      }
    }
  },
  methods: {
    parseTime,
    SearchChange() {
      this.dataFilterForm.psdStatus = this.query.size_psd
      this.dataFilterForm.structName = new RegExp(this.query.struct_name, 'img')
    },
    toggleCurIndexByStruct(dataIndex, index) {
      this.$set(this.data[dataIndex], 'curIndex', index)
      if (this.$refs.swiperWrapper) {
        this.$refs.swiperWrapper.swiper.slideTo(0, 100, false)
      }
    },
    initCallBack() {
      this.data = this.data.map((item) => {
        this.$set(item, 'curIndex', 0)
        return item
      })
    },

    formatPriceCols(sizes) {
      const priceColData = [{ prop: 'size', label: '尺寸' }]
      sizes.some((size) => {
        const { price_confs } = size
        if (!price_confs || price_confs.length === 0) return false
        let num = -1
        price_confs.map((item, index) => {
          num++
          const {
            gear_conf: { max_count, min_count },
            id
          } = item
          let label =
            index !== price_confs.length - 1 ? `${min_count}-${max_count}件价格（元）` : `${min_count}+件价格（元）`
          priceColData.push({
            prop: `price${num + 1}`,
            label,
            id
          })
        })
        return true
      })
      this.priceColData = priceColData
    },

    formatPriceData(sizes) {
      let tmpObj = {}
      sizes.map((item) => {
        const { size_name, price_confs } = item
        if (!tmpObj[size_name]) {
          tmpObj[size_name] = {
            data: []
          }
        }
        price_confs.map(({ price, gear_conf: { id } }) => {
          tmpObj[size_name].data.push({
            gear_conf: id,
            price
          })
        })
      })
      const tmpArr = []
      for (let key in tmpObj) {
        let obj = {}
        obj.size = key
        const data = tmpObj[key].data.sort((a, b) => {
          return a.gear_conf - b.gear_conf
        })
        data.map((item, index) => {
          obj[`price${index + 1}`] = item.price
        })
        tmpArr.push(obj)
      }
      console.log('tmpArr', tmpArr)
      this.priceData = tmpArr
      console.log('this.priceData', this.priceData)
    },

    initTabelData(data) {
      const { sizes } = data

      this.formatPriceCols(sizes)
      this.formatPriceData(sizes)
    },
    showPrice(data, index) {
      this.product = data
      this.$set(this.data[index], 'loading', true)
      this.initTabelData(data)
      this.showDialog = true
      this.$set(this.data[index], 'loading', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.shelvesPage {
  display: flex;
  flex-direction: column;
  .el-dialog__footer {
    ::v-deep {
      .el-button {
        display: none;
      }
    }
  }
  .price-wrapper {
    padding-left: 26px;
    margin-top: 30px;
    .link {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .href {
      color: $color-primary;
    }
    .table {
      margin-top: 41px;
    }
    .flex {
      display: flex;
      .product-image {
        width: 60px;
        height: 60px;
      }
      .product-name {
        margin-left: 12px;
        color: #ff6f30;
        height: 60px;
        line-height: 60px;
      }
    }
  }
  .table-wrapper {
    flex: 1;
    overflow: hidden;
    .flex-column {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
  .merge-slot-class {
    position: relative;
    display: flex;
    align-items: center;
    .el-image {
      margin-right: 10px;
      background: $border-color;
    }
    .customs-code {
      color: $color-warning;
      font-size: 12px;
    }
  }
  .structure-list {
    margin-top: 10px;
    display: flex;
    .structure {
      border: 1px solid $border-color;
      padding: 2px 5px;
      font-size: 12px;
      cursor: pointer;
    }
    .structure + .structure {
      margin-left: 5px;
    }
    .structure.active {
      border-color: $color-danger;
      color: $color-primary;
      background: #fff;
    }
  }
  .price {
    display: flex;
    justify-content: center;
  }
  .editCommonTable {
    .figure-edit,
    .sizes-edit,
    .struct-edit,
    .sizes-edit {
      position: absolute;
      right: 30px;
      bottom: 0px;
    }
    .merge-slot-class {
      top: 15px;
    }
    ::v-deep {
      .el-table__row {
        .cell {
          padding-bottom: 30px;
        }
      }
    }
  }

  .el-tag {
    margin-right: 5px;
    margin-top: 5px;
    span {
      font-size: 12px;
      display: inline-block;
      color: $color-danger;
    }
  }
}
</style>
