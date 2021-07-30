<template>
  <div class="detailOrEditComponent">
    <el-drawer
      custom-class="detailOrEditComponent-common-class"
      size="800px"
      :visible.sync="visible"
      :withHeader="false"
      :append-to-body="true"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <div class="drawerTitle">
        <p class="orderid">订单编号 : {{ form.orderCode }}</p>
        <p class="importTime">
          导入时间 : {{ parseTime(form.importTime) || '' }}
        </p>
        <i class="el-icon-close" @click="close"></i>
      </div>
      <div class="drawerBody" v-loading="loading">
        <div class="item">
          <div class="bodyTitle">
            <span>物流信息</span>
            <!--<color-text-btn
              v-if="isDetail"
              class="edit"
              type="primary"
              icon="el-icon-edit-outline"
              @click="toEdit"
            >
              编辑信息
            </color-text-btn>-->
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

        <div class="item" v-loading="loading">
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
                <Relation
                  class="relation-btn"
                  :data="proFrom"
                  :orderData="form"
                  :sup_this="dThis"
                  :allData="proData"
                  @updateProductExternalSkuCode="
                    updateProductExternalSkuCode(proFrom, $event)
                  "
                  v-if="showRelation(proFrom)"
                />
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
              <template v-slot:productShowCoverSlot="{ scoped }">
                <div class="img-wrapper">
                  <el-image :src="scoped.productShowCover" />
                  <span>
                    {{ scoped.productCnName || '暂无' }}
                  </span>
                </div>
              </template>
            </CommonTable>
          </template>
        </div>
      </div>
      <div v-if="hasMenuBtn" class="bottom" v-loading="loading">
        <el-button size="mini" @click="close"> 取消 </el-button>
        <el-button type="primary" size="mini" @click="onsubmit">保存</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import colorTextBtn from '@/components/base/colorTextBtn.vue'
