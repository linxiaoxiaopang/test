export const tableOption = {
  selection: true,
  selectable: (row, index) => {
    return row.isHeader
  },
  editBtn: false,
  delBtn: false,
  column: [
    {
      label: '订单号',
      prop: 'orderCode',
      hide: true,
      search: true,
      searchSpan: 7
    },
    {
      label: '运单号',
      prop: 'expressWaybillCode',
      hide: true,
      search: true,
      searchSpan: 7
    },
    {
      label: '产品名称',
      prop: 'productCnName',
      hide: true,
      search: true,
      searchSpan: 7
    },
    {
      label: '产品信息',
      prop: 'productInfo',
      slot: true,
      overHidden: true,
      minWidth: 188
    },
    {
      label: 'SKU',
      prop: 'productInternalSkuCode',
      minWidth: 200
    },
    {
      label: '导入用户',
      prop: 'userName',
      search: true,
      searchSpan: 7
    },
    {
      label: '面单附件上传',
      prop: 'expressWaybillIsUploaded',
      type: 'select'
    },
    {
      label: '过期时间',
      prop: 'expressExpireTime',
      valueFormat: 'yyyy-MM-dd',
      slot: true,
      width: 180
    },
    {
      label: '导入时间',
      prop: 'importTime',
      valueFormat: 'yyyy-MM-dd',
      search: true,
      type: 'daterange',
      searchSpan: 7,
      width: 180
    },
    {
      label: '状态',
      prop: 'factoryStatus',
      minWidth: 120,
      type: 'select'
    }
  ]
}
