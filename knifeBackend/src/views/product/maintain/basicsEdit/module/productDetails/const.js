import { isInteger } from '@/utils'

export const formOption = {
  menuBtn: false,
  span: 10,
  column: [
    {
      label: '原型名称',
      prop: 'name',
      rules: [
        {
          required: true,
          message: '请输入原型名称'
        }
      ]
    },
    {
      label: '英文名称',
      prop: 'english_name'
    },
    {
      label: '生产工艺',
      prop: 'technology',
      placeholder: '输入工艺名称，如：UV喷印 '
    },
    {
      label: '原型材质',
      prop: 'material',
      placeholder: '输入原型材质，如：棉'
    },
    {
      label: '发货时效',
      prop: 'deliveryTime',
      minProp: 'delivery_time_min',
      maxProp: 'delivery_time_max',
      span: 24,
      formslot: true,
      rules: [
        {
          validator: isInteger
        }
      ]
    },
    {
      label: '其他描述',
      prop: 'detail',
      span: 24,
      formslot: true
    }
  ]
}
