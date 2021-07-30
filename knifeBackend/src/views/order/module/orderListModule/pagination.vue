<template>
  <div class="paginationPart">
    <el-row>
      <el-col :span="16">
        <sendFactory></sendFactory>
      </el-col>
      <el-col :span="8">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
          :current-page="page.pageIndex"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import sendFactory from "./sendFactory";
export default {
  props: {
    page: {
      type: Object,
      required:true
    },
  },
  data() {
    return {
      
    };
  },
  components: {
    sendFactory,
  },
  methods: {
    handleSizeChange() {},
    handleCurrentChange() {},
  },
};
</script>

<style lang="scss" scoped>
.paginationPart {
  margin-top: 20px;
}
</style>
