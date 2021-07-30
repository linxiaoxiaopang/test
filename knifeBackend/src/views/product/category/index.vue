<template>
  <!-- 图片类型 -->
  <section class="app-container app-flex-col-container protoCategoryPage">
    <EHeader :query="query" :sup_this="sup_this" v-p="['prim_prod:product_category:create']"/>
    <div class="flex-col-content">
      <el-table
        class="flex-col-content"
        :data="data"
        style="width: 100%; border: none"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="name" label="分类"> </el-table-column>
        <el-table-column align="center" label="操作" width="280">
          <template slot-scope="{ row, $index }">
            <template v-if="$index !== 0">
              <AddChildCate :sup_this="sup_this" :data="row" v-p="['prim_prod:product_category:create']"></AddChildCate>
              <EditCate :sup_this="sup_this" :data="row" v-p="['prim_prod:product_category:partial_update']"/>
              <DelCate :sup_this="sup_this" :data="row" v-p="['prim_prod:product_category:delete']"/>
            </template>
            <ColorTextBtn type="warning" v-else>
              系统预设分类，不可编辑和删除
            </ColorTextBtn>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>

<script>
import EHeader from "./module/header";
import { initDataMixin } from "@/mixins";
import AddChildCate from "./module/addChildCate";
import EditCate from "./module/editCate";
import DelCate from "./module/delCate";

export default {
  mixins: [initDataMixin],
  components: {
    EHeader,
    AddChildCate,
    EditCate,
    DelCate,
  },
  data() {
    return {
      url: "/api/prim_prod/product_category/",
      sup_this: this,
    };
  },
};
</script>
<style lang="scss" lang="scss">
.protoCategoryPage {
  .el-table::before,
  .el-table--border::after {
    background: transparent !important;
  }
}
</style>