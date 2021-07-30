import { requireFun } from '@/utils'
// 正常
export const normalFile = [
  {
    label: '账号名称',
    prop: 'accountName',
    name: 'accountName',
    colNum: 24,
    placeholder: '自定义账号名称，方便多账号管理。',
    rule: [
      {
        required: true,
        message: requireFun('账号名称')
      }
    ]
  },
  {
    label: '客户编号',
    prop: 'customerCode',
    name: 'customerCode',
    colNum: 24,
    placeholder: '请输入客户编号',
    rule: [
      {
        required: true,
        message: requireFun('客户编号')
      }
    ]
  },
  {
    label: 'ApiSecret',
    prop: 'clientSecret',
    name: 'clientSecret',
    colNum: 24,
    placeholder: '请输入ApiSecret',
    rule: [
      {
        required: true,
        message: requireFun('ApiSecret')
      }
    ]
  },
  {
    label: 'clientId',
    prop: 'clientId',
    name: 'clientId',
    colNum: 24,
    placeholder: '请输入clientId',
    rule: [
      {
        required: true,
        message: requireFun('clientId')
      }
    ]
  }
]
// 邮政
export const emsFile = [
  {
    label: '账号名称',
    prop: 'accountName',
    name: 'accountName',
    colNum: 24,
    placeholder: '自定义账号名称，方便多账号管理。',
    rule: [
      {
        required: true,
        message: requireFun('账号名称')
      }
    ]
  },
  {
    label: '大客户代码',
    prop: 'clientId',
    name: 'clientId',
    colNum: 24,
    placeholder: '请输入大客户代码',
    rule: [
      {
        required: true,
        message: requireFun('大客户代码')
      }
    ]
  },
  {
    label: '密钥',
    prop: 'clientSecret',
    name: 'clientSecret',
    colNum: 24,
    placeholder: '请输入密钥',
    rule: [
      {
        required: true,
        message: requireFun('密钥')
      }
    ]
  },
  {
    label: '揽件编号',
    prop: 'whCode',
    name: 'whCode',
    colNum: 24,
    placeholder: '请输入揽件机构编号',
    rule: [
      {
        required: true,
        message: requireFun('揽件机构编号')
      }
    ]
  }
]
// 云途
export const yotoFile = [
  {
    label: '账号名称',
    prop: 'accountName',
    name: 'accountName',
    colNum: 24,
    placeholder: '自定义账号名称，方便多账号管理。',
    rule: [
      {
        required: true,
        message: requireFun('账号名称')
      }
    ]
  },
  {
    label: '客户编码',
    prop: 'clientId',
    name: 'clientId',
    colNum: 24,
    placeholder: '请输入客户编码',
    rule: [
      {
        required: true,
        message: requireFun('客户编码')
      }
    ]
  },
  {
    label: '密钥',
    prop: 'clientSecret',
    name: 'clientSecret',
    colNum: 24,
    placeholder: '请输入密钥',
    rule: [
      {
        required: true,
        message: requireFun('密钥')
      }
    ]
  }
]
// 递四方
export const disifangFile = [
  {
    label: '账号名称',
    prop: 'accountName',
    name: 'accountName',
    colNum: 24,
    placeholder: '自定义账号名称，方便多账号管理。',
    rule: [
      {
        required: true,
        message: requireFun('账号名称')
      }
    ]
  }
]