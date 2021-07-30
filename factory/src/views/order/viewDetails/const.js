export const tableOption = {
  editBtn: false,
  delBtn: false,
  menu: false,
  searchSpan: 7,
  column: [
    {
      label: '工厂单号',
      prop: 'orderCode',
      search: true
    },
    {
      label: '编号',
      prop: 'expressWaybillCode',
      search: true
    },
    {
      label: '所属订单',
      prop: 'productCnName',
      search: true
    },
    {
      label: 'SKU号',
      prop: 'productInternalSkuCode',
      search: true
    },
    {
      label: '颜色',
      prop: 'color'
    },
    {
      label: '尺码',
      prop: 'size'
    },
    {
      label: '数量',
      prop: 'num'
    },
    {
      label: '客户',
      prop: 'client'
    },
    {
      label: '物流方式',
      prop: 'expressCompanyId',
      type: 'select'
    },
    {
      label: '订单日期',
      prop: 'importTime',
      valueFormat: 'yyyy-MM-dd',
      search: true,
      type: 'daterange'
    }
  ]
}
