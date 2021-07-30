export const formOption = {
  menuBtn: false,
  labelWidth: 88,
  column: [
    {
      label: '物流公司',
      prop: 'expressCompanyId',
      type: 'select',
      rules: [
        {
          required: true,
          message: '请选择物流方式'
        }
      ]
    },
    {
      label: '物流渠道',
      prop: 'shippingMethodId',
      type: 'select',
      props: {
        label: 'cnName',
        value: 'id'
      },
      rules: [
        {
          required: true,
          message: '请选择物流方式'
        }
      ]
    }
  ]
}