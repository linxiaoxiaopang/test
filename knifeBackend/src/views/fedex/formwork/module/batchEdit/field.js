import { requireFun } from '@/utils'

export const editImageTypeFiled = [
  {
    label: '所属分类',
    prop: 'parent',
    name: 'parent',
    colNum: 24,
    placeholder: '请输入图库名称',
    slotName: 'parentSlot'
  },
  {
    label: '图库名称',
    prop: 'name',
    name: 'name',
    colNum: 24,
    placeholder: '请输入图库名称',
    rule: [
      {
        required: true,
        message: requireFun('图库名称')
      }
    ]
  }
]
