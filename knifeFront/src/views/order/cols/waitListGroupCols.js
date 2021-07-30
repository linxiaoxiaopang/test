//订单组
export const waitGroupClos = [
  {
    prop: 'groupCode',
    label: '订单组号'
  },
  {
    prop: 'groupName',
    label: '订单组名'
  },
  {
    prop: 'userName',
    label: '业务员',
    minWidth: 200
  },
  {
    prop: 'isAttachmentUploaded',
    label: '附件上传',
    minWidth: 200,
    slotName: 'isAttachmentUploadedSlot'
  },
  {
    prop: 'internalTotalPrice',
    label: '当前货款总额',
    minWidth: 200,
    slotName: 'moneySlot'
  },
  {
    prop: 'importTime',
    label: '导入时间',
    minWidth: 200,
    slotName: 'importTimeSlot'
  },
  {
    prop: 'remark',
    label: '备注',
    minWidth: 200
  }
]

//订单列表
export const waitListClos = [
  {
    prop: 'orderCode',
    label: '订单编号',
    slotName: 'orderCodeSlot',
    minWidth: 188
  },
  {
    prop: 'expressWaybillCode',
    label: '运单号'
  },
  {
    prop: 'expressCompanyId',
    label: '物流方式',
    slotName: 'expressCompanyIdSlot'
  },
  {
    prop: 'consigneeCountryCode',
    label: '国家'
  },
  {
    prop: 'expressWaybillIsUploaded',
    label: '附件上传',
    slotName: 'expressWaybillIsUploadedSlot'
  },
  {
    prop: 'expressExpireTime',
    label: '物流到期时间',
    sortable: true,
    slotName: 'expressExpireTimeSlot'
  },
  {
    prop: 'userName',
    label: '业务员'
  },
  {
    prop: 'importTime',
    label: '导入时间',
    slotName: 'importTimeSlot'
  },
  {
    prop: 'orderStatus',
    label: '状态',
    minWidth: 120,
    slotName: 'orderStatusSlot'
  },
  {
    prop: 'totalSales',
    label: '销售总计',
    minWidth: 200,
    slotName: 'totalSalesSlot'
  },
  {
    prop: 'totalLoans',
    label: '货款总计',
    minWidth: 200,
    slotName: 'totalLoansSlot'
  },
  {
    prop: 'orderItemDTOList',
    label: '数量',
    slotName: 'orderItemDTOListSlot'
  }
]
