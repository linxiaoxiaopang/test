<template>
  <div class="table">
    <div class="firstPart">
      <span
        ><b>上传订单:</b> <i>{{ statusInfo.uploadedCount }}</i></span
      >
      <span
        ><b>产品解析成功:</b> <i>{{ statusInfo.succesCount }}</i></span
      >
      <!--<span
        ><b>产品解析失败:</b> <i>{{ statusInfo.failCount }}</i></span
      >-->
      <span
        ><b>不可导入订单:</b> <i>{{ statusInfo.failUploadedCount }}</i></span
      >
      <!--<el-form :data="search" inline size="mini">
        <el-form-item label="订单组名">
          <el-input
            v-model="search.groupCode"
            placeholder="请输入订单组名"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="search.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>-->
    </div>
    <div class="secondPart">
      <div class="tableHead">
        <span>订单号</span>
        <span>运单号</span>
      </div>
      <div class="tableBody">
        <template v-for="({ 订单号, 运单号 }, index) in data">
          <div :key="index" class="news">
            <span>{{ 订单号 }}</span>
            <span>{{ 运单号 }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
    statusInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      search: { orderGroupName: "", remark: "" },
    };
  },
};
</script>

<style scoped lang="scss">
.firstPart {
  /*height: 100px;*/
  min-width: 460px;
  span {
    display: inline-block;
    width: 25%;
    line-height: 50px;
    i {
      color: orange;
    }
  }
}
.secondPart {
  border: 1px solid rgba($color: #000000, $alpha: 0.2);
  .tableHead {
    text-align: center;
    background-color: #f7f8fa;
    height: 30px;
    span {
      display: inline-block;
      line-height: 30px;
      width: 50%;
    }
  }
  .tableBody {
    text-align: center;
    max-height: 200px;
    overflow: auto;
    .news {
      span {
        display: inline-block;
        width: 50%;
        height: 30px;
        padding-left: 10px;
        line-height: 30px;
      }
    }
  }
}
</style>
