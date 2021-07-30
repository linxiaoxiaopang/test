<template>
  <div class="detailOrEditComponent">
    <el-drawer
      custom-class="detailOrEditComponent-common-class"
      size="900px"
      :visible.sync="visible"
      :withHeader="false"
      :before-close="handleBeforeClose"
      :append-to-body="true"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <div class="drawerTitle">
        <p class="orderid">订单编号 : {{ form.orderCode }}</p>
        <p class="importTime">导入时间 : {{ parseTime(form.importTime) || '' }}</p>
        <i class="el-icon-close" @click="close"></i>
      </div>
      <div class="drawerBody" v-loading="loading">
        <!-- 产品信息 -->
        <div class="item" v-loading="loading">
          <div class="bodyTitle">产品信息</div>
          <template>
            <CommonTable
              class="common-table"
              height="auto"
              :selection="false"
              :cols="cols"
              :infoData="proData"
              :span-method="spanMethod"
            >
              <!-- 产品信息头部 -->
              <template #productShowCoverHeaderSlot>
                <span class="productShowCoverHeaderSlot">订单产品</span>
                <!-- 添加产品 -->
                <el-popover
                  placement="right"
                  width="400"
                  trigger="manual"
                  v-if="!isProTable"
                  v-model="addProductVisible"
                >
                  <el-form ref="addForm" class="add-product" :model="addForm" label-width="80px" :rules="formRules">
                    <el-form-item label="SKU" prop="sku">
                      <el-input v-model="addForm.sku"></el-input>
                    </el-form-item>
                    <el-form-item label="数量">
                      <el-input type="number" v-model="addForm.count"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="addProduct">添加</el-button>
                      <el-button type="primary" @click="changeAddProductVisible">取消</el-button>
                    </el-form-item>
                  </el-form>
                  <color-text-btn v-if="!isDetail" type="primary" slot="reference" @click="changeAddProductVisible">
                    新增产品
                  </color-text-btn>
                </el-popover>
              </template>
              <!-- 产品信息内容 -->
              <template v-slot:productShowCoverSlot="{ scoped }">
                <div class="product-wrapper">
                  <!-- productId初始值是0，代表订单未关联产品 -->
                  <div class="product-info" v-if="scoped.productId">
                    <div class="wrapper">
                      <el-image
                        :src="scoped.productShowCover"
                        :z-index="9999"
                        :preview-src-list="[`${scoped.productShowCover}`]"
                      />
                      <div class="info-wrapper">
                        <div>{{ scoped.productCustomSkuCode }}</div>
                        <div>{{ scoped.productCnName || '暂无' }}</div>
                        <div>
                          <span class="item">颜色：{{ scoped.productStructName }}</span>
                          <span class="item">尺码：{{ scoped.productSizeName }}</span>
                        </div>
                      </div>
                    </div>
                    <i @click="shakingDel(scoped.index)" class="el-icon-delete" v-if="showDel"></i>
                  </div>

                  <!-- 待关联 显示关联按钮 并可以添加产品 -->
                  <div class="to-be-associated" v-else>
                    <div class="wrapper">
                      <span class="skuStyle" style="margin-right: 10px"
                        >SKU: {{ scoped['productExternalSkuCode'] }}</span
                      >
                      <Relation
                        class="relation-btn"
                        :data="scoped"
                        :orderData="form"
                        :sup_this="dThis"
                        :allData="proData"
                        @updateProductExternalSkuCode="updateProductExternalSkuCode(scoped, $event)"
                        @edited="handleRelationEdited"
                        v-if="showRelation(scoped) && data.orderStatus != 29"
                      />
                    </div>
                    <i @click="shakingDel(scoped.index)" class="el-icon-delete" v-if="showDel"></i>
                  </div>
                </div>
              </template>

              <!-- 数量 -->
              <template #productCountSlot="{ scoped }">
                <div v-if="isProTable">{{ scoped[scoped.prop] }}</div>
                <div v-else>
                  <el-input-number
                    size="mini"
                    controls-position="right"
                    :min="1"
                    v-model="form.productData[scoped.index].productCount"
                  ></el-input-number>
                </div>
              </template>

              <template #totalSlot="{ scoped }">
                <div>产品货款: {{ parsePrice(data.internalTotalPrice) }}</div>
                <div>
                  <!-- templateFreight初始值为null，为0时表示不在物流方式运费模板重量范围内 -->
                  物流运费: {{
                    Number(data.templateFreight)
                      ? parsePrice(data.templateFreight)
                      : data.templateFreight === null ? '- -' : '不在重量范围内'
                  }}
                </div>
                <div>
                  总计: {{
                    Number(data.templateFreight)
                      ? parsePrice(numberAdd([data.internalTotalPrice, data.templateFreight]))
                      : '- -'
                  }}
                </div>
              </template>
            </CommonTable>
          </template>
        </div>
        <!-- 收货 -->
        <div class="item">
          <div class="bodyTitle">收货信息</div>
          <BaseForm
            ref="form2"
            label-position="left"
            label-suffix=" "
            size="mini"
            customClass="customClass"
            label-width="118px"
            :disabled="isDetail"
            :gutter="10"
            :topPosition="true"
            :cols="consigneeField"
            :form="consigneeForm"
          >
            <template #consigneeSlot="{ scoped: { prop, placeholder } }">
              <el-input v-model="form[prop]" :placeholder="placeholder"></el-input>
            </template>
            <template #expressCompanyIdSlot="{ scoped: { prop, placeholder } }">
              <el-select style="width: 110px" v-model="form[prop]" :placeholder="placeholder">
                <el-option label="订单组名" value="groupName"></el-option>
                <el-option label="订单编号" value="orderCode"></el-option>
              </el-select>
            </template>
          </BaseForm>
        </div>
        <!-- 物流 -->
        <div class="item">
          <div class="bodyTitle">
            <span>物流信息</span>
          </div>
          <!-- 订单换单记录 除最后一条 其他置灰 -->
          <CommonTable
            class="common-table express-table"
            height="auto"
            :selection="false"
            :cols="logisticsCols"
            :infoData="expressTableData"
            :span-method="spanMethod"
          >
            <template #expressShippingMethodCnNameSlot="{ scoped }">
              <div
                :class="{
                  'text-info': `${scoped.orderStatus}` === orderStatus.EXPIRED && scoped.index === 0
                }"
              >
                {{
                  scoped.expressShippingMethodCnName || getLabel('expressCompanyId', scoped.expressCompanyId) || '— —'
                }}
              </div>
            </template>
            <template #expressWaybillCodeSlot="{ scoped }">
              <div
                :class="{
                  'text-info': `${scoped.orderStatus}` === orderStatus.EXPIRED
                }"
              >
                <hover-copy
                  :value="scoped.expressWaybillCode"
                  v-if="scoped.expressWaybillCode"
                  :class="
                    (`${scoped.orderStatus}` === orderStatus.EXPIRED && scoped.index === 0) || scoped.$noMenu
                      ? 'text-info'
                      : 'text-primary'
                  "
                  >「{{ scoped.expressWaybillCode }}」</hover-copy
                >
                <span v-else-if="scoped.expressWaybillIsCreated === 9">
                  {{ scoped.remark }}
                </span>
                <span v-else>— —</span>
              </div>
            </template>
            <template #statusSlot="{ scoped }">
              <div v-if="scoped.$status">{{ scoped.$status }}</div>
              <div v-else-if="`${scoped.orderStatus}` === orderStatus.EXPIRED" class="text-danger">运单已过期</div>
              <div v-else-if="scoped.expressWaybillCode">已申请运单</div>
              <div v-else-if="scoped.expressWaybillIsCreated === 0">未申请运单</div>
              <div v-else-if="scoped.expressWaybillIsCreated === 8">运单申请中</div>
              <div v-else-if="scoped.expressWaybillIsCreated === 9">运单申请异常</div>
            </template>
            <template #operationSlot="{ scoped }">
              <template v-if="hasExpressTableMenu(scoped.$noMenu)">
                <template
                  v-if="
                    !scoped.expressWaybillCode &&
                    `${scoped.orderStatus}` !== orderStatus.WAIT_RELATION &&
                    `${scoped.orderStatus}` !== orderStatus.WAIT_GENERATE_WAYBILL 
                  "
                >
                  <selectExpressCompanyName :sup_this="{ selectionDataAllArr: [scoped], init }">
                    {{ scoped.expressWaybillIsCreated === 9 ? '重新申请' : '申请运单号' }}
                  </selectExpressCompanyName>
                </template>
                <ChangeOrder
                  v-if="
                    scoped.waybillType === orderStatus.WAYBILL_TYPE_HAND &&
                    (`${scoped.orderStatus}` === orderStatus.EXPIRED ||
                      `${scoped.orderStatus}` === orderStatus.IN_PRODUCTION)
                  "
                  btnType="primary"
                  :data="scoped"
                  :sup_this="sup_this"
                  v-p="['order:order:changeWaybill']"
                />
              </template>
            </template>
          </CommonTable>
        </div>
      </div>
      <div v-if="hasMenuBtn" class="bottom" v-loading="loading">
        <el-button size="mini" @click="close"> 取消 </el-button>
        <el-button type="primary" size="mini" @click="onsubmit">保存</el-button>
      </div>
    </el-drawer>
    <selectExpressCompanyName
      ref="selectExpressCompanyName"
      :sup_this="{ selectionDataAllArr: [consigneeForm], init: afterSubmit }"
      :beforeSubmit="doFn"
      :showBtn="false"
      v-if="
        (data.orderStatus === 20 && data.isKnifeLayoutCreated === 9) ||
        `${data.orderStatus}${data.expressWaybillIsCreated}` === orderStatus.WAYBILL_CREATE_ERROR ||
        data.orderStatus === 40
      "
    >
    </selectExpressCompanyName>
  </div>
