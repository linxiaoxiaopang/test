import {isContactPhone} from '@/utils'

export default [
  {
    label: '姓名',
    prop: 'senderName',
    name: 'senderName',
    colNum: 24,
    placeholder: '请输入姓名'
  },
  {
    label: '公司',
    prop: 'senderCompanyName',
    name: 'senderCompanyName',
    colNum: 24,
    placeholder: '选填项'
  },
  {
    label: '国家',
    prop: 'countryCode',
    name: 'countryCode',
    colNum: 24,
    placeholder: '请输入国家'
  },
  {
    label: '区域',
    prop: 'administrativeArea',
    name: 'administrativeArea',
    colNum: 24,
    slotName: 'administrativeAreaSlot',
    placeholder: '请选择区域'
  },
  {
    label: '省份',
    prop: 'provinceCode',
    name: 'provinceCode',
    colNum: 24,
    hidden: true,
    placeholder: '请输入省份'
  },
  {
    label: '城市',
    prop: 'cityCode',
    name: 'cityCode',
    colNum: 24,
    hidden: true,
    placeholder: '请输入城市'
  },
  {
    label: '详细地址',
    prop: 'detailAddress',
    name: 'detailAddress',
    colNum: 24,
    placeholder: '请输入详细地址'
  },
  {
    label: '邮编',
    prop: 'postCode',
    name: 'postCode',
    colNum: 24,
    placeholder: '请输入邮编'
  },
  {
    label: '电话',
    prop: 'phoneNumber',
    name: 'phoneNumber',
    colNum: 24,
    placeholder: '请输入电话',
    rule: [
      {
        validator: isContactPhone,
        message: '请输入正确的电话'
      }
    ]
  }
]
