export const formOption = {
  menuBtn: false,
  span: 5,
  column: [
    {
      label: '原型分类',
      prop: 'category',
      rules: [
        {
          required: true,
          message: '请选择原型分类'
        }
      ],
      formslot: true
    },
    {
      label: '适用人群',
      prop: 'sex',
      type: 'select'
    },
    {
      label: '适用季节',
      prop: 'season',
      type: 'select'
    },
    {
      label: '原型等级',
      prop: 'level',
      type: 'select'
    }
  ]
}

export const tabs = [
  {
    label: '原型详情',
    value: 'productDetails'
  },
  {
    label: '款式尺码',
    value: 'productSPEC'
  },
  {
    label: '原型尺码表',
    value: 'packSPEC'
  },
  {
    label: '报关信息',
    value: 'clearanceOfGoodsInfo'
  }
]
