//图片列表
export const imageListCols = [
  {
    prop: 'merge',
    label: '图片',
    minWidth: '150',
    slotName: 'mergeSlot'
  },
  {
    prop: 'sizeMerge',
    label: '规格',
    minWidth: '150',
    slotName: 'sizeMergeSlot'
  },

  {
    prop: 'category_name',
    label: '图片分类'
  },
  {
    prop: 'create_time',
    label: '时间',
    align: 'center',
    slotName: 'create_timeSlot',
    minWidth: 100,
    sortable: true
  }
]