import cloneDeep from 'lodash/cloneDeep'
import { parseTime } from '@/utils'
import {
  fedexField,
  noNeedFedexField,
  consigneeField,
  productField
} from './field'
import { proCols as cols } from './cols'
import Relation from '../../module/orderBasePage/module/relation'
import { WAIT_DISPATCH, WAIT_GENERATE_WAYBILL } from '@/utils/constant'
import {
  orderUpdate,
  orderItemUpdate as edit,
  complexCreate as add,
  orderItemDel as del
} from '@/api/order'
import { allUserSkus as list } from '@/api/product/knifeApi'
const PRO_ITEM = {
  productExternalSkuCode: null,
  productCount: 1
}
const IS_DETAIL = 0
const IS_EDIT = 1
export default {
  components: { colorTextBtn, Relation },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    },
    type: {
      type: [String, Number],
      default: IS_DETAIL
    },
    data: {
      type: Object,
      default: () => ({})
    },
    oProData: {
      type: Array,
      default: () => []
    },
    isProTable: {
      type: Boolean,
      default: true
    },
    fedexData: {
      type: Array,
      default: () => []
    },
    productData: {
      type: Array,
      required: true
    },
    menuBtn: {
      type: Boolean,
      default: true
    },
    sup_this: {
      type: Object,
      default() {
        return {}
      }
    },
    isNeedOrderCode: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      cols,
      consigneeField,
      productField,
      visible: false,
      becomeEdit: false,
      loading: false,
      allUsers: [],
      dThis: this,
      form: {}
    }
  },
  watch: {
    visible(newVal) {
      this.$emit('update:dialogVisible', newVal)
      if (newVal) {
        this.form = Object.assign({}, { product: [] }, cloneDeep(this.data))
        this.init()
      } else {
        this.reset()
      }
    },

    dialogVisible(newVal) {
      this.visible = newVal
    }
  },
  computed: {
    fedexField() {
      if (this.isNeedOrderCode) {
        return fedexField
      } else {
        return noNeedFedexField
      }
    },
    proData() {
      try {
        return this.form.productData || []
      } catch (err) {
        return []
      }
    },
    isDetail() {
      return this.type == IS_DETAIL && !this.becomeEdit
    },
    hasMenuBtn() {
      if (this.becomeEdit) return this.becomeEdit
      return this.menuBtn
    },
    showDel() {
      return this.proData.length > 1 && !this.isDetail
    },
    showRelation() {
      return (row) => {
        const { productExternalSkuCode } = row
        const userSkus = this.allUsers.filter(({ user_sku }) => {
          return productExternalSkuCode === user_sku
        })
        console.log('userSkus', userSkus)
        return !userSkus.length
      }
    }
  },
  methods: {
    parseTime,
    updateProductExternalSkuCode(form, productInternalSkuCode) {
      console.log('form, productInternalSkuCode', form, productInternalSkuCode)
      this.$set(form, 'productInternalSkuCode', productInternalSkuCode)
      this.init()
    },
    async init() {
      const { code, detail } = await list()
      if ($SUC({ code })) {
        this.allUsers = detail
      }
    },
    reset() {
      this.becomeEdit = false
      this.form = {}
    },
    toEdit() {
      this.becomeEdit = true
    },
    close() {
      this.visible = false
    },
    shakingDel(index) {
      this.form.productData.splice(index, 1)
    },
    async onsubmit() {
      this.loading = true
      const valid = await this.validate()
      const orderValid = await this.orderValidate()
      console.log('orderValid', orderValid)
      if (!valid || !orderValid) {
        this.loading = false
        return
      }
      try {
        const proData = this.proData
        const res = await Promise.all([
          orderUpdate(this.form),
          ...this.doAdd(proData),
          ...this.doEdit(proData),
          ...this.doDel(proData)
        ])
        const successBool = res.every(({ code }) => $SUC({ code }))
        const isChangeOrder = this.proData.every((item) => {
          return this.inSkuExist(item)
        })
        const { expressWaybillCode } = this.form
        if (successBool) {
          if (isChangeOrder) {
            const { code: orderCode } = await orderUpdate({
              id: this.form.id,
              orderStatus: expressWaybillCode
                ? WAIT_DISPATCH
                : WAIT_GENERATE_WAYBILL
            })
            if ($SUC({ code: orderCode })) {
              this.sup_this && this.sup_this.init()
              this.dialog = false
              this.$message.success('操作成功')
              this.close()
            }
          } else {
            if (this.sup_this.init) {
              this.sup_this.init()
            } else {
              this.$emit('submit')
            }
            this.$message.success('操作成功')
            this.close()
          }
        }
      } catch (err) {
        console.log('err', err)
      }
      this.loading = false
    },
    inSkuExist(row) {
      const { productExternalSkuCode } = row
      const userSkus = this.allUsers.filter(({ user_sku }) => {
        return productExternalSkuCode === user_sku
      })
      return !!userSkus.length
    },
    doDel(data) {
      // console.log("this.oProData", this.oProData);
      // console.log("data", data);
      const delArr = this.oProData.filter(({ id }) => {
        return data.every((item) => item.id != id)
      })
      return delArr.map(({ id }) =>
        del({
          idList: [id]
        })
      )
    },

    doAdd(data) {
      const addArr = data.filter(({ id }) => {
        return !id
      })
      return addArr.map((form) => {
        return add({
          orderId: this.data.id,
          ...form
        })
      })
    },

    doEdit(data) {
      const editArr = data.filter(({ id }) => {
        return !!id
      })
      return editArr.map(({ id, productExternalSkuCode, productCount }) =>
        edit({
          id,
          productExternalSkuCode,
          productCount
        })
      )
    },

    addProduct() {
      this.form.productData.push({
        ...PRO_ITEM
      })
    },

    to() {
      const time = this.time
      if (time && time.length) {
        const timeProp = this.timeProp
        this.query[`${timeProp}_before`] = parseCharacterTime(
          new Date(`${this.time[0]} 00:00:00`).toUTCString().replace(' GMT', '')
        )
        this.query[`${timeProp}_after`] = parseCharacterTime(
          new Date(`${this.time[1]} 23:59:59`).toUTCString().replace(' GMT', '')
        )
      } else {
        delete this.query.startTime
        delete this.query.endTime
      }
      this.toQuery()
    },

    async orderValidate() {
      const { form } = this.$refs
      console.log('form', form)
      const forms = Array.isArray(form) ? form : [form]
      console.log('forms', forms)
      const successData = await Promise.all(
        forms.map(async (node) => {
          try {
            return await node.validate()
          } catch (err) {
            return false
          }
        })
      )

      return successData.every((bool) => bool)
    },
    async validate() {
      const { proForm } = this.$refs
      if (!proForm) return true
      const forms = Array.isArray(proForm) ? proForm : [proForm]
      const successData = await Promise.all(
        forms.map(async (node) => {
          try {
            return await node.validate()
          } catch (err) {
            return false
          }
        })
      )

      return successData.every((bool) => bool)
    }
  }
}
</script>

<style lang="scss">
.detailOrEditComponent-common-class {
  background-color: $bg-color;
  .relation-btn {
    position: absolute;
    left: 27px;
    margin-top: 28px;
  }
  .img-wrapper {
    display: flex;
    align-items: center;
    .el-image {
      width: 50px;
      height: 50px;
      margin-right: 10px;
      border-radius: 6px;
      background: $bg-color;
    }
  }
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
