export const tableOption = {
  editBtn: false,
  delBtn: false,
  searchSpan: 7,
  searchLabelWidth: 100,
  column: [
    {
      label: '订单号',
      prop: 'orderCode',
      search: true
    },
    {
      label: '物流',
      prop: 'expressCompanyId',
      type: 'select'
    },
    {
      label: '运单号',
      prop: 'expressWaybillCode',
      search: true
    },
    {
      label: '用户',
      prop: 'userName',
      search: true
    },
    {
      label: '订单状态',
      prop: 'orderStatus',
      hide: true,
      search: true,
      type: 'select'
    },
    {
      label: '刀版图状态',
      prop: 'isKnifeLayoutCreated',
      search: true,
      type: 'select'
    },
    {
      label: '导出时间',
      prop: 'sendTime',
      type: 'daterange',
      valueFormat: 'yyyy-MM-dd'
    },
    {
      label: '状态',
      prop: 'orderStatus',
      type: 'select'
    }
  ]
}
