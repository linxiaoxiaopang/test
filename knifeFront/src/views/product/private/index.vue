<template>
  <div class="app-container personalInfoPage personal-private">
    <div class="content">
      <div class="mb20 flex-middle">
        <avue-form
          v-model="form"
          :option="formOption"
          @submit="handleSearch"
          style="margin-left: -20px"
        >
          <template #select>
            <el-input
              :placeholder="placeholder"
              v-model="form[selectValue]"
              size="small"
              style="width: 400px; margin-top: 4px"
              class="input-with-select"
              @keyup.enter.native="handleSearch"
            >
              <el-select
                v-model="selectValue"
                slot="prepend"
                placeholder="请选择"
                style="width: 100px"
              >
                <el-option label="产品名称" value="chinese_name"></el-option>
                <el-option label="图片名称" value="img_title"></el-option>
              </el-select>
              <el-button
                slot="append"
                icon="el-icon-search"
                type="primary"
                @click="handleSearch"
              >
                查询
              </el-button>
            </el-input>
          </template>
        </avue-form>
      </div>
      <!-- 全选与批量下载按钮 -->
      <div class="mb20">
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          class="size-large"
          @change="handleCheckAllChange"
        ></el-checkbox>
        <el-button plain size="small" class="ml10" @click="handleBatch"
          >批量下载效果图
        </el-button>
      </div>
      <el-checkbox-group
        v-model="checkedList"
        class="checkbox-img"
        v-loading="loading"
        @change="handleCheckedChange"
      >
        <el-row :gutter="20">
          <el-col v-for="(img, index) in imgList" :key="img.id" :span="1.5">
            <el-checkbox
              :label="index"
              :disabled="!hasRendering(img)"
              class="size-large"
            >
              <div class="img-wrapper">
                <el-image
                  :src="getValueFromObj(img, `products[${img.productIndex}].prod_show_images[0].path`)"
                  fit="contain"
                >
                  <div slot="error">
                    <img
                      src="@/assets/images/default.png"
                      alt=""
                      class="block"
                    />
                  </div>
                </el-image>
                <div
                  class="img-mask"
                  @click.prevent="handleImgClick(img)"
                ></div>
              </div>
              <div class="img-name text-cut text-col">
                {{ validData(img.name, '暂无') }}
              </div>
              <div class="flex-between product-font">
                <span>{{ parseCharacterTime(img.create_time) }}</span>
                <span>￥{{ minPrice(img) }}</span>
              </div>
              <div class="colors">
                <div
                  class="color-wrapper"
                  v-for="(product, index) in getColors(img.products)"
                  :key="index"
                  :style="{ background: product.color_value }"
                  @click.stop.prevent="img.productIndex = index"
                >
                  <div
                    :class="['color', img.productIndex === index && 'active']"
                  ></div>
                </div>
                <div
                  v-if="!getColors(img.products).length"
                  class="color-wrapper"
                ></div>
              </div>
              <el-dropdown @command="handleCommand($event, img)">
                <el-button plain size="mini" icon="el-icon-more"></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    command="download"
                    :disabled="!hasRendering(img)"
                    >下载效果图
                  </el-dropdown-item>
                  <el-dropdown-item command="redesign"
                    >重新设计
                  </el-dropdown-item>
                  <el-dropdown-item command="showSku"
                    >查看 SKU
                  </el-dropdown-item>
                  <el-dropdown-item
                    command="edit"
                    v-p="['product:spec_prim_prod:partial_update']"
                  >
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item
                    command="delete"
                    v-p="['product:spec_prim_prod:delete']"
                  >
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-checkbox>
          </el-col>
        </el-row>
      </el-checkbox-group>

      <PaginationBar
        ref="paginationBar"
        @refreshTableEventFun="refreshTableEventFun"
        :page="tablePage.pageIndex"
        :total="tablePage.total"
        :fSize="[12, 24, 36, 48, 96]"
      />
    </div>

    <preview-img-dialog
      :visible.sync="previewImgDialogVisible"
      :data="previewImgData"
    ></preview-img-dialog>

    <show-sku
      :data="skuData"
      :visible.sync="skuDialogVisible"
      @closeDialog="closeDialog"
    ></show-sku>

    <el-dialog
      :visible.sync="imgEditDialogVisible"
      title="编辑"
      width="576px"
      custom-class="img-edit-dialog"
    >
      <avue-form
        v-model="imgEditForm"
        :option="editFormOption"
        @submit="imgEditSubmit"
        @reset-change="imgEditDialogVisible = false"
        ref="form"
      >
        <template #detail>
          <Editor
            id="basisEditor"
            :val.sync="imgEditForm.detail"
            placeholder="请输入描述"
            :height="300"
            serverUrl="serverUrl"
            useObjectStr="CONTENT_UEDITOR_FILE"
          />
        </template>
      </avue-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getMyProduct as list,
  editMyProduct as edit,
  delMyProduct as del
} from '@/api/product'
import { validatenull } from '@/components/avue/utils/validate'
import { debounce, getValueFromObj, parseCharacterTime } from '@/utils'
import { formOption, editFormOption } from './constant'
import previewImgDialog from '@/views/product/module/previewImgDialog'
import showSku from '@/views/product/module/showSku'
import { downloadByZip } from '@/utils/download'
import Editor from '@/components/editor'
import { deepClone, delDicEmptyChildren } from '@/components/avue/utils/util'
import preview from '../mixins/preview'
import { mapGetters } from 'vuex'

