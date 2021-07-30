//参考尺码管理
export const referenceSizeCols = [
  {
    prop: 'merge',
    label: '展示图/原型名称/海关编号',
    slotName: 'mergeSlot',
    minWidth: 200
  },
  {
    prop: 'category_name',
    label: '原型分类'
  },
  {
    prop: 'struct',
    label: '款式',
    slotName: 'structSlot',
    minWidth: 200
  },

  {
    prop: 'sizes',
    label: '尺码',
    minWidth: 200,
    slotName: 'sizesSlot'
  },
  {
    prop: 'create_time',
    label: '添加时间',
    slotName: 'create_timeSlot'
  },
  {
    prop: 'base_sizes',
    label: '参考尺码',
    slotName: 'base_sizesSlot'
  }
]
