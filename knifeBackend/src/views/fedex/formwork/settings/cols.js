//首重列表
export const firstWeightListCols = [
  {
    label: '国家/地区名称',
    prop: 'countryCnName',
    slotName: 'createdListSlot',
    minWidth: '200'
  },
  {
    label: '重量范围(g)',
    prop: 'weightRange',
    slotName: 'weightRangeSlot',
    minWidth: '200'
  },
  {
    label: '首重费用(￥)',
    prop: 'firstFreight',
    minWidth: '200',
    slotName: 'firstFreightSlot'
  },
  {
    label: '续重单位价格(￥)',
    prop: 'continuedFreight',
    minWidth: '200',
    slotName: 'continuedFreightSlot'
  },
  {
    label: '挂号费(￥)',
    prop: 'registrationFee',
    minWidth: '200'
  },
  {
    label: '紧急情形附加费(￥)',
    prop: 'emergencySurcharge',
    minWidth: '200'
  }
]

export const sameWeightListCols = [
  {
    label: '国家/地区名称',
    prop: 'countryCnName',
    slotName: 'createdListSlot',
    minWidth: '200'
  },
  {
    label: '重量范围(g)',
    prop: 'weightRange',
    slotName: 'weightRangeSlot',
    minWidth: '200'
  },
  {
    label: '费用(￥)',
    prop: 'freight',
    minWidth: '200'
  },
  {
    label: '挂号费(￥)',
    prop: 'registrationFee',
    minWidth: '200'
  },
  {
    label: '紧急情形附加费(￥)',
    prop: 'emergencySurcharge',
    minWidth: '200'
  }
]
