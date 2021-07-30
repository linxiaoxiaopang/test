<template>
  <div class="app-container">
    <avue-crud ref="crud"
               class="in-production in-production-export"
               :data="tableData"
               :option="tableOption"
               :tableLoading="tableLoading"
               @search-change="searchChange"
               @hook:updated="initCallBack"
    >
      <template #menu="{ row, index }">
        <print :data="row" :printId="`print_${index}`" :fedexData="expressCompanyId">打印彩图</print>
        <el-divider direction="vertical"></el-divider>
        <color-text-btn>
          <a class="thunder-link" :href="`${FILE_UPLOAD_PREFIX}${row.expressWaybillFilePath}`">
            附件下载
          </a>
        </color-text-btn>
      </template>
    </avue-crud>

    <el-radio-group v-model="tabPosition" class="mtb30" size="mini">
      <el-radio-button label="hide">隐藏刀版图</el-radio-button>
      <el-radio-button label="show">显示刀版图</el-radio-button>
    </el-radio-group>

    <el-row v-show="tabPosition==='show'" :gutter="2" class="knife-layout">
      <el-col :span="1.5">
        <el-card shadow="never" class="card-show-img">
          <div slot="header" class="clearfix text-center">
            <span>DEA0006Z86</span>
            <span class="mlr10 text-danger">X</span>
            <span>1</span>
          </div>
          <img src="@/assets/images/default.png" width="100%" height="300" alt="">
        </el-card>
      </el-col>
      <el-col :span="1.5">
        <el-card shadow="never" class="card-show-img">
          <div slot="header" class="clearfix text-center">
            <span>卡片名称</span>
          </div>
          <img src="@/assets/images/default.png" width="100%" height="300" alt="">
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { tableOption, tableData } from "./tablePartData";
  import {FILE_UPLOAD_PREFIX, IN_PRODUCTION} from "@/utils/constant";
  import print from '../module/print'
  import { orderList as getList } from "@/api/order/order";
  import { avueCrudMixin } from "@/mixins";
  import {validatenull} from "@/components/avue/utils/validate";
  import {initCallBack} from "@/utils/download";
  import {mapGetters} from 'vuex'
  export default {
    components: {
      print,
    },
    mixins: [
      avueCrudMixin({
        getList,
        tableOption,
        page: false,
        isInit: false,
      })
    ],
    data() {
      return {
        FILE_UPLOAD_PREFIX,
        tabPosition: 'show',
        resetMergeData: {
          // orderStatus: IN_PRODUCTION, // 订单状态 - 生产中
        },
      }
    },
    computed: {
      ...mapGetters(['expressCompanyId'])
    },
    methods: {
      initCallBack,
      searchChange() {
        if (validatenull(this.searchForm.expressWaybillCode)) {
          this.$message.error('请输入运单号');
          this.tableData = [];
          return
        }
        this.init();
      },
    },
  };
</script>

<style lang="scss"></style>
