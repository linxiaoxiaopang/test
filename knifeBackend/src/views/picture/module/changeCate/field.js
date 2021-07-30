import { requireFun } from '@/utils'

export default [
  {
    label: '分类',
    prop: 'category',
    name: 'category',
    colNum: 24,
    placeholder: '请选择分类',
    slotName: 'categorySlot',
    rule: [
      {
        required: true,
        message: requireFun('分类')
      }
    ]
  },
  {
    label: '原图',
    prop: 'thumbnail_path',
    name: 'thumbnail_path',
    colNum: 24,
    slotName: 'thumbnail_pathSlot',
    placeholder: '请选择原图',
    rule: [
      {
        required: true,
        message: requireFun('原图')
      }
    ]
  }
]
