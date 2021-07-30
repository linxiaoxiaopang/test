//图片列表
export const imageListCols = [
  {
    label: '定制产品名称',
    minWidth: '100',
    prop: 'name'
    // slotName: 'designedCnNameMergeSlot'
  },
  {
    label: '定制产品英文名',
    slotName: 'designedEnNameMergeSlot',
    minWidth: '100'
  },
  {
    label: '原型名称',
    prop: 'name',
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
    prop: 'create_by_name'
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
    prop: 'create_time'
  }
]

export const designedListCols = [
  {
    label: '定制产品名称',
    minWidth: '200',
    slotName: 'chineseNameSlot'
  },
  {
    label: '定制产品英文名称',
    minWidth: '200',
    slotName: 'englishNameSlot'
  },
  {
    label: '款式',
    minWidth: '200',
    slotName: 'styleSlot'
  },
  {
    prop: '',
    label: '尺码',
    minWidth: '200',
    slotName: 'sizeSlot'
  },
  {
    label: '效果图',
    minWidth: '220',
    slotName: 'pictureSlot'
  }
]

export const basicListCols = [
  {
    label: '自定义sku',
    minWidth: '200',
    slotName: 'customSkuSlot'
  },
  {
    label: '外部sku',
    minWidth: '200',
    slotName: 'skuSlot'
  },
  {
    label: '刀版图',
    minWidth: '200',
    slotName: 'basicSlot'
  },
  {
    label: '刀版图是否生成',
    minWidth: '200',
    slotName: 'generateSlot'
  }
]
