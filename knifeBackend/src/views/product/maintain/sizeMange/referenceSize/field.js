import { requireFun } from '@/utils'

//参考尺码信息
export const referenceSizeField = [
  {
    label: '设计组块名',
    prop: 'name',
    name: 'name',
    colNum: 24,
    placeholder: '请输入设计组块名',
    slotName: 'nameSlot',
    rule: [
      {
        required: true,
        message: requireFun('设计组块名')
      }
    ]
  },
  {
    label: '区域选择图',
    prop: 'base_group_cover',
    name: 'base_group_cover',
    colNum: 24,
    placeholder: '请输入区域选择图',
    slotName: 'base_group_coverSlot',
    rule: [
      {
        required: true,
        message: requireFun('区域选择图')
      }
    ]
  },
  {
    label: '旋转角度',
    prop: 'show_rotate',
    name: 'show_rotate',
    colNum: 24,
    placeholder: '请输入旋转角度',
    slotName: 'show_rotateSlot',
    rule: [
      {
        required: true,
        message: requireFun('旋转角度')
      }
    ]
  }
]
