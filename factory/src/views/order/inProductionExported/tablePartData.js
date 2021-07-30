
export const tableOption = {
  editBtn: false,
  delBtn: false,
  column: [
    {
      label: '生产批次',
      prop: 'batchName',
      search: true
    },
    {
      label: '导出时间',
      prop: 'exportTime',
      valueFormat: 'yyyy-MM-dd',
      search: true,
      type: 'daterange',
      searchSpan: 8,
      hide: true
    },
    {
      label: '导出时间',
      prop: 'exportTime'
    },
    {
      label: '批次订单数',
      prop: 'orderCount'
    }
  ]
}