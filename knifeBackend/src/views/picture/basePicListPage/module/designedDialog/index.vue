<template>
  <div class="dialog-warpper">
    <el-dialog
      title="查看"
      :visible.sync="visible"
      top="10vh"
      width="1040px"
      :before-close="handleClose"
    >
      <div class="container">
        <div class="content-warpper">
          <el-popover placement="right" trigger="hover" :visible-arrow="false">
            <div slot="reference">
              <el-image
                :src="product.thumbnail_path"
                fit="contain"
                style="width: 100px; height: 100px"
              ></el-image>
            </div>
            <div style="height: 40px; line-height: 32px; background: #fff">
              {{ product.title }}
            </div>
            <el-image
              fit="contain"
              :src="product.thumbnail_path"
              style="width: 450px; height: 450px"
              :z-index="9999"
            >
            </el-image>
          </el-popover>
          <span class="title">{{ product.title }}</span>
        </div>
        <CommonTable
          :selection="false"
          :tableLoading="tableLoading"
          :cols="cols"
          height="auto"
          :infoData="data"
          style="padding: 0 24px"
        >
          <template #chineseNameSlot="{ scoped }">
            {{ handleCnName(scoped) }}
          </template>
          <template #englishNameSlot="{ scoped }">
            {{ handleEnName(scoped) }}
          </template>
          <template #styleSlot="{ scoped }">
            <el-tag
              style="margin-right: 5px"
              type="primary"
              :key="index"
              v-for="(item, index) in handleStyle(scoped)"
            >
              {{ item }}
            </el-tag>
          </template>
          <template #sizeSlot="{ scoped }">
            <el-tag
              style="margin-right: 5px"
              type="primary"
              :key="sku"
              v-for="{ size_name, sku } in handleSize(scoped)"
            >
              {{ size_name }}
            </el-tag>
          </template>
          <template #pictureSlot="{ scoped }">
            <el-popover placement="right" trigger="hover" :visible-arrow="false">
              <div class="carousel-wrapper" slot="reference">
                <el-carousel
                  style="width: 150px"
                  indicator-position="none"
                  arrow="always"
                  :autoplay="false"
                  :loop="false"
                  height="50px"
                  @change="slideChangeHandler(scoped.index, $event)"
                >
                  <el-carousel-item
                    class="swiper-item"
                    v-for="(item, index) in imagesList(scoped)"
                    :key="index"
                  >
                    <div class="img-wrapper">
                      <el-image fit="contain" :src="item.path" />
                    </div>
                  </el-carousel-item>
                </el-carousel>
                <div class="name-list">
                  <span
                    v-for="(item, index) in handleStyle(scoped)"
                    :key="index"
                    style="margin-right: 5px; cursor: pointer"
                    :class="{ active: scoped.currentStyleIndex === index }"
                    @click="handleClicked(scoped.index, index)"
                  >
                    {{ item }}</span
                  >
                </div>
              </div>
              <div style="height: 40px; line-height: 32px; background: #fff">
                {{ product.title }}
              </div>
              <div class="img-wrapper">
                <el-image fit="contain" style="width: 450px" :src="coverPath(scoped)" />
              </div>
            </el-popover>
          </template>
        </CommonTable>
        <PaginationBar
          ref="paginationBar"
          @refreshTableEventFun="refreshTableEventFun"
          :total="total"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { initDataMixin } from "@/mixins";
import { designedListCols as cols } from "./cols";
import SwiperWrapper from "@/components/swiperWrapper";

