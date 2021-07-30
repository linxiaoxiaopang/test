import { requireFun } from '@/utils'
import { is2And6char, is4And20char, isW, isRobust, isEmail } from '@/utils/validate'
export const addUserField = [
  {
    label: '分销商名称',
    prop: 'nick_name',
    name: 'nick_name',
    colNum: 24,
    placeholder: '请输入分销商名称',
    rule: [
      {
        required: true,
        message: requireFun('分销商名称')
      }
    ]
  },
  {
    label: '登陆账号',
    prop: 'username',
    name: 'username',
    colNum: 24,
    placeholder: '请输登陆账号',
    rule: [
      {
        required: true,
        message: requireFun('登陆账号')
      }
    ]
  },
  {
    label: '用户邮箱',
    prop: 'email',
    name: 'email',
    colNum: 24,
    placeholder: '请输入用户邮箱',
    rule: [
      {
        required: true,
        message: requireFun('用户邮箱')
      }
    ]
  },
  {
    label: '密码',
    prop: 'password',
    name: 'password',
    colNum: 24,
    type: 'password',
    placeholder: '请输入密码',
    rule: [
      {
        required: true,
        message: requireFun('密码')
      }
    ]
  },
  {
    label: '确认密码',
    prop: 'password2',
    name: 'password2',
    colNum: 24,
    type: 'password',
    placeholder: '请输入确认密码',
    rule: [
      {
        required: true,
        message: requireFun('确认密码')
      }
    ]
  }
]

export const editUserField = [
  {
    label: '分销商名称',
    prop: 'nick_name',
    name: 'nick_name',
    colNum: 24,
    placeholder: '请输入分销商名称',
    rule: [
      {
        required: true,
        message: requireFun('分销商名称')
      }
    ]
  },
  {
    label: '登陆账号',
    prop: 'username',
    name: 'username',
    colNum: 24,
    placeholder: '请输登陆账号',
    rule: [
      {
        required: true,
        message: requireFun('登陆账号')
      }
    ]
  },
  {
    label: '用户邮箱',
    prop: 'email',
    name: 'email',
    colNum: 24,
    placeholder: '请输入用户邮箱',
    rule: [
      {
        required: true,
        message: requireFun('用户邮箱')
      }
    ]
  },
  {
    label: '选择角色',
    prop: 'roles',
    name: 'roles',
    colNum: 24,
    slotName: 'rolesSlot'
  }

]
