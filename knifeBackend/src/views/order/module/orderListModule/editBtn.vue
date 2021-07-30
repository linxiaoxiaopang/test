<template>
  <div class="editBtn">
    <el-button type="text" @click="showEditDialogVisible">编辑</el-button>
    <el-dialog
      title="编辑订单"
      :visible.sync="editDialogVisible"
      width="50%"
      top="5vh"
    >
      <el-form
        size="mini"
        :model="formData"
        label-width="120px"
        :rules="rules"
        inline
      >
        <p class="formTitle">物流信息</p>
        <el-form-item label="物流方式" prop="channel">
          <el-select v-model="formData.expressCompanyId" style="width: 200px">
            <el-option label="云途" value="0"></el-option>
            <el-option label="联邦" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运单号" prop="expressWaybillCode">
          <el-input
            v-model="formData.expressWaybillCode"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <p class="formTitle">收货信息</p>
        <template v-for="({ label, prop }, index) in shouhuoPart">
          <el-form-item
            v-if="index % 2 == 0"
            :label="label"
            :prop="prop"
            :key="index"
          >
            <el-input v-model="formData[prop]" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item v-else :label="label" :prop="prop" :key="index">
            <el-input v-model="formData[prop]" style="width: 200px"></el-input>
            <br />
          </el-form-item>
        </template>
        <p class="formTitle">产品信息</p>
        <el-form-item label="SKU">
          <el-input style="width: 200px" v-model="formData.productInternalSkuCode"></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input style="width: 200px" v-model="formData.productCount"></el-input>
        </el-form-item>
        <br />
        <el-form-item label=" ">
          <el-button class="el-icon-plus" @click="addSku"> 添加</el-button>
        </el-form-item>
        <br />
        <el-form-item label=" ">
          <el-table :data="productList" border>
            <el-table-column label="外部SKU" width="180"
              >
              <template slot-scope="scope">
                <el-input v-model="scope.row.productExternalSkuCode"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="内部SKU" width="180"
              >
              <template slot-scope="scope">
                <el-input v-model="scope.row.productInternalSkuCode"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="数量" width="100"
              >
              <template slot-scope="scope">
                <el-input v-model="scope.row.productCount"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <el-button type="text" style="color: red">删除</el-button>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { productData } from "@/api/order/orderListData";
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      editDialogVisible: false,
      formData: this.data ,
      rules: {
        channel: [
          { required: true, message: "请选择物流方式", trigger: "blur" },
        ],
        Waybill: [{ required: true, message: "请输入运单号", trigger: "blur" }],
        shoujian: [
          { required: true, message: "请输入收货人", trigger: "blur" },
        ],
        erzima: [
          { required: true, message: "请输入国家", trigger: "blur" },
        ],
        sheng: [{ required: true, message: "请输入运省/州", trigger: "blur" }],
        mail: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        city: [{ required: true, message: "请输入城市", trigger: "blur" }],
        dianhua: [{ required: true, message: "请输入电话号", trigger: "blur" }],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        shouji: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        sku: [{ required: true, message: "请输入SKU", trigger: "blur" }],
        number: [{ required: true, message: "请输入数量", trigger: "blur" }],
      },
      shouhuoPart: [
        { label: "收货人", prop: "consigneeName" },
        { label: "国家", prop: "consigneeCountryCode" },
        { label: "省/州", prop: "consigneeProvince" },
        { label: "邮编", prop: "consigneePostcode" },
        { label: "城市", prop: "consigneeCity" },
        { label: "电话", prop: "consigneeContactPhone" },
        { label: "地址", prop: "consigneeDetailAddress" },
        { label: "手机", prop: "consigneeContactMobilePhone" },
      ],
      productList: [],
      addProductListData: {
        productExternalSkuCode: '',
        productInternalSkuCode: '',
        productCount: '',
      },
    };
  },
  methods: {
    async showEditDialogVisible() {
      console.log(this.data);
      const { detail: res } = await productData({
        orderId: 2 // this.data.id
      });
      // console.log(res);
      const {productInternalSkuCode,productCount} = res[res.length-1]
      console.log(productInternalSkuCode,productCount);
      console.log(res);
      this.formData.productCount = productCount
      this.formData.productInternalSkuCode = productInternalSkuCode
      this.editDialogVisible = true;
    },
    addSku(){
      this.productList.push(this.addProductListData)
    },
    editDialog() {
      this.editDialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.editBtn {
  display: inline-block;
  .formTitle {
    margin: 0;
    border-left: 2px solid blue;
    padding-left: 5px;
  }
}
</style>
