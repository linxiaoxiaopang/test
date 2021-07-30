<template>
  <div class="details">
    <el-button type="text" @click="showDetailDrawerVisible">{{fontConcent}}</el-button>
    <el-drawer
      :title="title"
      :visible.sync="detailDrawerVisible"
      :direction="direction"
      :withHeader="false"
      size="800px"
      :append-to-body="true"
    >
      <div class="drawerTitle">
        <p class="orderid">订单编号 : {{ editData.orderId }}</p>
        <p class="importTime">导入时间 : {{ editData.importTime }}</p>
        <i class="el-icon-close" @click="colseDetailDrawer"></i>
      </div>
      <div class="drawerBody">
        <el-card>
          <el-form :model="editData" size="mini" inline label-width="70px">
            <div class="bodyTitle">物流信息</div>
            <el-form-item label="物流方式">
                <span class="wuliuxinxi">{{editData.chinnal}}</span>
            </el-form-item>
            <el-form-item label="运单号">
              <span class="wuliuxinxi">{{editData.yundan}}</span>
            </el-form-item>
            <div class="bodyTitle">收货信息</div>
            <el-form-item label="收货人">
              <span class="shouhuoxinxi">{{editData.shouhuo}}</span>
            </el-form-item>
            <el-form-item label="电话">
              <span class="shouhuoxinxi">{{editData.dianhua}}</span>
            </el-form-item>
            <el-form-item label="手机">
              <span class="shouhuoxinxi">{{editData.shouji}}</span>
            </el-form-item>
            <el-form-item label="国家">
              <span class="shouhuoxinxi">{{editData.guojia}}</span>
            </el-form-item>
            <el-form-item label="省/州">
              <span class="shouhuoxinxi">{{editData.sheng}}</span>
            </el-form-item>
            <el-form-item label="城市">
              <span class="shouhuoxinxi">{{editData.city}}</span>
            </el-form-item>
            <el-form-item label="地址">
              <span class="wuliuxinxi">{{editData.adress}}</span>
            </el-form-item>
            <el-form-item label="邮编">
              <span class="wuliuxinxi">{{editData.youbian}}</span>    
            </el-form-item>
            <div class="bodyTitle">产品信息</div>
            <template v-for="(item, index) in editData.xinxi">
              <div :key="index">
                <el-form-item label="SKU">
                  <span class="wuliuxinxi">{{editData.xinxi[index].sku}}</span>
                </el-form-item>
                <el-form-item label="数量">
                  <span class="wuliuxinxi">{{editData.xinxi[index].number}}</span>
                </el-form-item>
              </div>
            </template>
          </el-form>
        </el-card>
        <div class="foodBtn">
          <el-button type="primary" size="mini" @click="rightBtn">保存</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  props: {
    fontConcent: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      detailDrawerVisible: false,
      direction: "rtl",
      title: "详情",
      editData: {
        orderId: "DDZH1234545DDS",
        importTime: "2021-02-11 15:03:01",
        chinnal: "云途",
        yundan: "420748599274890",
        shouhuo: "121313213",
        dianhua: "1213212",
        shouji: "131541651",
        guojia: "美国[US]",
        sheng: "BROOKLYN",
        city: "NEW YORK",
        adress: "910 42TH STREET 1FL BROOKLYN NEW YORK N.11219",
        youbian: "54110000",
        xinxi: [
          {
            sku: "owgio25366ukw",
            number: "12",
          },
        ],
      },
    };
  },
  components: {},
  methods: {
    showDetailDrawerVisible() {
      this.detailDrawerVisible = true;
    },
    colseDetailDrawer() {
      this.detailDrawerVisible = false;
    },
    rightBtn() {
      this.detailDrawerVisible = false
    }
  },
};
</script>

<style scoped lang="scss">
.details {
  display: inline-block;
  // margin-left: 10px;
}
// .el-form {
//   height: 84vh;
//   .el-form-item {
//     span {
//       display: inline-block;
//       background-color: #F4F5F9;
//       font-size: 12px;
//     }
//     .wuliuxinxi {
//       width: 285px;
//       padding-left: 10px;
//     }
//     .shouhuoxinxi {
//       width: 163px;
//       padding-left: 10px;
//     }
//   }
// }
.drawerTitle {
  width: 100%;
  height: 95px;
  background-color: #3841db;
  color: white;
  padding: 20px;
  position: relative;
  .orderid {
    font-size: 18px;
    margin-bottom: 10px;
  }
  .importTime {
    font-size: 14px;
  }
  i {
    font-size: 24px;
    position: absolute;
    right: 15px;
    top: 35px;
    cursor: pointer;
  }
}
.drawerBody {
  background-color: #f6f7fb;
  width: 100%;
  padding: 10px;
}
.bodyTitle {
  border-left: 2px solid blue;
  padding: 0 0 0 10px;
  margin-bottom: 20px;
}
.foodBtn {
  height: 56px;
  width: 100%;
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #fff;
  box-shadow: 0px 0px 3px 3px  rgba($color: #000000, $alpha: 0.1);
  text-align: center;
  padding-top: 10px;
}

</style>
