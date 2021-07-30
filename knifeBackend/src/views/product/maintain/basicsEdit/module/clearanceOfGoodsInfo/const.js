import { isIntegerAndZero, isMoney } from '@/utils'

export const formOption = {
  menuBtn: false,
  span: 10,
  labelWidth: 140,
  column: [
    {
      label: '中文名称',
      prop: 'chinese_name',
      placeholder: '单行输入',
      rules: [
        {
          required: true,
          message: '请输入中文名称'
        }
      ]
    },
    {
      label: '英文名称',
      prop: 'english_name',
      placeholder: '单行输入',
      rules: [
        {
          required: true,
          message: '请输入英文名称'
        }
      ]
    },
    {
      label: '申报金额（USD）',
      prop: 'declared_amount',
      placeholder: '单行输入',
      rules: [
        {
          required: true,
          message: '请输入申报金额'
        },
        {
          validator: isMoney
        }
      ]
    },
    {
      label: '申报重量（g）',
      prop: 'declared_weight',
      placeholder: '单行输入',
      rules: [
        {
          required: true,
          message: '请输入申报重量'
        },
        {
          validator: isIntegerAndZero
        }
      ]
    },
    {
      label: '材质 (英文)',
      prop: 'declared_material',
      placeholder: '单行输入',
      rules: [
        {
          required: true,
          message: '请输入中文名称'
        }
      ]
    },
    {
      label: '海关编码',
      prop: 'customs_code',
      placeholder: '单行输入',
      rules: [
        {
          required: true,
          message: '请输入中文名称'
        }
      ]
    },
    {
      label: '用途',
      prop: 'purpose',
      placeholder: '单行输入'
    },
    {
      label: '报关属性',
      prop: 'declaration',
      type: 'checkbox',
      placeholder: '单行输入',
      span: 24
    }
  ]
}