</template>

<script>
import colorTextBtn from '@/components/base/colorTextBtn.vue'
import cloneDeep from 'lodash/cloneDeep'
import { parseTime, numberAdd, parsePrice } from '@/utils'
import { fedexField, noNeedFedexCodeField, noNeedFedexField, consigneeField, productField } from './field'
import { proCols as cols, logisticsCols } from './cols'
import Relation from '../../module/orderBasePage/module/relation'
import {
  EXPIRED,
  IN_PRODUCTION,
  WAIT_DISPATCH,
  WAIT_RELATION,
  WAYBILL_CREATE_ERROR,
  WAIT_GENERATE_WAYBILL,
  WAYBILL_TYPE_HAND,
  WAYBILL_TYPE_SYS
} from '@/utils/constant'
import {
  orderComplexUpdate as orderUpdate,
  relevanceUpdate as edit,
  complexCreate as add,
  orderItemComplexDel as del,
  orderItemList
} from '@/api/order'
import { getLabel } from '@/components/avue/utils/util'
import { allUserSkus as list } from '@/api/product/knifeApi'
import { mapGetters } from 'vuex'
import { getDiffData } from '@/components/avue/utils/util'
import { validatenull } from '@/components/avue/utils/validate'
import selectExpressCompanyName from '../selectExpressCompanyName'
import againApply from '../againApply'
import HoverCopy from '@/views/order/module/orderBasePage/module/hoverCopy'
import ChangeOrder from '../changeOrder'
const IS_DETAIL = 0
const IS_EDIT = 1
export default {
  components: {
    colorTextBtn,
    Relation,
    selectExpressCompanyName,
    againApply,
    HoverCopy,
    ChangeOrder
  },
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
    isToBeAssociated: {
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
    isNeedOrderCode: {
      type: Number,
      default: 0
    },
    isChangeOrderPage: {
      type: Boolean
    }
  },
  data() {
    return {
      cols,
      logisticsCols,
      productField,
      visible: false,
      becomeEdit: false,
      loading: false,
      allUsers: [],
      dThis: this,
      form: {},
      consigneeForm: {},
      addProductVisible: false,
      addForm: {
        sku: '',
        count: 1
      },
      orderStatus: {
        EXPIRED,
        IN_PRODUCTION,
        WAIT_RELATION,
        WAYBILL_CREATE_ERROR,
        WAYBILL_TYPE_HAND,
        WAIT_GENERATE_WAYBILL
      },
      formRules: {
        sku: [{ required: true, message: 'sku不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    visible(newVal) {
      this.$emit('update:dialogVisible', newVal)
      if (newVal) {
        this.form = Object.assign({}, { product: [] }, cloneDeep(this.data))
        this.consigneeForm = Object.assign({}, this.data)
        delete this.consigneeForm.productData
        delete this.consigneeForm.orderItemDTOList
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
    ...mapGetters(['expressCompanyId']),
    fedexField({ isDetail }) {
      let field = cloneDeep([fedexField, noNeedFedexCodeField, noNeedFedexField][this.isNeedOrderCode])
      if (isDetail) {
        field.forEach((item) => delete item.rule)
      }
      return field
    },
    consigneeField({ isDetail }) {
      // import导入的consigneeField会被缓存，因此每次调用的都是同一个值
      let field = cloneDeep(consigneeField)
      if (isDetail) {
        field.forEach((item) => delete item.rule)
      } else {
        field[2].rule = [
          {
            validator: (rule, value, callback) => {
              if (!value && !this.consigneeForm.consigneeContactMobilePhone) {
                return callback('收货人电话和收货人手机号码其中一个必须有值')
              }
              callback()
            }
          }
        ]
        field[3].rule = [
          {
            validator: (rule, value, callback) => {
              if (!value && !this.consigneeForm.consigneeContactPhone) {
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
    oProDataObj({ oProData }) {
      return oProData.reduce((prev, next) => {
        prev[next.id] = next
        return prev
      }, {})
    },
    isDetail() {
      return this.type == IS_DETAIL && !this.becomeEdit
    },
    hasMenuBtn() {
      if (this.becomeEdit) return this.becomeEdit
      return this.menuBtn
    },
    showDel() {
      return this.proData.length > 1 && !this.isDetail && !this.isProTable
    },
    showRelation({ row }) {
      return (row) => {
        const { productExternalSkuCode } = row
        const userSkus = this.allUsers.filter(({ user_sku }) => {
          return productExternalSkuCode === user_sku
        })
        // console.log('userSkus', userSkus)
        return !userSkus.length && productExternalSkuCode
      }
    },
    expressTableData({ data }) {
      if (validatenull(data.changeRecordDTOList)) return [data]
      return data.changeRecordDTOList.reduce((prev, { orderDTOInfoOld, orderDTOInfoNew }, index) => {
        if (`${orderDTOInfoOld.orderStatus}` !== EXPIRED) {
          orderDTOInfoOld.$status = '已申请运单'
        }
        orderDTOInfoOld.$noMenu = true
        prev.push(orderDTOInfoOld)
        if (data.changeRecordDTOList.length - 1 === index) {
          let tempObj = Object.assign({}, data, orderDTOInfoNew)
          tempObj.$status = '订单换单'
          tempObj.orderStatus = data.orderStatus
          tempObj.expressWaybillIsCreated = data.expressWaybillIsCreated
          prev.push(tempObj)
        }
        return prev
      }, [])
    },
    // 物流信息操作按钮是否显示
    hasExpressTableMenu({
      isChangeOrderPage,
      sup_this: {
        params: { waybillChangeStatusList }
      }
    }) {
      // 空数组every返回true
      // 是否是订单换单
      let isChangeOrder = isChangeOrderPage ||
        (
          Array.isArray(waybillChangeStatusList) &&
          waybillChangeStatusList.length &&
          waybillChangeStatusList.every((item) => [1, 2].includes(item))
        )
      return (noMenu) => {
        return !isChangeOrder && !noMenu
      }
    }
  },
  methods: {
    numberAdd,
    parsePrice,
    parseTime,
    getLabel,
    updateProductExternalSkuCode(form, productInternalSkuCode) {
      this.updateOrderItemList()
      this.$set(form, 'productInternalSkuCode', productInternalSkuCode)
      this.init()
    },
    handleRelationEdited(info) {
      this.updateOrderItemList()
      let index = this.oProData.findIndex(({ id }) => id === info.id)
      if (index > -1) {
        this.oProData[index] = cloneDeep(info)
      }
      // this.$parent.list().then(() => {
      //   this.form = Object.assign({}, { product: [] }, cloneDeep(this.data))
      // })
    },
    updateOrderItemList() {
      orderItemList({
        orderId: this.data.id
      }).then(({ detail }) => {
        Object.assign(this.form.productData, detail || [])
      })
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
    handleBeforeClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    close() {
      this.visible = false
    },
    shakingDel(index) {
      this.$confirm('确认删除产品？', {
        confirmButtonText: '确认',
        cancelButtonText: '放弃',
        callback: async (action) => {
          if (action === 'confirm') {
            this.form.productData.splice(index, 1)
            return
          }
          this.$message.info('已放弃')
        }
      })
    },
    async onsubmit() {
      this.loading = true
      const valid = await this.validate()
      const orderValid = await this.orderValidate()
      // console.log('orderValid', orderValid)
      if (!valid || !orderValid) {
        this.loading = false
        return
      }

      let { consigneeForm, data, form } = this
      let { orderStatus, expressWaybillIsCreated, waybillType } = consigneeForm
      let consigneeDiffData = getDiffData(consigneeForm, data)
      Object.assign(form, consigneeDiffData)

      // 修改收货信息、订单为系统导入、订单状态为待排单或运单申请异常
      let needUpdateWaybill =
        !validatenull(consigneeDiffData) &&
        waybillType === WAYBILL_TYPE_SYS &&
        (`${orderStatus}` === WAIT_DISPATCH || `${orderStatus}${expressWaybillIsCreated}` === WAYBILL_CREATE_ERROR)

      if (needUpdateWaybill) {
        this.loading = false
        let [err, valid] = await awaitWrap(
          this.$confirm('编辑内容后，系统将自动更新运单号！<br/>（原运单号将失效）', '确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true
          })
        )
        if (valid) this.$refs.selectExpressCompanyName.to()
        return
      }

      let success = await this.doFn()

      if (success) {
        this.$message.success('操作成功')
      }

      this.afterSubmit()
      this.close()
      this.loading = false
    },
    afterSubmit() {
      this.sup_this && this.sup_this.init()
    },
    async doFn() {
      let { data, form } = this
      data.consigneeName = data.consigneeName.trim()
      form.consigneeName = form.consigneeName.trim()
      const proData = this.proData
      let pData = []
      let diffData = getDiffData(form, data)
      delete diffData.product
      delete diffData.productData
      if (!validatenull(diffData)) {
        diffData.id = form.id
        pData = [orderUpdate(diffData)]
      }
      if (!this.isProTable) {
        pData = pData.concat(this.doAdd(proData), this.doEdit(proData), this.doDel(proData))
      }
      console.log('pData', pData)
      const [err, res] = await awaitWrap(Promise.all(pData))

      if (res) {
        // 空数组every方法返回true
        return res.every(({ code }) => $SUC({ code }))
      }
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
      let oIdList = Object.keys(this.oProDataObj)
      let nIdList = data.map(({ id }) => Number(id))
      let idList = oIdList.reduce((prev, oId) => {
        if (!nIdList.includes(Number(oId))) prev.push(Number(oId))
        return prev
      }, [])
      return idList.length
        ? [
            del({
              idList,
              orderId: this.form.id
            })
          ]
        : []
    },

    doAdd(data) {
      let { allUsers } = this
      const addArr = data.filter(({ id }) => {
        return !id
      })
      return addArr.map((form) => {
        let productExternalSkuCode = form.productExternalSkuCode
        let productInternalSkuCode = allUsers.find(({ user_sku }) => productExternalSkuCode === user_sku)
        return add({
          productInternalSkuCode: productInternalSkuCode && productInternalSkuCode.sys_sku_name,
          orderId: this.data.id,
          orderUserId: this.data.userId,
          ...form
        })
      })
    },

    doEdit(data) {
      let { allUsers } = this
      let aKey = ['productCount', 'productExternalSkuCode', 'productInternalSkuCode']
      const editArr = data.reduce((prev, next) => {
        if (next.id) {
          let oItem = this.oProDataObj[next.id]
          let tempObj = { id: next.id }

          next.productInternalSkuCode =
            next.productInternalSkuCode ||
            (allUsers.find(({ user_sku }) => next.productExternalSkuCode === user_sku) || {}).sys_sku_name

          if (
            aKey.some((key) => {
              if ((next[key] || oItem[key]) && next[key] !== oItem[key]) {
                return true
              }
            })
          ) {
            aKey.map((key) => (tempObj[key] = next[key]))
            prev.push(tempObj)
          }
        }
        return prev
      }, [])
      return editArr.map(({ id, productCount, productExternalSkuCode, productInternalSkuCode }) => {
        return edit({
          id,
          productCount,
          productExternalSkuCode,
          productInternalSkuCode
        })
      })
    },

    addProduct() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          const { sku, count } = this.addForm
          this.form.productData.push({
            productExternalSkuCode: sku,
            productCount: count,
            internalUnitPrice: 0,
            internalTotalPrice: 0
          })
          this.addForm = {
            sku: '',
            count: 1
          }
          this.changeAddProductVisible()
        } else {
          return
        }
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
      const { $refs } = this
      let forms = []
      for (const key in $refs) {
        if (key.includes('form')) {
          let form = $refs[key]
          // console.log('form', form)
          Array.isArray(form) ? (forms = forms.concat(form)) : forms.push(form)
        }
      }
      // console.log('forms', forms)
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
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 4) {
        if (rowIndex === 0) {
          return [this.proData.length, 1]
        } else {
          return [0, 0]
        }
      }
      return [1, 1]
    },
    changeAddProductVisible() {
      this.addProductVisible = !this.addProductVisible
    }
  }
}
</script>

<style lang="scss">
.detailOrEditComponent-common-class {
  background-color: $bg-color;

  .product-wrapper {
    color: #636c78;

    .wrapper {
      display: flex;
      align-items: center;
    }
    .el-image {
      width: 50px;
      height: 50px;
      margin-right: 10px;
      border-radius: 6px;
      background: $bg-color;
    }
    .item {
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
    }
    .to-be-associated {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .product-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
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
  .el-form-item {
    margin-bottom: 0 !important;
  }
  .productShowCoverHeaderSlot {
    margin-right: 10px;
  }
  .el-input-number {
    min-width: 80px !important;
  }
}
.express-table {
  .el-table__row:not(:last-child) {
    .cell,
    .cell > * {
      color: $color-info !important;
    }
  }
}
</style>
