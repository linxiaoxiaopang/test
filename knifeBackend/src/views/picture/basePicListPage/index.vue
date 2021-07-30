<template>
  <section class="app-container app-flex-col-container basePicListPage">
    <slot name="top" :sup_this="sup_this"></slot>
    <EHeader :sup_this="sup_this" :query="query" :formField="formField" />
    <slot name="batchOperation" :sup_this="sup_this">
      <div style="min-height: 30px"></div>
    </slot>
    <div class="flex-col-content">
      <CommonTable
        height="100%"
        :tableLoading="tableLoading"
        :cell-style="changeCellStyle"
        :cols="cols"
        :infoData="data"
        @selection-change="handleSelectionChange"
      >
        <template #originalMergeSlot="{ scoped }">
          <div class="merge-wrapper">
            <el-popover placement="right" trigger="hover" :visible-arrow="false">
              <div slot="reference">
                <el-image
                  fit="contain"
                  :src="scoped.images[0].thumbnail_path"
                  :z-index="9999"
                />
              </div>
              <div style="height: 40px; line-height: 32px; background: #fff">
                {{ scoped.chinese_name }}
              </div>
              <el-image
                fit="contain"
                :src="scoped.images[0].thumbnail_path"
                style="width: 450px; height: 450px"
                :z-index="9999"
              >
              </el-image>
            </el-popover>
          </div>
        </template>
        <template #picMergeSlot="{ scoped }">
          <div class="merge-wrapper">
            <el-popover placement="right" trigger="hover" :visible-arrow="false">
              <div slot="reference">
                <el-image fit="contain" :src="scoped.thumbnail_path" :z-index="9999" />
              </div>
              <div style="height: 40px; line-height: 32px; background: #fff">
                {{ scoped.title }}
              </div>
              <el-image
                fit="contain"
                :src="scoped.thumbnail_path"
                style="width: 450px; height: 450px"
                :z-index="9999"
              >
              </el-image>
            </el-popover>
          </div>
        </template>
        <template #mergeSlot="{ scoped }">
          <div class="merge-wrapper">
            <el-popover placement="right" trigger="hover" :visible-arrow="false">
              <div slot="reference">
                <el-image
                  fit="contain"
                  :src="scoped.thumbnail_path || scoped.path"
                  :z-index="9999"
                />
              </div>
              <div style="height: 40px; line-height: 32px; background: #fff">
                {{ scoped.chinese_name }}
              </div>
              <el-image
                fit="contain"
                :src="scoped.thumbnail_path || scoped.path"
                style="width: 450px; height: 450px"
                :z-index="9999"
              >
              </el-image>
            </el-popover>
            <div class="name">
              {{ scoped.title }}
            </div>
          </div>
        </template>
        <!-- <template #designedCnNameMergeSlot="{ scoped }">
          {{ handleCnName(scoped) }}
        </template> -->
        <template #designedEnNameMergeSlot="{ scoped }">
          {{ handleEnName(scoped) }}
        </template>
        <template #styleMergeSlot="{ scoped }">
          <el-tag
            style="margin-right: 5px; margin-bottom: 5px"
            type="primary"
            :key="index"
            v-for="(item, index) in handleStyle(scoped)"
          >
            {{ item }}
          </el-tag>
        </template>
        <template #pictureMergeSlot="{ scoped }">
          <el-tag
            style="margin-right: 5px; margin-bottom: 5px"
            type="primary"
            :key="sku"
            v-for="{ size_name, sku } in handleSize(scoped)"
          >
            {{ size_name }}
          </el-tag>
        </template>
        <template #basicMergeSlot="{ scoped }">
          {{ handleState(scoped) }}
        </template>
        <template #timeMergeSlot="{ scoped }">
          <span>{{ scoped[scoped.prop] | formatTime }}</span>
        </template>
        <template #picSizeMergeSlot="{ scoped }">
          <color-text-btn type="default">
            {{ scoped.width }} * {{ scoped.height }}</color-text-btn
          >
        </template>
        <template #designedMergeSlot="{ scoped }">
          <span
            style="display: inline-block; width: 80px"
            @mouseenter="onMouseEnter"
            @mouseleave="onMouseLeave"
            >{{ scoped.spec_prim_prod_count }}
            <span
              v-if="show && scoped.spec_prim_prod_count !== 0"
              style="color: #3841db; cursor: pointer; margin-left: 10px"
              @click="onWatch(scoped)"
              >查看</span
            ></span
          >
        </template>
        <template #stateMergeSlot="{ scoped }">
          <span v-if="scoped.disable === 1">禁用</span>
          <span v-else>启用</span>
        </template>

        <template #disableSlot="{ scoped }">
          <span v-if="scoped.disable === 1">下架</span>
          <span v-else>上架</span>
        </template>

        <template #sizeMergeSlot="{ scoped }">
          <color-text-btn type="default">
            {{ suffix(scoped) }}
          </color-text-btn>
        </template>
        <template #create_timeSlot="{ scoped }">
          <span>{{ scoped[scoped.prop] | formatTime }}</span>
        </template>
        <slot :sup_this="sup_this"></slot>
      </CommonTable>
    </div>
    <designedDialog v-if="open" :visible.sync="open" :product="productData" />
    <orderDialog :visible.sync="display" :order="orderData" />
    <PaginationBar
      ref="paginationBar"
      @refreshTableEventFun="refreshTableEventFun"
      :total="total"
    />
  </section>
