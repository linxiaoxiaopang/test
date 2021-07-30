<template>
  <div class="head-container">
    <ProtoTypeTreeSelect
      style="width: 200px"
      class="filter-item"
      size="mini"
      placeholder="请选择分类"
      :selectedValue.sync="query.category"
      :maxHeight="150"
    />
    <SelectList
      class="filter-item"
      clearable
      :keyword.sync="query.show_group"
      :options="options"
    />
    <el-button
      class="filter-item"
      size="mini"
      type="primary"
      icon="el-icon-search"
      @click="toQuery"
      >搜索</el-button
    >
  </div>
</template>

<script>
import ProtoTypeTreeSelect from "@/components/protoTypeTreeSelect";

import { commonEheaderMixin } from "@/mixins";

export default {
  mixins: [commonEheaderMixin],

  components: {
    ProtoTypeTreeSelect,
  },

  data() {
    return {
      options: [
        {
          id: "0",
          name: "缺少坐标图",
        },
        {
          id: "1",
          name: "存在坐标图",
        },
      ],
    };
  },
};
</script>

