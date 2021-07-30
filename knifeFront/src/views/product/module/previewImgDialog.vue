<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" custom-class="preview-img-dialog" width="1200px">
      <el-button
        type="text"
        icon="el-icon-close"
        class="custom-dialog-close"
        @click="dialogVisible = false"
      ></el-button>
      <el-carousel
        :interval="5000"
        :arrow="images.length > 1 ? 'always' : 'never'"
        indicator-position="none"
        :autoplay="false"
        class="img-bg"
      >
        <el-carousel-item v-for="item in images" :key="item.id">
          <el-image :src="item.path" fit="contain" class="h100">
            <div slot="error" class="image-slot">
              <img
                src="@/assets/images/default.png"
                width="100%"
                height="100%"
                alt=""
                class="block"
              />
            </div>
          </el-image>
          <div class="colors">
            <div
              class="color-wrapper"
              v-for="(product, index) in colors"
              :key="index"
              :style="{ background: product.color_value }"
              @click.stop.prevent="data.productIndex = index"
            >
              <div :class="['color', data.productIndex === index && 'active']"></div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
      <div class="more-info">
        <div class="base-info">
          <div class="title">基本信息</div>
          <div class="content">
            <div class="item">
              <span class="basic-item">中文名称</span>
              <span class="basic-input">{{ data.chinese_name }}</span>
            </div>
            <div class="item">
              <span class="basic-item">英文名称</span>
              <span class="basic-input">{{ data.english_name }}</span>
            </div>
            <div class="item">
              <span class="basic-item">产品分类</span>
              <span class="input">{{ data.category_name }}</span>
            </div>
            <div class="item">
              <span class="basic-item">产品原型</span>
              <span class="input">{{ data.name }}</span>
            </div>
            <div class="item">
              <detailTable :data="data"></detailTable>
            </div>
          </div>
        </div>
        <div class="base-info">
          <div class="title">
            <span>下载效果图</span>
          </div>
          <el-button
            type="primary"
            plain
            icon="el-icon-upload"
            @click="handleUpload"
            :disabled="!hasRendering(data)"
            >下载</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { dialogComponentsMixin } from '@/mixins'
import { parseCharacterTime } from '@/utils'
import { validatenull } from '@/components/avue/utils/validate'
import { downloadByZip } from '@/utils/download'
import detailTable from './detailTable'
import preview from '../mixins/preview'
export default {
  mixins: [dialogComponentsMixin, preview],
  components: {
    detailTable
  },
  props: {
    data: {
      type: Object,
      default() {
        return {
          products: []
        }
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    colors({ data }) {
      if (validatenull(data.products)) return []
      return data.products.slice(0, 5)
    },
    images({ data }) {
      if (validatenull(data.products)) return []
      return data.products[data.productIndex].prod_show_images
    }
  },
  watch: {
    data: {
      handler(n) {
        console.log(n)
      },
      immediate: true
    }
  },
  methods: {
    parseCharacterTime,
    handleUpload() {
      const img = this.data
      const product = img.products
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
            name = item.prod_show_images.length > 1 ? custom_sku + '-' + (index2 + 1) : custom_sku
          }
          paths.push({
            url: item2.clear_path,
            name: name
          })
        })
      })
      downloadByZip(paths)
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-img-dialog {
  .colors {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    margin: auto;
    width: 30%;
  }
}
.el-carousel__item {
  background-color: #fff;
}
.basic-item {
  margin-right: 23px;
  color: #9da3ac;
}
.basic-input {
  max-width: 178px;
  color: #495060;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item {
  margin-bottom: 10px !important;
}
</style>
