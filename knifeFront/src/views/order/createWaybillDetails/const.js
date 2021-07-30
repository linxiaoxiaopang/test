import { WAIT_GENERATE_WAYBILL } from '@/utils/constant'

export const options = {
  '/order/waitCreateWaybill': {
    againApplyBtn: false, // 重新申请
    selectExpressBtn: true, // 选择物流方式
    isNeedOrderCode: 2, // 编辑 物流信息是否必填
    cols: [
      {
        prop: 'orderCode',
        label: '订单信息',
        slotName: 'orderCodeSlot',
        minWidth: 158
      },
      {
        prop: 'expressCompanyId',
        label: '物流',
        slotName: 'expressCompanyIdSlot'
      },
      {
        prop: 'totalSales',
        label: '销售总计',
        minWidth: 158,
        slotName: 'totalSalesSlot'
      },
      {
        prop: 'totalLoans',
        label: '货款总计',
        minWidth: 158,
        slotName: 'totalLoansSlot'
      },
      {
        prop: 'importTime',
        label: '导入时间',
        slotName: 'importTimeSlot'
      }
    ],
    resetMergeData: {
      isReturnWaybillChangeRecord: 1,
      orderStatus: WAIT_GENERATE_WAYBILL,
      expressWaybillIsCreated: 0
    }
  },
  '/order/createWaybill': {
    againApplyBtn: false, // 重新申请
    selectExpressBtn: false, // 选择物流方式
    isNeedOrderCode: 0, // 编辑 物流信息是否必填
    cols: [
      {
        prop: 'orderCode',
        label: '订单号',
        slotName: 'orderCodeSlot',
        minWidth: 158
      },
      {
        prop: 'expressCompanyId',
        label: '物流',
        slotName: 'expressCompanyIdSlot'
      },
      {
        prop: 'totalSales',
        label: '销售总计',
        minWidth: 158,
        slotName: 'totalSalesSlot'
      },
      {
        prop: 'totalLoans',
        label: '货款总计',
        minWidth: 158,
        slotName: 'totalLoansSlot'
      },
      {
        prop: 'importTime',
        label: '导入时间',
        slotName: 'importTimeSlot'
      }
    ],
    resetMergeData: {
      isReturnWaybillChangeRecord: 1,
      orderStatus: WAIT_GENERATE_WAYBILL,
      expressWaybillIsCreated: 8
    }
  },
  '/order/createWaybillError': {
    againApplyBtn: true, // 重新申请
    selectExpressBtn: false, // 选择物流方式
    isNeedOrderCode: 1, // 编辑 物流信息是否必填
    cols: [
      {
        prop: 'orderCode',
        label: '订单号',
        slotName: 'orderCodeSlot',
        minWidth: 158
      },
      {
        prop: 'expressCompanyId',
        label: '物流',
        slotName: 'expressCompanyIdSlot'
      },
      {
        prop: 'totalSales',
        label: '销售总计',
        minWidth: 158,
        slotName: 'totalSalesSlot'
      },
      {
        prop: 'totalLoans',
        label: '货款总计',
        minWidth: 158,
        slotName: 'totalLoansSlot'
      },
      {
        prop: 'applyStatus',
        label: '申请状态',
        slotName: 'dicSlot'
      },
      {
        prop: 'remark',
        label: '备注',
        minWidth: 188
      },
      {
        prop: 'importTime',
        label: '导入时间',
        slotName: 'importTimeSlot'
      }
    ],
    resetMergeData: {
      isReturnWaybillChangeRecord: 1,
      orderStatus: WAIT_GENERATE_WAYBILL,
      expressWaybillIsCreated: 9
    }
  }
}
