import { requireFun } from '@/utils'
import {
  is2And6char,
  is4And20char,
  isW,
  isRobust,
  isEmail
} from '@/utils/validate'
export const addUserField = [
  {
    label: '供应商名称',
    prop: 'name',
    name: 'name',
    colNum: 24,
    placeholder: '请输入供应商名称',
    rule: [
      {
        required: true,
        message: requireFun('供应商名称')
      },
      {
        validator: is2And6char
      }
    ]
  },
  {
    label: '联系人',
    prop: 'contacts',
    name: 'contacts',
    colNum: 24,
    placeholder: '请输入请输入联系人',
    rule: [
      {
        required: true,
        message: requireFun('登录联系人')
      },
      {
        validator: is4And20char
      }
    ]
  },
  {
    label: '联系方式',
    prop: 'phone',
    name: 'phone',
    colNum: 24,
    placeholder: '请输入请输入联系方式',
    rule: [
      {
        required: true,
        message: requireFun('联系方式')
      }
    ]
  },
  {
    label: '用户邮箱',
    prop: 'email',
    name: 'email',
    colNum: 24,
    placeholder: '请输入请输入用户邮箱',
    rule: [
      {
        required: true,
        message: requireFun('用户邮箱')
      },
      {
        validator: isEmail
      }
    ]
  }
]

export const editUserField = [
  {
    label: '供应商名称',
    prop: 'name',
    name: 'name',
    colNum: 24,
    placeholder: '请输入供应商名称',
    rule: [
      {
        required: true,
        message: requireFun('供应商名称')
      },
      {
        validator: is2And6char
      }
    ]
  },
  {
    label: '联系人',
    prop: 'contacts',
    name: 'contacts',
    colNum: 24,
    placeholder: '请输入请输入联系人',
    rule: [
      {
        required: true,
        message: requireFun('登录联系人')
      },
      {
        validator: is4And20char
      }
    ]
  },
  {
    label: '联系方式',
    prop: 'phone',
    name: 'phone',
    colNum: 24,
    placeholder: '请输入请输入联系方式',
    rule: [
      {
        required: true,
        message: requireFun('联系方式')
      }
    ]
  },
  {
    label: '用户邮箱',
    prop: 'email',
    name: 'email',
    colNum: 24,
    placeholder: '请输入请输入用户邮箱',
    rule: [
      {
        required: true,
        message: requireFun('用户邮箱')
      },
      {
        validator: isEmail
      }
    ]
  }
]
