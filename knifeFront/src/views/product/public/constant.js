export const tableOption = {
  height: '100%',
  searchText: '查询',
  menuWidth: 188,
  resetBtn: true,
  editBtn: false,
  delBtn: false,
  column: [
    {
      label: '产品信息',
      prop: 'product',
      slot: true,
      width: 250
    },
    {
      label: '尺码',
      prop: 'size'
    },
    {
      label: 'SKU',
      prop: 'custom_sku',
      width: 250,
      search: true,
      searchSpan: 8,
      searchPlaceholder: '自定义SKU',
      searchLabelWidth: 88
    },
    {
      label: '外部产品 SKU',
      prop: 'user_sku',
      slot: true,
      width: 250,
      search: true,
      searchSpan: 8,
      searchPlaceholder: '外部SKU',
      searchLabelWidth: 110
    },
    {
      label: '业务员',
      prop: 'owner_name'
    },
    {
      label: '业务员',
      prop: 'user_name',
      hide: true,
      search: true,
      searchSpan: 8
    },
    {
      label: '关联时间',
      prop: 'create_time',
      minWidth: 100,
      slot: true,
      search: true,
      type: 'daterange',
      valueFormat: 'yyyy-MM-dd',
      searchSpan: 8,
      searchLabelWidth: 88
    }
  ]
}
