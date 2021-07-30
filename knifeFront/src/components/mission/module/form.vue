<template>
  <BaseDialog
    maxHeight="60vh"
    :dialogVisible.sync="dialog"
    width="1200px"
    title="任务列表"
  >
    <template>
      <CommonTable
        height="auto"
        :selection="false"
        :cols="cols"
        :infoData="data"
      >
        <template #statusSlot="{ scoped: row }">
          <el-tag size="small" :type="UP_STATUS[row[row.prop]].type">
            <i class="el-icon-loading" v-if="row[row.prop] < 3" />
            {{ UP_STATUS[row[row.prop]].label }}
          </el-tag>
        </template>
        <template #thumbnail_pathSlot="{ scoped: row }">
          <div style="text-align: center">
            <el-image
              style="witdh: 50px; height: 50px"
              fit="contain"
              :src="row[row.prop] | formatUrl"
            ></el-image>
          </div>
          <el-button style="white-space: normal" type="text" size="mini">
            {{ row.name }}
          </el-button>
        </template>

        <template #pathSlot="{ scoped: row }">
          <el-image
            v-for="(item, index) in row[row.prop]"
            :key="index"
            style="witdh: 50px; height: 50px"
            fit="contain"
            :src="item.url"
          ></el-image>
        </template>

        <template #struct_nameSlot="{ scoped: row }">
          {{ row[row.prop] || "默认" }}
        </template>

        <template #totalSlot="{ scoped: row }">
          <el-tag type="primary">
            {{ size(row) }}
          </el-tag>
        </template>
        <template #progressSlot="{ scoped: row }">
          <el-progress
            :key="row.id"
            :color="customColors"
            :text-inside="true"
            :stroke-width="15"
            :percentage="percentage(row)"
          ></el-progress>
        </template>
      </CommonTable>
    </template>
    <template #footer>
      <span></span>
    </template>
  </BaseDialog>
</template>
<script>
import { tasksCols as cols } from "./cols";
import { UP_STATUS } from "@/utils/constant";
export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
    sup_this: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      cols,
      UP_STATUS,
      dialog: false,
      customColors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#5cb87a", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#6f7ad3", percentage: 100 },
      ],
    };
  },
  computed: {
    size() {
      return (row) => {
        const { total } = row || {};
        const M = 1 * 1024 * 1024;
        const k = 1 * 1024;
        if (total > M) {
          return Math.round(row.total / M) + "M";
        }
        return Math.round(row.total / k) + "K";
      };
    },
    percentage() {
      return (row) => {
        return (
          row.total &&
          row.loaded &&
          Number(((row.loaded / row.total) * 100).toFixed(2))
        );
      };
    },
    downSuccess(row) {
      return (row) => {
        if (!row.total) return false;
        return row.total == row.loaded;
      };
    },
  },
  filters: {
    formatUrl(blob) {
      return URL.createObjectURL(blob);
    },
  },
  methods: {
    cancelDown(row, index) {
      const { cancel } = row;
      typeof cancel === "function" &&
        cancel({
          cancelMessage: "取消下载",
        });
      this.$emit("cancelDown", index);
    },
  },
};
</script>