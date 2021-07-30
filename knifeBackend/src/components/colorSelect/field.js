import { requireFun } from '@/utils'
import { is2And6char } from '@/utils/validate'

export const colorsFiled = [
  {
    label: '颜色名称',
    prop: 'color_name',
    name: 'color_name',
    colNum: 24,
    placeholder: '颜色名称',
    rule: [
      {
        required: true,
        message: requireFun('颜色名称')
      },
      {
        validator: is2And6char
      }
    ]
  },
  {
    label: '选择色块',
    prop: 'color_value',
    name: 'color_value',
    colNum: 24,
    placeholder: '请选择色块',
    slotName: 'color_valueSlot',
    rule: [
      {
        required: true,
        message: requireFun('色块')
      }
    ]
  }
]
