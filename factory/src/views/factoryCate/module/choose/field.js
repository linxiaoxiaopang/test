import { requireFun } from '@/utils'

export default [
  {
    label: '分类名称',
    prop: 'name',
    name: 'name',
    colNum: 24,
    slotName: 'nameSlot',
    rule: [
      {
        required: true,
        message: requireFun('分类名称')
      }
    ]
  },
  {
    label: '款式',
    prop: 'prim_structs',
    name: 'prim_structs',
    colNum: 24,
    slotName: 'prim_structsSlot',
    rule: [
      {
        required: true,
        message: requireFun('款式')
      }
    ]
  }
]
