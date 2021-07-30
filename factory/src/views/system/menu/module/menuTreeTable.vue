<template>
  <div class="menuTreeTableComponent">
    <div  class="header-content">
      <div class="g-left-operation">
        <i class="el-icon-s-unfold"></i>
        <!-- <span>列表展示</span> -->
        <span>{{ operationTitle }}</span>
      </div>
      <div class="g-right-operation">
          <slot name="rightOperationBtn" />
      </div>
    </div>
    <CommonTreeTable
     :tableLoading="tableLoading"
      :data="data"
      :expand-all="true"
      :columns="cmmonMenuCols"
      height="auto"
      border
      size="small"
    >
      <template #iconSlot="{ scoped: row }">
        <svg-icon :icon-class="row[row.prop]" />
      </template>

      <template #sortSlot="{ scoped: row }">
        <el-tag>{{ row[row.prop] }}</el-tag>
      </template>

      <template #is_frameSlot="{ scoped: row }">
        <span v-if="!row.is_frame">是</span>
        <span v-else>否</span>
      </template>

      <template #is_showSlot="{ scoped: row }">
        <span v-if="row.is_show">是</span>
        <span v-else>否</span>
      </template>
      <slot> </slot>
    </CommonTreeTable>
  </div>
</template>

<script>
import CommonTreeTable from "@/components/commonTreeTable";
import { cmmonMenuCols } from "../cols";

export default {
  components: {
    CommonTreeTable,
  },
  props: {
    tableLoading: Boolean,
    operationTitle: String,
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      cmmonMenuCols,
    };
  },
 
};
</script>

<style lang="scss">
.menuTreeTableComponent {
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    background: #fff;
  }
}
</style>