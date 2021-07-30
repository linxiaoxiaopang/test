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