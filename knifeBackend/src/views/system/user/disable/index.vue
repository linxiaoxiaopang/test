<template>
  <div class="app-container">
    <eHeader  :sup_this="sup_this" :query="query" />

    <!--表格渲染-->
    <CommonTable
      :tableLoading="tableLoading"
      :cols="cols"
      :infoData="data"
      :selection="false"
      @selection-change="handleSelectionChange"
    >
      <template #typeSlot="{ scoped: row }">
        {{ row.type_name }}
      </template>

      <template #is_activeName="{ scoped: row }">
        <el-tag v-if="row[row.prop]" size="small" type="primary"> 是 </el-tag>
        <el-tag v-else size="small" type="danger"> 否 </el-tag>
      </template>
      <template #rolesSlot="{ scoped: row }">
        <el-tag
          style="margin: 5px"
          type="primray"
          size="mini"
          :key="id"
          v-for="{ id, name } in row[row.prop] || []"
        >
          {{ name }}
        </el-tag>
      </template>

      <slot>
        <el-table-column
          fixed="right"
          label="操作"
          width="100px"
          align="center"
        >
          <template slot-scope="scope">
            <color-text-btn type="danger"> 解禁 </color-text-btn>
          </template>
        </el-table-column>
      </slot>
    </CommonTable>
    <PaginationBar
      ref="paginationBar"
      @refreshTableEventFun="refreshTableEventFun"
      :total="total"
    />
  </div>
</template>

<script>
import initDataMixin from "@/mixins/initData";
import eHeader from "./module/header";
import cols from "./cols";

export default {
  mixins: [initDataMixin],
  components: { eHeader },
  data() {
    return {
      cols,
      delLoading: false,
      url: "/api/rbac/common_users/",
      sup_this: this,
    };
  },
};
</script>

<style scoped>
</style>
