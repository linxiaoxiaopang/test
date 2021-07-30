import {WAIT_GENERATE_WAYBILL, WAYBILL_CODE_UPLOADED_NO} from '@/utils/constant'

export const options = {
  '/order/waitCreateWaybill': {
    resetUrl: '/order/importGroup/listByOrderStatus',
    goTourl: '/order/waitCreateWaybillDetails',
    resetMergeData: {
      // orderGroupId: this.$route.query.id,
      isReturnWaybillChangeRecord: 1,
      orderStatus: WAIT_GENERATE_WAYBILL,
      isWaybillCodeUploaded: WAYBILL_CODE_UPLOADED_NO
    }
  },
  '/order/createWaybillError': {
    resetUrl: '/order/importGroup/listByOrderStatus',
    goTourl: '/order/createWaybillErrorDetails',
    resetMergeData: {
      isReturnWaybillChangeRecord: 1,
      // orderGroupId: this.$route.query.id,
      orderStatus: WAIT_GENERATE_WAYBILL,
      isWaybillCodeUploaded: WAYBILL_CODE_UPLOADED_NO,
      expressWaybillIsCreated: 9
    }
  }
}