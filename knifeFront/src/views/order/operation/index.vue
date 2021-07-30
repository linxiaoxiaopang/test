<template>
  <div>
    <detailOrEdit
      :isChangeOrderPage="isChangeOrderPage"
      :sup_this="sup_this"
      :fedexData="sup_this.fedexData"
      :type="canEdit(row.orderStatus, row.expressWaybillIsCreated) ? 1 : 0"
      :isProTable="`${row.orderStatus}` !== orderStatus.WAIT_RELATION"
      :data="row"
      @submit="$refs.OrderBasePage.init()"
      v-p="['order:orderItem:relevanceUpdate']"
      >详情</detailOrEdit
    >
    <el-dropdown v-if="!isReturnOrder(row.orderStatus)">
      <span class="el-dropdown-link more-btn">
        更多<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <!-- 打印彩图 -->
        <el-dropdown-item v-if="!canNotPrint(row.orderStatus)">
          <print :data="row" :printId="`print_${index}`" v-p="['order:orderItem:list']"></print>
        </el-dropdown-item>
        <!-- 取消订单 -->
        <el-dropdown-item v-if="canCancelOrder(row.orderStatus)">
          <cancelOrder :data="row" :sup_this="sup_this" v-p="['order:order:cancel']"></cancelOrder
        ></el-dropdown-item>
        <!-- 换单 生产中/运单已过期 -->
        <el-dropdown-item v-if="hasChangeOrder(row.orderStatus, row.expressWaybillIsCreated ,row.waybillType)">
          <ChangeOrder
            :data="row"
            :sup_this="sup_this"
            :fedexData="sup_this.fedexData"
            v-p="['order:order:changeWaybill']"
        /></el-dropdown-item>
        <!-- 退货 生产中/运单已过期 -->
        <el-dropdown-item v-if="hasReturnOrder(row.orderStatus)">
          <ReturnOrder
            :data="row"
            :fedexData="sup_this.fedexData"
            :sup_this="sup_this"
            v-p="['order:order:returnGoods']"
        /></el-dropdown-item>
        <!-- 恢复订单 已取消 -->
        <el-dropdown-item v-if="isCancelOrder(row.orderStatus)">
          <RecoveryOrder
            :data="row"
            :fedexData="sup_this.fedexData"
            :sup_this="sup_this"
            v-p="['order:order:restore']"
          />
        </el-dropdown-item>
        <!-- 删除订单 已取消 -->
        <el-dropdown-item v-if="isCancelOrder(row.orderStatus)">
          <DelOrder
            :data="row"
            :fedexData="sup_this.fedexData"
            :sup_this="sup_this"
            v-p="['order:order:delete']"
          />
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import detailOrEdit from '../module/detailOrEdit'
import cancelOrder from '../module/cancelOrder'
import print from '../module/print'
import * as orderStatus from '@/utils/constant/businessConst'
import ChangeOrder from '../module/changeOrder'
import ReturnOrder from '../module/returnOrder'
import DelOrder from '../module/delOrder'
import RecoveryOrder from '../module/recoveryOrder'
import { WAYBILL_TYPE_HAND } from '@/utils/constant'

export default {
  props: {
    sup_this: {
      type: Object
    },
    row: {
      type: Object
    },
    index: {
      type: Number
    },
    isChangeOrderPage: {
      type: Boolean
    }
  },
  components: {
    detailOrEdit,
    cancelOrder,
    print,
    ChangeOrder,
    ReturnOrder,
    DelOrder,
    RecoveryOrder
  },
  data() {
    return {
      orderStatus
    }
  },
  mounted() {
    document.body.style.overflow = 'hidden'
    this.$once('hook:destroyed', () => {
      document.body.style.overflow = ''
    })
  },
  methods: {
    // 更多 - 打印彩图是否不能显示
    canNotPrint(status) {
      const {} = this.orderStatus
      return [].includes(String(status))
    },
    // 详情是否可编辑
    canEdit(status, expressWaybillIsCreated) {
      const { WAIT_RELATION, WAIT_GENERATE_WAYBILL, WAIT_DISPATCH } = this.orderStatus
      // 可编辑状态
      const canEdt = [
        // 待关联
        {
          status: WAIT_RELATION
        },
        // 待申请运单
        {
          status: WAIT_GENERATE_WAYBILL,
          expressWaybillIsCreated: 0
        },
        // 运单申请异常
        {
          status: WAIT_GENERATE_WAYBILL,
          expressWaybillIsCreated: 9
        },
        // 待排单
        {
          status: WAIT_DISPATCH
        }
      ]

      const result = canEdt.find((item) => {
        return (
          item.status === String(status) &&
          (item.hasOwnProperty('expressWaybillIsCreated')
            ? item.expressWaybillIsCreated === expressWaybillIsCreated
            : true)
        )
      })
      return !!result
    },
    // 更多 - 取消订单是否显示
    canCancelOrder(status) {
      const { WAIT_RELATION, WAIT_GENERATE_WAYBILL, WAIT_DISPATCH, IN_DISPATCH } = this.orderStatus
      return [WAIT_RELATION, WAIT_GENERATE_WAYBILL, WAIT_DISPATCH, IN_DISPATCH].includes(
        String(status)
      )
    },
    // 更多 - 换单是否显示
    hasChangeOrder(status, expressWaybillIsCreated, waybillType) {
      const { IN_PRODUCTION, EXPIRED } = this.orderStatus
      // 已申请运单号不得换单
      return ([IN_PRODUCTION, EXPIRED].includes(String(status)) && waybillType === WAYBILL_TYPE_HAND)
    },
    // 更多 - 退货是否显示
    hasReturnOrder(status) {
      const { IN_PRODUCTION, EXPIRED } = this.orderStatus
      return [IN_PRODUCTION, EXPIRED].includes(String(status)) 
    },
    // 更多 - 恢复和删除订单是否显示
    isCancelOrder(status) {
      const { CANCEL } = this.orderStatus
      return [CANCEL].includes(String(status))
    },
    // 是否退货中，退货中不显示更多
    isReturnOrder(status) {
      const { RETURN_GOODS } = this.orderStatus
      return [RETURN_GOODS].includes(String(status))
    }
  }
}
</script>

<style></style>
