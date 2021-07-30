import { requireFun } from '@/utils'

export const factoryCateFiled = [
  {
    label: '分类名称',
    prop: 'name',
    name: 'name',
    colNum: 24,
    rule: [
      {
        required: true,
        message: requireFun('分类名称')
      }
    ]
  }
]
   