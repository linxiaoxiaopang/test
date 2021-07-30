//订单组
export const orderGroupClos = [
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
    minWidth: 100
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
    minWidth: 100
  }
]

//订单列表
export const orderListClos = [
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
    slotName: 'importTimeSlot',
    minWidth: 100
  },
  {
    prop: 'productExternalSkuCode',
    label: '产品信息',
    slotName: 'productExternalSkuCodeSlot',
    minWidth: 200
  },
  {
    prop: 'orderItemDTOList',
    label: '数量',
    slotName: 'orderItemDTOListSlot'
  }
]
