import { validatAlphabets } from '@/utils/validate'

export default [
  {
    label: '产品名称',
    prop: 'productName',
    name: 'productName',
    placeholder: '请输入产品名称',
    colNum: 12
  },
  {
    label: '英文名称',
    prop: 'englishName',
    name: 'englishName',
    colNum: 12,
    placeholder: '请输入英文名称',
    slotName: 'englishNameSlot',
    rule: [
      {
        validator: validatAlphabets
      }
    ]
  },
  {
    label: '描述',
    prop: 'desc',
    name: 'desc',
    colNum: 24,
    placeholder: '请输入描述',
    slotName: 'descSlot'
  }
]