export default {
  components: {
    showSku,
    previewImgDialog,
    Editor
  },
  mixins: [preview],
  data() {
    this.$store.dispatch('HandleOption', formOption)
    return {
      formOption,
      form: {
        proCategory: '',
        create_time: [],
        img_title: '',
        chinese_name: ''
      },
      placeholder: '请输入产品名称',
      selectValue: 'chinese_name',
      searchName: '',
      postData: {},
      loading: false,
      imgList: [],
      tablePage: {
        pageIndex: 1,
        pageSize: 12,
        total: 0
      },
      isIndeterminate: false,
      checkAll: false,
      checkedList: [],

      previewImgData: {},
      previewImgDialogVisible: false,

      imgEditForm: {},
      editFormOption,
      imgEditDialogVisible: false,

      skuDialogVisible: false,
      skuData: {}
    }
  },
  computed: {
    ...mapGetters(['categoryQuery']),
    page({ tablePage }) {
      return {
        page: tablePage.pageIndex,
        size: tablePage.pageSize
      }
    },
    minPrice() {
      return (img) => {
        const {
          prim_prod: { sizes }
        } = img
        const allPrice = []
        try {
          sizes.map(({ price_confs }) => {
            try {
              price_confs.map(({ price }) => {
                allPrice.push(price)
              })
            } catch (err) {}
          })
        } catch (err) {}

        if (allPrice.length) {
          return Math.min.apply(null, allPrice)
        } else {
          return '0'
        }
      }
    }
  },
  watch: {
    categoryQuery: {
      handler() {
        console.log('this.categoryQuery', this.categoryQuery)
        this.form.proCategory =
          this.categoryQuery === 'all' ? [] : [this.categoryQuery]
        this.handleSearch()
      },
      immediate: true
    },
    selectValue: {
      handler(newVal, oldVal) {
        this.form[oldVal] = ''
        if (newVal == 'chinese_name') {
          this.placeholder = '请输入产品名称'
        } else {
          this.placeholder = '请输入图片名称'
        }
      }
    }
  },
  methods: {
    getValueFromObj,
    parseCharacterTime,
    getColors(products) {
      return products.slice(0, 5)
    },
    handleSearch() {
      if (!Array.isArray(this.form.create_time)) this.form.create_time = []
      this.init()
    },
    refreshTableEventFun({ page, size }) {
      this.isPageChange = true
      this.tablePage.pageIndex = page
      this.tablePage.pageSize = size
      this.getList()
    },
    imgEditSubmit(form) {
      // console.log(form);
      let SKUs = []
      form.products[form.productIndex].spec_prods.forEach((sku) => {
        SKUs.push({
          id: sku.id,
          externalSku: sku.SKU
        })
      })
      edit(form.id, {
        chinese_name: form.chinese_name,
        english_name: form.english_name,
        detail: form.detail
      }).then((res) => {
        this.$isSuccess({
          ...res,
          success: () => {
            this.imgEditDialogVisible = false
            this.init()
          }
        })
      })
    },
    handleBatch() {
      if (this.checkedList.length) {
        let paths = []
        this.checkedList.forEach((idx) => {
          const products = this.imgList[idx].products
          products.map((item) => {
            item.prod_show_images.map((item2, index2) => {
              const spec = item.spec_prods[0]
              let name = spec.SKU + '内部'
              if (spec.custom_sku) {
                const custom_sku = spec.custom_sku
                  .split('-')
                  .filter((sk) => sk !== spec.size)
                  .join('-')
                name =
                  item.prod_show_images.length > 1
                    ? custom_sku + '-' + (index2 + 1)
                    : custom_sku
              }
              paths.push({
                url: item2.clear_path,
                name: name
              })
            })
          })
        })
        downloadByZip(paths)
        return
      }
      this.$message.error('请先选择产品')
    },
    handleCommand(command, img) {
      switch (command) {
        case 'download':
          const product = img.products
          console.log('product',product);
          const paths = []
          product.map((item) => {
            item.prod_show_images.map((item2, index2) => {
              const spec = item.spec_prods[0]
              let name = spec.SKU + '内部'
              if (spec.custom_sku) {
                const custom_sku = spec.custom_sku
                  .split('-')
                  .filter((sk) => sk !== spec.size)
                  .join('-')
                name =
                  item.prod_show_images.length > 1
                    ? custom_sku + '-' + (index2 + 1)
                    : custom_sku
              }
              paths.push({
                url: item2.clear_path,
                name: name
              })
            })
          })
          downloadByZip(paths,'') // 修改文件夹名字，填在空字符串内
          break
        case 'redesign':
          this.$router.push({
            path: '/design/designContainer',
            query: {
              protoId: img.prim_prod.id,
              id: img.prim_prod.base_sizes[0]
            }
          })
          break
        case 'showSku':
          this.skuData = img
          console.log('this.skuData', this.skuData)
          this.skuDialogVisible = true
          break
        case 'edit':
          this.imgEditForm = JSON.parse(JSON.stringify(img))
          this.imgEditDialogVisible = true
          break
        case 'delete':
          this.$confirm('确定删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              del(img.id).then((res) => {
                if ($SUC(res)) {
                  this.init()
                  this.$message.success('删除成功')
                }
              })
            })
            .catch(() => {
              this.$message.info('已取消删除')
            })
          break
      }
    },
    closeDialog() {
      this.skuDialogVisible = false
      this.getList()
    },
    handleImgClick(img) {
      this.previewImgData = img
      this.previewImgDialogVisible = true
    },
    handleCheckAllChange(val) {
      this.checkedList = []
      if (val) {
        this.imgList.forEach((img, index) => {
          if (this.hasRendering(img)) {
            this.checkedList.push(index)
          }
        })
      }
      this.isIndeterminate = false
    },
    handleCheckedChange(value) {
      // console.log(value)
      let notDisabledLen = this.imgList.filter((img) =>
        this.hasRendering(img)
      ).length
      let checkedCount = value.length
      this.checkAll = checkedCount === notDisabledLen
      this.isIndeterminate = checkedCount > 0 && checkedCount < notDisabledLen
    },
    init() {
      this.tablePage.pageIndex = 1
      this.getList()
    },
    getList: debounce(
      async function () {
        this.getPostData()
        this.loading = true
        this.isIndeterminate = false
        this.checkAll = false
        this.checkedList = []
        try {
          let {
            detail: { results, count }
          } = await list(this.postData)
          results.forEach((item) => (item.productIndex = 0))
          this.imgList = results
          this.tablePage.total = count
        } catch (e) {
          console.log(e)
        }
        this.loading = false
      },
      200,
      false
    ),
    handleSearchForm() {
      let form = {}
      let { form: searchForm } = this
      for (const key in searchForm) {
        let value = searchForm[key]
        if (!validatenull(value) && value !== 'all') {
          if (['create_time'].includes(key) && Array.isArray(value)) {
            form[key + '_after'] = value[0] + ' 00:00:00'
            form[key + '_before'] = value[1] + ' 23:59:59'
            continue
          }
          if (['proCategory'].includes(key)) {
            form.category = value[value.length - 1]
            continue
          }

          form[key] = value
        }
      }
      return form
    },
    getPostData() {
      if (this.isPageChange) {
        Object.assign(this.postData, this.page)
      } else {
        this.postData = {
          ...this.page,
          ...this.handleSearchForm()
        }
      }
      this.isPageChange = false
    }
  }
}
</script>

<style lang="scss">
.personal-private {
  .color-wrapper {
    width: 10% !important;
    padding-top: 10% !important;
  }
  .product-font {
    font-size: 12px;
    color: #9da3ac;
  }
  .text-col {
    color: #495060;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 250px;
  }
}
.el-input-group__append {
  background-color: $--color-primary;
  color: white;
}
</style>
