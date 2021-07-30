<template>
  <div class="pagination">
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="6"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageSize: 5,
      currentPage: 1
    }
  },
  components: {},
  methods: {
    handleSizeChange(val) {
      console.log(val)
    },
    handleCurrentChange(val) {
      console.log(val)
    }
  }
}
</script>

<style scoped lang="scss">
.pagination {
  margin-top: 20px;
  padding: 0 35%;
}
</style>
