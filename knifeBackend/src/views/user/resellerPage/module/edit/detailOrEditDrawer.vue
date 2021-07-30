<template>
  <div class="detailOrEditComponent">
    <BaseDialog
      class="orderDetailComponent"
      :dialogVisible.sync="visible"
      height="60vh"
      width="700px"
      top="50px"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <div class="drawerBody" v-loading="loading">
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
            :gutter="10"
            :topPosition="true"
            :cols="fedexField"
            :form="form"
            :isDisable="isDisable"
          >
            <template #expressCompanyIdSlot="{ scoped: { prop, placeholder } }">
              <el-select size="mini" style="width: 100%" v-model="form[prop]" :placeholder="placeholder">
                <el-option
                  :label="companyName"
                  :value="id"
                  :key="id"
                  v-for="{ id, companyName } in fedexData"
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
            label-width="118px"
            :gutter="10"
            :topPosition="true"
            :cols="consigneeField"
            :form="form"
            :isDisable="isDisable"
          >
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
              :key="index"
              :gutter="10"
              :topPosition="true"
              :cols="productField"
              :form="proFrom"
            >
              <template #productExternalSkuCodeSlot="{ scoped: { prop, placeholder } }">
                <sku-select v-model="proFrom[prop]" :placeholder="placeholder"></sku-select>
              </template>
              <template #doneSlot>
                <i @click="shakingDel(index)" class="el-icon-delete" v-if="showDel"></i>
              </template>
            </BaseForm>
            <color-text-btn v-if="!isDetail" icon="el-icon-plus" type="primary" @click="addProduct">
              新增产品
            </color-text-btn>

            <color-text-btn v-else icon="el-icon-plus" type="info"> 新增产品 </color-text-btn>
          </template>
          <template v-else>
            <CommonTable class="common-table" height="auto" :selection="false" :cols="cols" :infoData="proData">
              <template #productCnNameSlotName="{ scoped: { productShowCover, productCnName } }">
                <div class="flex-middle align-center">
                  <div class="flex-middle">
                    <el-image :src="productShowCover" style="width: 50px; height: 50px" class="h100 mr5">
                      <div slot="error">
                        <img src="@/assets/images/default.png" width="50" height="50" alt="" class="block" />
                      </div>
                    </el-image>
                    <div class="nowrap">
                      <div>{{ productCnName }}</div>
                    </div>
                  </div>
                </div>
              </template>
              <template #productStructNameSlotName="{ scoped: { productStructName } }">
                {{productStructName == 0 ? '--': productStructName}}
              </template>
              <template #productSizeNameSlotName="{ scoped: { productSizeName } }">
                {{productSizeName == 0 ? '--': productSizeName}}
              </template>
            </CommonTable>
          </template>
        </div>
      </div>

      <template #footer>
        <el-button @click="close"> 取消 </el-button>
        <el-button type="primary" :loading="loading" @click="onsubmit" v-if="!isDetail">保存</el-button>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import colorTextBtn from '@/components/base/colorTextBtn.vue'
import skuSelect from '../skuSelect'
import cloneDeep from 'lodash/cloneDeep'
import { parseTime, debounce } from '@/utils'
import { getFedexField, consigneeField, productField } from './field'
import { proCols as cols } from './cols'
import {
  orderComplexUpdate as orderUpdate,
  orderItemUpdate as edit,
  orderItemCreate as add,
  orderItemDel as del
} from '@/api/order'
import { mapGetters } from 'vuex'
import { deepClone } from '@/components/avue/utils/util'

const PRO_ITEM = {
  productInternalSkuCode: null,
  productCount: 1
}
const IS_DETAIL = 0
const IS_EDIT = 1
export default {
  components: { colorTextBtn, skuSelect },
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
      default: false
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
    orderStatus: {
      type: String
    }
  },
  data() {
    return {
      cols,
      productField,
      visible: false,
      becomeEdit: false,
      loading: false,
      form: {}
    }
  },
  watch: {
    visible(newVal) {
      this.$emit('update:dialogVisible', newVal)
      if (newVal) {
        this.form = Object.assign({}, { product: [] }, cloneDeep(this.data))
      } else {
        this.reset()
      }
    },

    dialogVisible(newVal) {
      this.visible = newVal
    }
  },
  computed: {
    ...mapGetters(['fedexData']),
    fedexField({ isDetail }) {
      let field = deepClone(getFedexField(this.orderStatus))
      if (isDetail) {
        field.forEach((item) => delete item.rule)
      }
      return field
    },
    consigneeField({ isDetail }) {
      // import导入的consigneeField会被缓存，因此每次调用的都是同一个值
      let field = deepClone(consigneeField)
      if (isDetail) {
        field.forEach((item) => delete item.rule)
      } else {
        field[2].rule = [
          {
            validator: (rule, value, callback) => {
              if (!value && !this.form.consigneeContactMobilePhone) {
                return callback('收货人电话和收货人手机号码其中一个必须有值')
              }
              callback()
            }
          }
        ]
        field[3].rule = [
          {
            validator: (rule, value, callback) => {
              if (!value && !this.form.consigneeContactPhone) {
                return callback('收货人电话和收货人手机号码其中一个必须有值')
              }
              callback()
            }
          }
        ]
      }
      return field
    },
    proData() {
      try {
        return this.form.productData || []
      } catch (err) {
        return []
      }
    },
    isDisable() {
      if (this.type == IS_DETAIL) {
        return true
      } else {
        return false
      }
    },
    isDetail() {
      return this.type == IS_DETAIL
    },
    hasMenuBtn() {
      if (this.becomeEdit) return this.becomeEdit
      return this.menuBtn
    },
    showDel() {
      return this.proData.length > 1 && !this.isDetail
    }
  },
  methods: {
    parseTime,
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
        if (successBool) {
          if (this.sup_this) {
            this.sup_this.init()
          }

          this.$message.success('操作成功')
          this.close()
        }
      } catch (err) {}
      this.loading = false
    },
    doDel(data) {
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
<style lang="scss" scoped>
.orderDetailComponent {
  ::v-deep {
    .el-select > .el-input {
      width: 248px;
      height: 36px;
    }
    .el-input--mini .el-input__inner {
      width: 248px;
      height: 36px;
    }
    .customClass.customClass {
      padding: 0;
      .el-form {
        padding: 0;
        margin: 0;
      }
    }
  }
  .bodyTitle {
    border-left: 2px solid $color-primary;
    padding: 0 0 0 10px;
    margin-bottom: 10px;
    .edit {
      position: absolute;
      right: 25px;
      margin-top: -10px;
    }
  }
  .el-icon-delete {
    position: relative;
    top: 42px;
    font-size: 20px;
    color: $color-primary;
    cursor: pointer;
  }
}
</style>
