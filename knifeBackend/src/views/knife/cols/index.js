//已经上传的订单列表
export const structInfoCols = [
  {
    prop: 'sturctName',
    label: '款式名称',
    align: 'center',
    slotName: 'sturctNameSlot'
  },
  {
    prop: 'kind',
    label: '规格',
    align: 'center',
    slotName: 'kindSlot'
  },
  {
    prop: 'code',
    label: '尺码',
    align: 'center'
  },
  {
    prop: 'weight',
    label: '重量(g)',
    align: 'center',
    required: true,
    slotName: 'weightSlot'
  },
  {
    prop: 'volume',
    label: '体积(L)',
    align: 'center',
    required: true,
    slotName: 'volumeSlot'
  },
  {
    prop: 'price',
    label: '价格(元)',
    align: 'center',
    required: true,
    slotName: 'priceSlot'
  }
]
