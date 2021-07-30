<template>
  <section class="app-container">
    <eHeader :query="query" :sup_this="sup_this"/>
    <UnMatchCate ref="unMatchCate" v-p="['prim_prod:fac_category:no_cate_struct']"/>
    <CommonTable
      :tableLoading="tableLoading"
      :cols="cols"
      :infoData="data"
      height="auto"
      @selection-change="handleSelectionChange"
    >
      <template #prim_structsSlot="{ scoped: row, scoped: { prop } }">
        <el-tag
          style="margin: 5px"
          size="small"
          type="primary"
          :key="id"
          v-for="{ structure, id } in row[prop]"
        >
          {{ structure }}
        </el-tag>
      </template>

      <slot>
        <el-table-column
          fixed="right"
          label="操作"
          width="200px"
          align="center"
        >
          <template slot-scope="{ row }">
            <Choose :data="row"
                    :sup_this="sup_this"
                    v-p="['prim_prod:fac_category:add_struct']"
            />
            <edit :data="row" :sup_this="sup_this" v-p="['prim_prod:fac_category:update']"/>
          </template>
        </el-table-column>
      </slot>
    </CommonTable>
    <PaginationBar
      ref="paginationBar"
      @refreshTableEventFun="refreshTableEventFun"
      :total="total"
    />
  </section>
</template>

<script>
import UnMatchCate from "./module/unMatchCate";
import eHeader from "./module/header";
import edit from "./module/edit";
import Choose from "./module/choose";
import { initDataMixin } from "@/mixins";
import { factoryCateCols as cols } from "./cols";

export default {
  mixins: [initDataMixin],
  components: {
    UnMatchCate,
    eHeader,
    edit,
    Choose,
  },
  data() {
    return {
      cols,
      sup_this: this,
      menus: [],
      url: "/api/prim_prod/fac_category/",
    };
  },
  methods: {
    initCallBack() {
      this.$refs.unMatchCate && this.$refs.unMatchCate.list();
    },
  },
};
</script>
