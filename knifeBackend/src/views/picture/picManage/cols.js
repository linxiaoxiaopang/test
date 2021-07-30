//图片列表
export const imageListCols = [
  {
    prop: 'merge',
    label: '图片名称',
    minWidth: '100',
    slotName: 'mergeSlot'
  },
  {
    prop: 'category_name',
    label: '图片分类'
  },
  {
    label: '图片',
    minWidth: '60',
    slotName: 'picMergeSlot'
  },
  {
    prop: 'sizeMerge',
    label: '格式',
    minWidth: '50',
    slotName: 'sizeMergeSlot'
  },
  {
    label: '尺寸',
    minWidth: '80',
    slotName: 'picSizeMergeSlot'
  },
  {
    label: '定制产品数',
    minWidth: '100',
    slotName: 'designedMergeSlot'
  },
  {
    prop: 'created_user_name',
    label: '上传分销商',
    minWidth: '100'
  },
  {
    prop: 'create_time',
    label: '上传时间',
    align: 'center',
    slotName: 'create_timeSlot',
    minWidth: 100,
    sortable: true
  },
  {
    label: '状态',
    minWidth: 50,
    slotName: 'stateMergeSlot'
  }
]
