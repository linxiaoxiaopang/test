<template>
  <div class="head-container">
    <!-- 搜索 -->
    <el-input v-model="query.value" clearable placeholder="输入关键字搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
    <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
    <!-- 新增 -->
    <div style="display: inline-block;margin: 0px 2px;">
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="$refs.form.dialog = true;">新增</el-button>
      <eForm ref="form"  :is-add="true" v-bind="$attrs" />
    </div>

  </div>
</template>

<script>
import { getOrganizationUserTree } from '@/api/organization'
import eForm from './form'
// 查询条件
export default {
  components: { eForm },
  props: {
    query: {
      type: Object,
      required: true
    }
  },
  methods: {
    
    // 去查询
    toQuery() {
      this.$parent.page = 1
      this.$parent.init()
    },
  }
}
</script>
