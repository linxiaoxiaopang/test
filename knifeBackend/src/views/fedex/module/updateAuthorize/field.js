import { requireFun } from '@/utils'

export default [
  {
    label: '账号名称',
    prop: 'accountName',
    name: 'accountName',
    colNum: 24,
    placeholder: '请輸入账号名称',
    rule: [
      {
        required: true,
        message: requireFun('账号名称')
      }
    ]
  }
]
