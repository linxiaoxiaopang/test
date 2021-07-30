//图片列表
export const imageListCols = [
  {
    prop: '',
    label: '定制产品名称',
    minWidth: '100'
  },
  {
    prop: '',
    label: '定制产品英文名',
    minWidth: '100'
  },
  {
    label: '原型名称',
    prop: '',
    minWidth: '60'
  },
  {
    label: '定制原图',
    minWidth: '50',
    slotName: 'originalMergeSlot'
  },
  {
    label: '款式',
    minWidth: '100',
    slotName: 'styleMergeSlot'
  },
  {
    label: '尺码',
    minWidth: '100',
    slotName: 'pictureMergeSlot'
  },
  {
    label: '分销商',
    minWidth: '80',
    prop: ''
  },
  {
    prop: '',
    label: '产生订单量',
    slotName: 'generateMergeSlot',
    minWidth: '100'
  },
  {
    label: '刀版图状态',
    slotName: 'basicMergeSlot',
    minWidth: 70
  },
  {
    label: '定制时间',
    minWidth: 120,
    slotName: 'timeMergeSlot',
    sortable: true
  }
]
