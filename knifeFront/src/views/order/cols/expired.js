//订单组
export const expiredGroupClos = [
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
    prop: 'expressWaybillIsUploaded',
    label: '附件上传',
    minWidth: 200
  },
  {
    prop: 'importTime',
    label: '导入时间',
    minWidth: 200,
    slotName: 'importTimeSlot',
    sortable: true
  }
]

//订单列表
export const expiredListClos = [
  {
    prop: 'orderCode',
    label: '订单信息',
    slotName: 'orderCodeSlot',
    minWidth: 188
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
    prop: 'consigneeCountryCode',
    slotName: 'consigneeCountryCodeSlot',
    label: '收件人【国家/地区】',
    minWidth: 100
  },
  {
    prop: 'expressCompanyId',
    label: '物流方式',
    slotName: 'expressCompanyIdSlot'
  },
  {
    prop: 'expressWaybillCode',
    label: '运单号'
  },
  {
    prop: 'orderStatus',
    label: '订单状态',
    slotName: 'orderStatusSlot'
  },
  {
    prop: 'importTime',
    label: '导入时间',
    slotName: 'importTimeSlot'
  }
]
