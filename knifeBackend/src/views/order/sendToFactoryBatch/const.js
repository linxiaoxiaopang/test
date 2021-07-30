export const tableOption = {
  menuWidth: 188,
  editBtn: false,
  delBtn: false,
  column: [
    {
      label: '导出批次',
      prop: 'batchName',
      search: true,
      searchWidth: 275,
      searchLabelWidth: 100
    },
    {
      label: '分配供应商',
      prop: 'supplierId',
      search: true,
      searchWidth: 275,
      type: 'select',
      searchLabelWidth: 100
    },
    {
      label: '操作员',
      prop: 'userName',
      search: true,
      searchWidth: 275,
      searchLabelWidth: 100
    },
    {
      label: '导出时间',
      prop: 'sendTime',
      search: true,
      searchFormSlot: true,
      searchWidth: 555,
      searchLabelWidth: 100,
      type: 'daterange',
      valueFormat: 'yyyy-MM-dd'
    }
  ]
}
