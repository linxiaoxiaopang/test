<template>
  <div class="edit">
    <el-button type="text" @click="showEditDrawerVisible">快速编辑</el-button>
    <el-drawer
      :title="title"
      :visible.sync="editDrawerVisible"
      :direction="direction"
      :withHeader="false"
      :append-to-body="true"
      size="800px"
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
              <el-select v-model="editData.chinnal" style="width: 285px">
                <el-option
                  v-for="({ value, label }, index) in options"
                  :key="index"
                  :label="label"
                  :value="value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="运单号">
              <el-input
                v-model="editData.yundan"
                style="width: 285px"
              ></el-input>
            </el-form-item>
            <div class="bodyTitle">收货信息</div>
            <el-form-item label="收货人">
              <el-input v-model="editData.shouhuo"></el-input>
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="editData.dianhua"></el-input>
            </el-form-item>
            <el-form-item label="手机">
              <el-input v-model="editData.shouji"></el-input>
            </el-form-item>
            <el-form-item label="国家">
              <el-select v-model="editData.guojia" style="width: 163px">
                <el-option
                  v-for="({ value, label }, index) in guojiaOp"
                  :key="index"
                  :value="value"
                  :label="label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="省/州">
              <el-input v-model="editData.sheng"></el-input>
            </el-form-item>
            <el-form-item label="城市">
              <el-input v-model="editData.city"></el-input>
            </el-form-item>
            <el-form-item label="地址">
              <el-input v-model="editData.adress"></el-input>
            </el-form-item>
            <el-form-item label="邮编">
              <el-input v-model="editData.youbian"></el-input>
            </el-form-item>
            <div class="bodyTitle">产品信息</div>
            <template v-for="(item, index) in editData.xinxi">
              <div :key="index">
                <el-form-item label="SKU">
                  <el-input
                    v-model="editData.xinxi[index].sku"
                    style="width:250px"
                  ></el-input>
                </el-form-item>
                <el-form-item label="数量">
                  <el-input
                    v-model="editData.xinxi[index].number"
                    style="width:250px"
                  ></el-input>
                </el-form-item>
                <el-button type="text" 
                class="delete el-icon-delete" 
                size="mini" @click="deleteIpt(index)"
                v-if="index > 0"></el-button>
              </div>
            </template>
            <el-button
              type="text"
              class="el-icon-plus"
              size="mini"
              @click="addInput"
            >
              添加产品</el-button
            >
          </el-form>
        </el-card>
        <div class="foodBtn">
          <el-button size="mini" @click="editDrawerVisible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="editBtn">保存</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editDrawerVisible: false,
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
      addIpt: {
        sku: "",
        number: "",
      },
      options: [
        { value: "云途", label: "云途" },
        { value: "联邦", label: "联邦" },
      ],
      guojiaOp: [
        { value: "美国[US]", label: "美国[US]" },
        { value: "中国[CN]", label: "中国[CN]" },
      ],
    };
  },
  components: {},
  methods: {
    showEditDrawerVisible() {
      this.editDrawerVisible = true;
    },
    colseDetailDrawer() {
      this.editDrawerVisible = false;
    },
    addInput() {
      this.editData.xinxi.push({...this.addIpt});
    },
    deleteIpt(index) {
      this.editData.xinxi.splice(index, 1)
    },
    editBtn() {
      this.editDrawerVisible = false
    }
  },
};
</script>

<style scoped lang="scss">
.edit {
  display: inline-block;
}
.el-form {
  height: 84vh;
}
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
