import { requireFun } from '@/utils'

export default [
  {
    label: '角色名称',
    prop: 'name',
    name: 'name',
    colNum: 24,
    placeholder: '例如：业务员、设计师',
    slotName: 'nameSlot',
    rule: [
      {
        required: true,
        message: requireFun('角色名称')
      }
    ]
  },
  {
    label: '角色说明',
    prop: 'desc',
    name: 'desc',
    colNum: 24,
    placeholder: '请用一句话介绍角色和职责和作用，方便您或其他管理员查看',
    slotName: 'descSlot',
    rule: [
      {
        required: true,
        message: requireFun('角色说明')
      }
    ]
  },
  {
    label: '菜单分配',
    prop: 'menus',
    name: 'menus',
    colNum: 12,
    slotName: 'menusSlot'
  },

  {
    label: '权限分配',
    prop: 'permissions',
    name: 'permissions',
    colNum: 12,
    slotName: 'permissionsSlot'
  }
]
