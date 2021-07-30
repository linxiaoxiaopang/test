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
    prop: 'created_user_name',
    label: '上传用户',
    align: 'center'
  },
  {
    prop: 'create_time',
    label: '时间',
    align: 'center',
    slotName: 'create_timeSlot',
    minWidth: 100,
    sortable: true
  },
  {
    prop: 'disable_reason',
    label: '禁用备注',
    align: 'center',
    minWidth: 100
  }
]

//上传图片table列表
export const uploadTableDialogCols = [
  {
    prop: 'thumbnail_path',
    label: '图片',
    minWidth: '100',
    align: 'center',
    slotName: 'pathSlot'
  },
  {
    prop: 'title',
    label: '标题',
    minWidth: '200',
    align: 'center'
  },
  {
    prop: 'exist',
    label: '图片状态',
    minWidth: '200',
    align: 'center',
    slotName: 'existSlot'
  },
  {
    prop: 'category_name',
    label: '图片分类1',
    minWidth: '150',
    align: 'center',
    headerSlotName: 'category_nameHeaderSlot',
    slotName: 'category_nameSlot'
  }
]
