//首重
export const fedexGoodDetailByFirstWeightCols = [
  {
    label: '重量范围',
    slotName: 'weightRangeSlot',
    noProp: true,
    minWidth: 150
  },
  {
    prop: 'startWeight',
    label: '开始重量(g)',
    minWidth: 150,
    slotName: 'startWeightSlot'
  },
  {
    prop: 'endWeight',
    label: '结束重量(g)',
    minWidth: 150,
    slotName: 'endWeightSlot'
  },
  {
    prop: 'firstWeight',
    label: '首重(g)',
    minWidth: 150,
    slotName: 'weightSlot'
  },
  {
    prop: 'firstFreight',
    label: '首重运费(￥)',
    minWidth: 150,
    slotName: 'priceSlot'
  },
  {
    prop: 'continuedWeight',
    label: '续重单位重量(g)',
    minWidth: 150,
    slotName: 'weightSlot'
  },
  {
    prop: 'continuedFreight',
    label: '续重单位价格(￥)',
    minWidth: 150,
    slotName: 'priceSlot'
  },
  {
    prop: 'registrationFee',
    label: '挂号费(￥)',
    minWidth: 150,
    slotName: 'priceSlot'
  },
  {
    prop: 'emergencySurcharge',
    label: '紧急附加费(￥)',
    minWidth: 150,
    slotName: 'priceSlot'
  }
]

//同等重
export const fedexGoodDetailBySameWeightCols = [
  {
    label: '重量范围',
    slotName: 'weightRangeSlot',
    noProp: true,
    minWidth: 150
  },
  {
    prop: 'startWeight',
    label: '开始重量(g)',
    minWidth: 150,
    slotName: 'startWeightSlot'
  },
  {
    prop: 'endWeight',
    label: '结束重量(g)',
    minWidth: 150,
    slotName: 'endWeightSlot'
  },
  {
    prop: 'freight',
    label: '费用(￥)',
    minWidth: 150,
    slotName: 'priceSlot'
  },
  {
    prop: 'registrationFee',
    label: '挂号费(￥)',
    minWidth: 150,
    slotName: 'priceSlot'
  },
  {
    prop: 'emergencySurcharge',
    label: '紧急附加费(￥)',
    minWidth: 150,
    slotName: 'priceSlot'
  }
]
