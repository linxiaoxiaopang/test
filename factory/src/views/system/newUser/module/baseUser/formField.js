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
    label: '用户昵称',
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
    label: '登录账号',
    prop: 'username',
    name: 'username',
    colNum: 24,
    placeholder: '请输入请输入登录账号',
    rule: [
      {
        required: true,
        message: requireFun('登录账号')
      },
      {
        validator: isW
      },
      {
        validator: is4And20char
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
  },
  {
    label: '设置密码',
    prop: 'password',
    name: 'password',
    placeholder: '请输入密码',
    colNum: 24,
    slotName: 'passwordSlot',
    rule: [
      {
        required: true,
        message: requireFun('密码')
      },
      {
        validator: isRobust
      }
    ]
  },
  {
    label: '确认密码',
    prop: 'password2',
    name: 'password2',
    colNum: 24,
    slotName: 'password2Slot',
    placeholder: '请再次输入密码',
    rule: [
      {
        required: true,
        message: requireFun('确认密码')
      },
      {
        validator: isRobust
      }
    ]
  },
  {
    label: '选择角色',
    prop: 'roles',
    name: 'roles',
    colNum: 24,
    slotName: 'rolesSlot',
    rule: [
      {
        required: true,
        message: requireFun('角色选择'),
        trigger: 'blur'
      }
    ]
  }
]

export const editUserField =  [
  {
    label: '用户昵称',
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
    label: '登录账号',
    prop: 'username',
    name: 'username',
    readonly: true,
    colNum: 24,
    placeholder: '请输入请输入登录账号',
    rule: [
      {
        required: true,
        message: requireFun('登录账号')
      },
      {
        validator: isW
      },
      {
        validator: is4And20char
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
  },
  {
    label: '选择角色',
    prop: 'roles',
    name: 'roles',
    colNum: 24,
    slotName: 'rolesSlot',
    rule: [
      {
        required: true,
        message: requireFun('角色选择'),
        trigger: 'blur'
      }
    ]
  }
]
