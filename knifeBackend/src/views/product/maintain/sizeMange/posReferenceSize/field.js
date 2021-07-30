import { requireFun } from '@/utils'

//位置参考尺码信息
export const posReferenceSizeField = [
  {
    label: '设计模块名',
    prop: 'name',
    name: 'name',
    colNum: 24,
    placeholder: '请输入设计模块名',
    slotName: 'nameSlot',
    rule: [
      {
        required: true,
        message: requireFun('设计模块名')
      }
    ]
  },
  {
    label: '区域选择图',
    prop: 'base_group_cover',
    name: 'base_group_cover',
    colNum: 6,
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
    label: '设计区mask图',
    prop: 'base_group_mark',
    name: 'base_group_mark',
    colNum: 6,
    placeholder: '请输入设计区mask图',
    slotName: 'base_group_markSlot',
    rule: [
      {
        required: true,
        message: requireFun('设计区mask图')
      }
    ]
  }
]
