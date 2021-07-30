<template>
  <div class="infinite-component-list-wrapper">
    <el-row
      class="list"
      :gutter="5"
      v-infinite-scroll="load"
      infinite-scroll-disabled="disabled"
      :infinite-scroll-distance="20"
    >
      <el-col :span="8" :key="index" v-for="(item, index) in data">
        <slot :data="item"></slot>
      </el-col>
      <el-col :span="24">
        <p v-if="noMore && data.length">没有更多了</p>
        <p v-if="loading">加载中...</p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  watch: {
    data() {
      this.loading = false
    }
  },
  computed: {
    noMore() {
      const bool = this.data.length >= this.total
      if (bool) {
        this.loading = false
      }
      return bool
    },
    disabled() {
      return this.loading || this.noMore
    }
  },
  methods: {
    load() {
      this.loading = true
      this.$emit('load')
    }
  }
}
</script>

<style lang="scss" scoped>
.infinite-component-list-wrapper {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  .el-col {
    margin-bottom: 10px;
  }
  p {
    text-align: center;
    font-size: 14px;
    color: $color-gray;
    position: relative;
  }
}
</style>
