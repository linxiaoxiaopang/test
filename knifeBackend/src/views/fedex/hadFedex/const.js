export const tableOption = {
  align: 'center',
  menuWidth: 688,
  menuFixed: 'normal',
  menuAlign: 'center',
  editBtn: false,
  delBtn: false,
  rowKey: 'customId',
  column: [
    {
      label: '账号授权状态',
      prop: 'isAuthorized',
      hide: true,
      search: true,
      type: 'radio',
      border: true,
      searchWidth: 328,
      searchValue: 'all',
      searchLabelWidth: 120
    },
    {
      label: '物流商',
      prop: 'expressCompanyId',
      slot: true,
      minWidth: 200,
      search: true,
      type: 'select',
      searchWidth: 275,
      searchLabelWidth: 100
    },
    {
      label: '物流方式',
      prop: 'cnName',
      hide: true,
      search: true,
      searchWidth: 275,
      searchLabelWidth: 100
    },
    {
      label: '授权状态',
      prop: 'isAuthorized',
      slot: true,
      width: 258,
      type: 'select'
    },
    {
      label: '启用状态',
      prop: 'isEnabled',
      width: 258
    }
  ]
}

export const channelOption = {
  editBtn: false,
  delBtn: false,
  align: 'center',
  menuWidth: 588,
  menuFixed: 'normal',
  menuAlign: 'center',
  column: [
    {
      prop: 'cnName',
      headerSlot: true
    },
    {
      label: '启用状态',
      prop: 'isEnabled',
      slot: true,
      width: 258
    }
  ]
}