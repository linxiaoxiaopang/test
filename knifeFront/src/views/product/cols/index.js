//图片列表
export const imageListCols = [
  {
    prop: 'title',
    label: '标题',
    minWidth: '200'
  },
  {
    prop: 'created_user_name',
    label: '创建用户',
    minWidth: '200',
    align: 'center'
  },
  {
    prop: 'category_name',
    label: '图片分类',
    minWidth: '200'
  },
  {
    prop: 'isShare',
    label: '共享状态',
    minWidth: '200',
    slotName: 'isShareSlot'
  },
  {
    prop: 'thumbnail_path',
    label: '图片',
    minWidth: 'auto',
    width: 150,
    isPic: true
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
    label: '图片分类',
    minWidth: '150',
    align: 'center',
    headerSlotName: 'category_nameHeaderSlot',
    slotName: 'category_nameSlot'
  }
]

//原型列表
export const protoListCols = [
  {
    prop: 'name',
    label: '原型名称'
  },
  {
    prop: 'category_name',
    label: '图片分类'
  },
  {
    prop: 'struct',
    label: '款式',
    minWidth: '180',
    slotName: 'structSlot'
  },
  {
    prop: 'sex',
    label: '适用性别',
    slotName: 'sexSlot'
  },
  {
    prop: 'season',
    label: '适用季节',
    slotName: 'seasonSlot'
  },
  {
    prop: 'sizes',
    label: '尺寸',
    minWidth: '200',
    slotName: 'sizesSlot'
  },
  {
    prop: 'prim_struct',
    label: '图片',
    minWidth: '300',
    slotName: 'prim_structSlot'
  }
]


export const protoSettingCols = [
  {
    prop: 'size',
    label: '尺码',
    align: 'center',
    slotName: 'sizeSlot'
  },
  {
    prop: 'weight',
    label: '重量(g)',
    align: 'center',
    required: true,
    slotName: 'weightSlot'
  },
  {
    prop: 'length',
    label: '长度(cm)',
    align: 'center',
    required: true,
    slotName: 'lengthSlot'
  },
  {
    prop: 'width',
    label: '宽度(cm)',
    align: 'center',
    required: true,
    slotName: 'widthSlot'
  },
  {
    prop: 'height',
    label: '高(cm)',
    align: 'center',
    required: true,
    slotName: 'heightSlot'
  },
  {
    prop: 'price',
    label: '价格(元)',
    align: 'center',
    required: true,
    slotName: 'priceSlot'
  }
]