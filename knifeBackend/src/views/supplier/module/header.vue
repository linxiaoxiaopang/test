<template>
  <div class="head-container">
    <div class="inline-block user-component-header">
      <slot name="create" />
      <el-input
        v-if="search_supplier"
        v-model="query.name"
        clearable
        placeholder="输入供应商搜索"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="toQuery"
      />
      <el-input
        v-if="search_account"
        v-model="query.username"
        clearable
        placeholder="输入供应商账号搜索"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="toQuery"
      />
    </div>

    <eForm ref="form" v-bind="$attrs" :is-add="true" />
  </div>
</template>

<script>
import eForm from './form'
// 查询条件
export default {
  components: { eForm },
  props: {
    sup_this: {
      type: Object,
      required: true
    },
    query: {
      type: Object,
      required: true
    },
    search_supplier: {
      type: Boolean,
      default: false
    },
    search_account: {
      type: Boolean,
      default: false
    }
  },
  beforeCreate() {
    this.$store.dispatch('GetDic', 'supplier')
  },
  methods: {
    // 去查询
    toQuery() {
      this.$parent.page = 1
      this.$parent.init()
    }
  }
}
</script>
<style lang="scss" scoped>
.user-component-header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
}
</style>
