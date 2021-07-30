import { requireFun } from '@/utils'
import {
  is2And6char,
  isTele,
  isEmail
} from '@/utils/validate'
export default [
  {
    label: '昵称',
    prop: 'nick_name',
    name: 'nick_name',
    colNum: 24,
    placeholder: '请输入用户昵称',
    rule: [
      {
        required: true,
        message: requireFun('用户昵称')
      },
      {
        validator: is2And6char
      }
    ]
  },
  {
    label: '公司名称',
    prop: 'company',
    name: 'company',
    colNum: 24,
    placeholder: '请输入请公司名称'
  },
  {
    label: '邮箱',
    prop: 'email',
    name: 'email',
    colNum: 24,
    placeholder: '请输入邮箱',
    rule: [
      {
        validator: isEmail
      }
    ]
  },
  {
    label: '联系方式',
    prop: 'tele',
    name: 'tele',
    colNum: 24,
    placeholder: '请输入联系方式',
    rule: [
      {
        validator: isTele
      }
    ]
  }
]
