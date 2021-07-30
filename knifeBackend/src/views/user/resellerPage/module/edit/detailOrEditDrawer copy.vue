<template>
  <div class="detailOrEditComponent">
    <BaseDialog
      custom-class="detailOrEditComponent-common-class"
      width="800px"
      :dialogVisible.sync="visible"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <div class="drawerBody">
        <div class="item">
          <div class="bodyTitle">
            <span>物流信息</span>
          </div>
          <BaseForm
            ref="form"
            label-position="left"
            label-suffix=" "
            size="mini"
            customClass="customClass"
            :disabled="isDetail"
            :gutter="10"
            :topPosition="true"
            :cols="fedexField"
            :form="form"
          >
            <template #expressCompanyIdSlot="{ scoped: { prop, placeholder } }">
              <el-select
                size="mini"
                style="width: 100%"
                v-model="form[prop]"
                :placeholder="placeholder"
              >
                <el-option
                  :label="companyName"
                  :value="id"
                  v-for="{ id, companyName } of fedexData"
                  :key="id"
                ></el-option>
              </el-select>
            </template>
          </BaseForm>
        </div>

        <div class="item">
          <div class="bodyTitle">收货信息</div>
          <BaseForm
            ref="form"
            label-position="left"
            label-suffix=" "
            size="mini"
            customClass="customClass"
            :disabled="isDetail"
            :gutter="10"
            :topPosition="true"
            :cols="consigneeField"
            :form="form"
          >
            <template #expressCompanyIdSlot="{ scoped: { prop, placeholder } }">
              <el-select
                style="width: 110px"
                v-model="form[prop]"
                :placeholder="placeholder"
              >
                <el-option label="订单组名" value="groupName"></el-option>
                <el-option label="订单编号" value="orderCode"></el-option>
              </el-select>
            </template>
          </BaseForm>
        </div>

        <div class="item">
          <div class="bodyTitle">产品信息</div>
          <template v-if="!isProTable">
            <BaseForm
              v-for="(proFrom, index) in proData"
              ref="proForm"
              label-position="left"
              label-suffix=" "
              size="mini"
              customClass="customClass"
              :disabled="isDetail"
              :key="index"
              :gutter="10"
              :topPosition="true"
              :cols="productField"
              :form="proFrom"
            >
              <template #doneSlot>
                <i
                  @click="shakingDel(index)"
                  class="el-icon-delete"
                  v-if="showDel"
                ></i>
              </template>
            </BaseForm>
            <color-text-btn
              v-if="!isDetail"
              icon="el-icon-plus"
              type="primary"
              @click="addProduct"
            >
              新增产品
            </color-text-btn>

            <color-text-btn v-else icon="el-icon-plus" type="info">
              新增产品
            </color-text-btn>
          </template>
          <template v-else>
            <CommonTable
              class="common-table"
              height="auto"
              :selection="false"
              :cols="cols"
              :infoData="proData"
            >
            </CommonTable>
          </template>
        </div>
      </div>
      <div v-if="hasMenuBtn" class="bottom">
        <el-button size="mini" @click="close"> 取消 </el-button>
        <el-button type="primary" size="mini" @click="onsubmit">保存</el-button>
      </div>
    </BaseDialog>
  </div>
</template>

<script>
import colorTextBtn from "@/components/base/colorTextBtn.vue";
import cloneDeep from "lodash/cloneDeep";
import { parseTime } from "@/utils";
import { fedexField, consigneeField, productField } from "./field";
import { proCols as cols } from "./cols";
import {
  orderUpdate,
  orderItemUpdate as edit,
  orderItemCreate as add,
  orderItemDel as del,
} from "@/api/order";

