import { requireFun } from '@/utils'

export default [
  {
    label: '历史原图',
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
  },
  {
    label: '更换原图',
    prop: 'path',
    name: 'path',
    colNum: 24,
    placeholder: '请选择更换原图',
    slotName: 'pathSlot',
    rule: [
      {
        required: true,
        message: requireFun('更换原图')
      }
    ]
  }
]