export default {
  mixins: [initDataMixin],
  components: {
    SwiperWrapper,
  },
  props: {
    visible: {
      type: Boolean,
    },
    product: {
      type: Object,
    },
  },
  computed: {
    imagesList() {
      return (data) => {
        try {
          let { products = [], currentStyleIndex } = data;
          return products[currentStyleIndex].prod_show_images;
        } catch (err) {
          return [];
        }
      };
    },
    coverPath() {
      return (data) => {
        try {
          let { currentImageIndex } = data;
          console.log("currentImageIndex", currentImageIndex);
          return this.imagesList(data)[currentImageIndex].path;
        } catch (err) {
          return require("@/assets/images/default.png");
        }
      };
    },
  },
  data() {
    return {
      cols,
      url: "/api/product/back_prim_prod/",
      query: {
        img_id: this.product.id,
      },
      swiperOption: {
        autoplay: false,
        pagination: {},
      },
      tableData: [
        {
          cnTitle: "",
          enTitle: "",
          style: "",
          size: "",
          pic: "",
        },
      ],
    };
  },
  methods: {
    handleClose() {
      this.$emit("update:visible", false);
    },
    handleCnName(data) {
      return data.chinese_name ? data.chinese_name : "暂无";
    },
    handleEnName(data) {
      return data.english_name ? data.english_name : "暂无";
    },
    handleStyle(data) {
      return (
        data.products &&
        data.products.map((item) => {
          return item.prim_struct.structure;
        })
      );
    },
    handleClicked(fIndex, sIndex) {
      const item = this.data[fIndex];
      item.currentStyleIndex = sIndex;
      item.currentImageIndex = 0;
      this.data.splice(fIndex, 1, item);
    },

    slideChangeHandler(fIndex, activeIndex) {
      const item = this.data[fIndex];
      // this.$set(item, 'currentImageIndex', activeIndex)
      item.currentImageIndex = activeIndex;
      this.data.splice(fIndex, 1, item);
    },

    handleSize(data) {
      return (
        data.products &&
        data.products[0].spec_prods.map((item) => {
          return item;
        })
      );
    },
    //这个函数是initData混入里的，可以拿到后端返回的数据
    initCallBack() {
      this.data.map((item) => {
        //为后端返回的数据增添currentImageIndex和currentStyleIndex字段
        //currentImageIndex是表格当前显示的效果图在当前款式定制产品的效果图中的索引
        //currentStyleIndex表示当前款式定制产品对应的索引值
        item.currentImageIndex = 0;
        item.currentStyleIndex = 0;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-warpper {
  ::v-deep {
    .el-dialog {
      border-radius: 4px;
      overflow: hidden;
    }
  }
  .carousel-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 161px;
    .swiper-item {
      display: flex;
      justify-content: center;
    }

    ::v-deep {
      .el-carousel__arrow.el-carousel__arrow {
        border: none;
        outline: 0;
        padding: 0;
        margin: 0;
        height: 36px;
        width: 36px;
        cursor: pointer;
        transition: 0.3s;
        color: #fff;
        position: absolute;
        top: 50%;
        z-index: 10;
        transform: translateY(-50%);
        text-align: center;
        color: #cdcdcd;
        font-weight: 600;
        background: none;
        left: 0;
        font-size: 20px;
      }
      .el-carousel__arrow--left.el-carousel__arrow--left {
        left: 0;
      }
      .el-carousel__arrow--right.el-carousel__arrow--right {
        left: auto;
        right: 0;
      }
    }
  }
  .img-wrapper {
    height: 50px;
    width: 50px;
  }
  .active {
    color: #3841db;
  }
  .flex {
    display: flex;
    align-items: center;
  }
  .table-warpper {
    padding: 0px 24px 10px 24px;
  }
  .container {
    height: 700px;
    overflow: auto;
    .content-warpper {
      padding: 22px 0 0 24px;
    }
  }

  ::v-deep {
    .el-dialog__title {
      font-size: 14px;
      color: #1a1a1a;
    }
    .el-dialog__header {
      height: 56px;
      line-height: 56px;
      padding: 0 0 0 22px;
      border: 1px solid #dcdee0;
    }
    .el-dialog__body {
      padding: 0;
    }
  }
  .content-warpper {
    display: flex;
    margin-bottom: 21px;
    .title {
      margin-left: 20px;
      color: #1a1a1a;
    }
  }
}
</style>
<style lang="scss">
// .el-carousel__arrow.el-carousel__arrow {
//   border: none;
//   outline: 0;
//   padding: 0;
//   margin: 0;
//   height: 36px;
//   width: 36px;
//   cursor: pointer;
//   transition: 0.3s;
//   color: #fff;
//   position: absolute;
//   top: 50%;
//   z-index: 10;
//   transform: translateY(-50%);
//   text-align: center;
//   color: #ffcdcdcd;
//   font-weight: 600;
//   background: none;
//   left: 0;
//   font-size: 20px;
// }
// .el-carousel__arrow--left.el-carousel__arrow--left {
//   left: 0;
// }
// .el-carousel__arrow--right.el-carousel__arrow--right {
//   left: auto;
//   right: 0;
// }
</style>
