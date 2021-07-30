//运单组
export const waybillGroupClos = [
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


//运单列表
export const waybillListClos = [
  {
    prop: 'orderCode',
    label: '订单编号',
    slotName: 'orderCodeSlot',
    minWidth: 188
  },
  {
    prop: 'expressWaybillCode',
    label: '运单号',
    slotName: 'expressWaybillCodeSlot'
  },
  {
    prop: 'expressCompanyId',
    label: '物流方式',
    minWidth: 200,
    slotName: 'expressCompanyIdSlot'
  },
  {
    prop: 'userName',
    label: '业务员'
  },
  /*{
    prop: "orderStatusNew",
    label: "状态",
    minWidth: 200,
    slotName: 'orderStatusNewSlot'
  },*/
  {
    prop: 'importTime',
    label: '导入时间',
    slotName: 'importTimeSlot'
  }
]