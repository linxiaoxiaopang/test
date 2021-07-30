//物流
//=============================================
//=============================================
//=============================================

//物流列表
export const fedexListCols = [
  {
    prop: 'companyName',
    label: '物流名称',
    minWidth: '200'
  },
  {
    prop: 'logisticsCycle',
    label: '物流周期',
    minWidth: '200'
  },
  {
    prop: 'isCustomsDeclare',
    label: '物流类型',
    minWidth: '200',
    slotName: 'need_declareSlot'
  }
]

//国家列表
export const countryListCols = [
  {
    label: '所属洲',
    slotName: 'continentSlot',
    minWidth: '200'
  },
  {
    prop: 'countryCnName',
    label: '国家/地区中文名称',
    minWidth: '200'
  },
  {
    prop: 'countryEnName',
    label: '国家/地区英文名称',
    minWidth: '200'
  },
  {
    prop: 'twoCharCode',
    label: '国家/地区两位代码',
    minWidth: '200'
  }
]

//模板列表
export const formworkListCols = [
  {
    label: '模板名称',
    prop: 'templateName',
    minWidth: '200'
  },
  {
    slotName: 'stateSlot',
    label: '模板状态',
    minWidth: '200'
  },
  {
    prop: 'updateTime',
    slotName: 'updateTimeSlot',
    label: '更新时间',
    minWidth: '200',
    sortable: true
  }
]

//已创建的列表
export const createdListCols = [
  {
    label: '国家/地区名称',
    slotName: 'createdListSlot',
    minWidth: '200'
  }
]
