<template>
  <div class="head-container" style="text-align: center">
    <!-- 搜索 -->
    <el-input
      v-model="query.waybill"
      placeholder="请输入运单号，使用换行符隔开多个运单号。"
      clearable
      type="textarea"
      style="width: 400px"
      class="filter-item"
      ref="input"
      :rows="8"
    />
    <el-button
      class="filter-item"
      style="height: 180px;font-size: 20px;"
      type="primary"
      icon="el-icon-truck"
      @click="toQuery"
      >查询</el-button
    >
  </div>
</template>

<script>
export default {
  props: {
    query: {
      type: Object,
      required: true,
    },
    sup_this: {
      type: Object,
      default: null,
    },
  },
  mounted() {
    this.$refs.input && this.$refs.input.focus();
  },
  methods: {
    async toQuery() {
      if (this.query.waybill == undefined) {
        return this.$message.warning("运单号不能为空");
      }
      await this.sup_this.init();
      this.$nextTick(() => {
        this.query.waybill = "";
      });
    },
  },
};
</script>