</template>

<script>
import EHeader from "./module/header";
import orderDialog from "../../designedProductManage/module/orderDialog";
import UploadImg from "./module/uploadImg";
import designedDialog from "./module/designedDialog";
import { initDataMixin, delMixin } from "@/mixins";
import { getDetail } from "@/api/product/designed";
import { del as delApi, bulkDel as bulkDelApi } from "@/api/imageApi";
import { getFileSuffix } from "@/utils";

export default {
  mixins: [initDataMixin, delMixin],
  components: {
    EHeader,
    UploadImg,
    designedDialog,
    orderDialog,
  },
  props: {
    cols: {
      type: Array,
      required: true,
    },
    formField: {
      type: Array,
      required: true,
    },
    resetUrl: {
      type: String,
      default: "/api/image/image/",
    },
  },
  data() {
    return {
      show: false,
      open: false,
      display: false,
      productData: {},
      orderData: {},
      sup_this: this,
      url: this.resetUrl,
    };
  },
  computed: {
    suffix() {
      return (row) => {
        return getFileSuffix(row.path);
      };
    },
  },
  methods: {
    delApi,
    bulkDelApi,
    watch(data) {
      this.display = true;
      this.orderData = data;
    },
    //修改定制产品数这一列表格的文字颜色
    changeCellStyle(row) {
      //列的label的名称
      if (row.column.label === "定制产品数") {
        return "color: #3841DB;"; //修改的样式
      } else {
        return "";
      }
    },
    // handleCnName(data) {
    //   return data.chinese_name ? data.chinese_name : '暂无'
    // },
    handleEnName(data) {
      return data.english_name ? data.english_name : "暂无";
    },
    handleState(data) {
      let message = "已全部生成";
      data.products.map((product) => {
        product.spec_prods.find((item) => {
          if (item.path === null) {
            message = "未全部生成";
          }
        });
      });
      return message;
    },
    handleStyle(data) {
      return data.products.map((item) => {
        return item.struct_name;
      });
    },
    handleSize(data) {
      return data.products[0].spec_prods.map((item) => {
        return item;
      });
    },
    updateImageList({ id } = {}) {
      if (!id) return;
      this.url = `/api/image/image/?id=${id}`;
      this.page = 1;
      this.init();
    },
    //显示查看定制产品基本信息的对话框
    onWatch(data) {
      this.productData = data;
      this.open = true;
    },
    //鼠标经过事件
    onMouseEnter() {
      this.show = true;
    },
    //鼠标移出事件
    onMouseLeave() {
      this.show = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.basePicListPage.basePicListPage {
  .el-tag {
    display: inline-block;
    margin-bottom: 5px;
  }
  padding: 20px 15px;
  .flex-col-content {
    padding: 0;
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
}
</style>
