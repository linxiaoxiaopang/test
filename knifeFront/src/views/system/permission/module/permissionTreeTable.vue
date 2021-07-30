<template>
  <div class="menuTreeTableComponent">
    <BatchOperation class="batch-operation-wrapper" style="margin-bottom: 0">
      <div class="g-left-operation">
        <i class="el-icon-s-unfold"></i>
        <!-- <span>列表展示</span> -->
        <span>{{ operationTitle }}</span>
      </div>
      <div class="g-right-operation">
        <slot name="rightOperationBtn" />
      </div>
    </BatchOperation>
    <CommonTreeTable
      :data="data"
      :tableLoading="tableLoading"
      :expand-all="true"
      :columns="commonPermissionCols"
      height="auto"
      border
      size="small"
    >
      <template #aliasSlot="{ scoped: row }">
        <el-input
          v-if="canInput"
          @input="inputHandler($event, row.$index, row.prop)"
          :value="row[row.prop]"
          style="max-width: 350px"
        ></el-input>
        <span v-else
          >{{ row.method ? row[row.prop] : `${row[row.prop]}（组）` }}
        </span>
      </template>

      <template #nameSlot="scoped">
        <el-input
          v-if="canInput"
          @input="
            inputHandler($event, scoped.scoped.$index, scoped.scoped.prop)
          "
          :value="scoped.scoped[scoped.scoped.prop]"
          style="max-width: 350px"
        ></el-input>
        <span v-else>{{ scoped.scoped[scoped.scoped.prop] }} </span>
      </template>

      <slot> </slot>
    </CommonTreeTable>
  </div>
</template>

<script>
import CommonTreeTable from "@/components/commonTreeTable";
import { commonPermissionCols } from "../cols";
 // 权限判断函数

export default {
  components: {
    CommonTreeTable,
  },
  props: {
    tableLoading: Boolean,
    canInput: {
      type: Boolean,
      default: false,
    },
    operationTitle: String,
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      commonPermissionCols,
    };
  },
  methods: {
    
    inputHandler(val, index, prop) {
      this.$emit("inputHandler", {
        index,
        val,
        prop,
      });
    },
  },
};
</script>

<style>
</style>