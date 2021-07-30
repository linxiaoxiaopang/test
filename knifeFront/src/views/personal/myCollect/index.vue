<template>
  <div class="app-container personalInfoPage">
    <div class="title">我的收藏</div>
    <div class="content">
      <div class="mb20 flex-middle">
        <span class="nowrap">
          ≡
          <el-cascader
            v-model="form.proCategory"
            :options="options"
            :show-all-levels="false"
            class="select-text"
            style="width: 100px"
            size="small"
            :props="{
              ...proCategoryProps,
              checkStrictly: true,
              emitPath: false
            }"
            placeholder="产品分类"
          ></el-cascader>
        </span>
        <avue-form v-model="form" :option="formOption"></avue-form>
      </div>

      <el-checkbox-group
        :value="[]"
        class="checkbox-img uncheckbox"
        v-loading="loading"
      >
        <el-row :gutter="20">
          <el-col v-for="img in imgList" :key="img.id" :span="1.5">
            <el-checkbox :label="img.id">
              <div class="img-wrapper">
                <el-image :src="getSrc(img)" fit="contain">
                  <div slot="error" class="image-slot">
                    <img
                      src="@/assets/images/default.png"
                      fit="contain"
                      alt=""
                      class="block"
                    />
                  </div>
                </el-image>
                <div class="img-mask cursor-pointer">
                  <el-button
                    icon="el-icon-star-on"
                    class="collect-btn"
                    @click="cancel(img.id)"
                  ></el-button>
                  <el-button
                    round
                    type="info"
                    icon="el-icon-top-right"
                    class="design-btn"
                    @click="design(img)"
                    >点击开始定制
                  </el-button>
                </div>
              </div>
              <div class="img-name text-cut">
                {{ validData(img.chinese_name, '暂无') }}
              </div>
              <div class="mtb5">
                批发: ￥{{ validData(getLowPrice(img.sizes), 0) }} 起
              </div>
              <div class="colors">
                <div
                  class="color-wrapper"
                  v-for="(product, index) in getColors(img.prim_struct)"
                  :key="index"
                  :style="{ background: product.prim_color }"
                  @click.stop.prevent="img.productIndex = index"
                >
                  <div
                    :class="['color', img.productIndex === index && 'active']"
                  ></div>
                </div>
                <div
                  v-if="!getColors(img.prim_struct).length"
                  class="color-wrapper"
                ></div>
              </div>
            </el-checkbox>
          </el-col>
        </el-row>
      </el-checkbox-group>

      <PaginationBar
        ref="paginationBar"
        @refreshTableEventFun="refreshTableEventFun"
        :page="page.page"
        :total="page.total"
        :fSize="[12]"
      />
    </div>
  </div>
</template>

<script>
import { list, cancel } from '@/api/product/collectionsApi'
import { debounce } from '@/utils'
import { validatenull } from '@/components/avue/utils/validate'
import { deepClone, delDicEmptyChildren } from '@/components/avue/utils/util'
import { mapGetters } from 'vuex'

export default {
  data() {
    let formOption = {
      submitBtn: false,
      emptyBtn: false,
      labelWidth: 20,
      column: [
        /*{
             prop: 'category',
             columnClass: 'input-text',
             placeholder: '来源',
             type: 'select',
             span: 6,
          },*/
        {
          prop: 'chinese_name',
          placeholder: '输入产品名称',
          prefixIcon: 'el-icon-search',
          span: 18
        }
      ]
    }
    this.$store.dispatch('HandleOption', formOption)
    return {
      formOption,
      form: {
        proCategory: [],
        title: '',
        create_time: []
      },

      loading: false,
      imgList: [],
      page: {
        page: 1,
        size: 12,
        total: 0
      }
    }
  },
  computed: {
    ...mapGetters(['proCategory', 'proCategoryProps']),
    options() {
      return delDicEmptyChildren(deepClone(this.proCategory))
    },
    postData({ form: { proCategory, create_time, chinese_name } }) {
      return {
        ...this.page,
        category: proCategory,
        create_time_after: create_time[0],
        create_time_before: create_time[1],
        chinese_name
      }
    }
  },
  watch: {
    form: {
      handler(n) {
        if (!Array.isArray(this.form.create_time)) this.form.create_time = []
        this.init()
      },
      deep: true
    }
  },
  created() {
    this.init()
  },
  methods: {
    cancel(id) {
      this.$reconfirm({
        msg: '确定取消该收藏？',
        success: () => {
          cancel({ id }).then((res) => {
            this.$isSuccess({
              ...res,
              successText: '已取消该收藏',
              success: () => this.init()
            })
          })
        }
      })
    },
    getList: debounce(async function () {
      this.loading = true
      try {
        let {
          detail: { results, count }
        } = await list(this.postData)
        results.forEach((item) => (item.productIndex = 0))
        this.imgList = results
        this.page.total = count
      } catch (e) {
        console.log(e)
      }
      this.loading = false
    }, 200),
    init() {
      this.page.page = 1
      this.getList()
    },
    design(data) {
      const baseSizes = data.base_sizes || []
      this.$router.push(
        `/design/designContainer?id=${baseSizes[0]}&protoId=${data.id}`
      )
    },
    getLowPrice(sizes) {
      if (validatenull(sizes)) {
        return 0
      }
      return Math.min(...sizes.map(({ price }) => price))
    },
    getSrc({ prim_struct, productIndex }) {
      if (prim_struct.length === 0) return ''

      let { figures } = prim_struct[productIndex]
      if (figures.length === 0) return ''

      return figures[0].path
    },
    getColors(products) {
      return products.slice(0, 5)
    },
    refreshTableEventFun({ page, size }) {
      this.page.page = page
      this.page.size = size
      this.getList()
    }
  }
}
</script>

<style lang="scss">
.personalInfoPage {
  .title {
    font-size: 16px !important;
  }
}
.colors {
  .color-wrapper {
    width: 25px!important;
    .color {
      height: 25px!important;
    }
  }
}
</style>