const PRO_ITEM = {
  productInternalSkuCode: null,
  productCount: 1,
};
const IS_DETAIL = 0;
const IS_EDIT = 1;
export default {
  components: { colorTextBtn },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
    },
    type: {
      type: [String, Number],
      default: IS_DETAIL,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    oProData: {
      type: Array,
      default: () => [],
    },
    isProTable: {
      type: Boolean,
      default: true,
    },
    fedexData: {
      type: Array,
      default: () => [],
    },
    productData: {
      type: Array,
      required: true,
    },
    menuBtn: {
      type: Boolean,
      default: true,
    },
    sup_this: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      cols,
      fedexField,
      consigneeField,
      productField,
      visible: false,
      becomeEdit: false,
      form: {},
    };
  },
  watch: {
    visible(newVal) {
      this.$emit("update:dialogVisible", newVal);
      if (newVal) {
        this.form = Object.assign({}, { product: [] }, cloneDeep(this.data));
      } else {
        this.reset();
      }
    },

    dialogVisible(newVal) {
      this.visible = newVal;
    },
  },
  computed: {
    proData() {
      try {
        return this.form.productData || [];
      } catch (err) {
        return [];
      }
    },
    isDetail() {
      return this.type == IS_DETAIL && !this.becomeEdit;
    },
    hasMenuBtn() {
      if (this.becomeEdit) return this.becomeEdit;
      return this.menuBtn;
    },
    showDel() {
      return this.proData.length > 1 && !this.isDetail;
    },
  },
  created() {
    console.log(this.data);
  },
  methods: {
    parseTime,
    reset() {
      this.becomeEdit = false;
      this.form = {};
    },
    toEdit() {
      this.becomeEdit = true;
    },
    close() {
      this.visible = false;
    },
    shakingDel(index) {
      this.form.productData.splice(index, 1);
    },
    async onsubmit() {
      const proData = this.proData;
      const res = await Promise.all([
        orderUpdate(this.form),
        ...this.doAdd(proData),
        ...this.doEdit(proData),
        ...this.doDel(proData),
      ]);
      const successBool = res.every(({ code }) => $SUC({ code }));
      if (successBool) {
        if (this.sup_this.init) {
          this.sup_this.init();
        } else {
          this.$emit("submit");
        }

        this.$message.success("操作成功");
        this.close();
      }
      console.log(res);
    },
    doDel(data) {
      console.log("this.oProData", this.oProData);
      console.log("data", data);
      const delArr = this.oProData.filter(({ id }) => {
        return data.every((item) => item.id != id);
      });
      return delArr.map(({ id }) =>
        del({
          idList: [id],
        })
      );
    },

    doAdd(data) {
      const addArr = data.filter(({ id }) => {
        return !id;
      });
      return addArr.map((form) => {
        return add({
          orderId: this.data.id,
          ...form,
        });
      });
    },

    doEdit(data) {
      const editArr = data.filter(({ id }) => {
        return !!id;
      });
      return editArr.map(({ id, productInternalSkuCode, productCount }) =>
        edit({
          id,
          productInternalSkuCode,
          productCount,
        })
      );
    },

    addProduct() {
      this.form.productData.push({
        ...PRO_ITEM,
      });
    },

    to() {
      const time = this.time;
      if (time && time.length) {
        const timeProp = this.timeProp;
        this.query[`${timeProp}_before`] = parseCharacterTime(
          new Date(`${this.time[0]} 00:00:00`).toUTCString().replace(" GMT", "")
        );
        this.query[`${timeProp}_after`] = parseCharacterTime(
          new Date(`${this.time[1]} 23:59:59`).toUTCString().replace(" GMT", "")
        );
      } else {
        delete this.query.startTime;
        delete this.query.endTime;
      }
      this.toQuery();
    },
  },
};
</script>

<style lang="scss">
.detailOrEditComponent-common-class {
  background-color: $bg-color;
  .el-drawer__body {
    display: flex;
    flex-direction: column;
    height: 100%;
    .customClass {
      padding: 0 15px;
      .el-form {
        padding: 0;
      }
    }
  }
  .drawerTitle {
    width: 100%;
    height: 95px;
    background-color: #3841db;
    color: #fff;
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
  .el-icon-delete {
    position: relative;
    top: 33px;
    font-size: 20px;
    color: $color-primary;
  }
  .el-form-item__label {
    height: 30px;
  }
  .drawerBody {
    flex: 1;
    width: calc(100% - 20px);
    padding: 20px;
    margin: 10px;
    background-color: #fff;
    overflow: auto;
  }
  .item:not(:last-child) {
    margin-bottom: 20px;
  }
  .bodyTitle {
    border-left: 2px solid blue;
    padding: 0 0 0 10px;
    margin-bottom: 10px;
    .edit {
      position: absolute;
      right: 25px;
      margin-top: -10px;
    }
  }
  .common-table {
    border-left: 1px solid $border-color;
  }

  .bottom {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 60px;
    background: #fff;
    box-shadow: 0 0 10px 1px #999;
    top: 10px;
    .el-button.el-button {
      margin-left: 15px;
    }
  }
}
</style>
