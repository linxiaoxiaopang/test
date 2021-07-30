export const proCols = [
  {
    prop: 'productShowCover',
    headerSlotName: 'productShowCoverHeaderSlot',
    label: '订单产品',
    slotName: 'productShowCoverSlot',
    minWidth: 300
  },
  {
    prop: 'internalUnitPrice',
    label: '单价'
  },
  {
    prop: 'productCount',
    slotName: 'productCountSlot',
    label: '数量'
  },
  {
    prop: 'internalTotalPrice',
    label: '货款'
  },
  {
    prop: 'total',
    label: '货款总计',
    slotName: 'totalSlot',
    width: 170
  }
]

export const logisticsCols = [
  {
    prop: 'expressShippingMethodCnName',
    slotName: 'expressShippingMethodCnNameSlot',
    label: '物流渠道'
  },
  {
    prop: 'expressWaybillCode',
    slotName: 'expressWaybillCodeSlot',
    label: '运单号'
  },
  {
    prop: 'status',
    slotName: 'statusSlot',
    label: '运单状态'
  },
  {
    prop: 'operation',
    slotName: 'operationSlot',
    label: '操作'
  }
]
