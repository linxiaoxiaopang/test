import { requireFun } from '@/utils'
import { isInteger } from '@/utils/validate'
//新增顶级图库类型
export const addFedexFiled = [
  {
    label: '物流名称',
    prop: 'companyName',
    name: 'companyName',
    placeholder: '请输入物流名称',
    colNum: 24,
    rule: [
      {
        required: true,
        message: requireFun('物流名称')
      }
    ]
  },
  {
    label: '物流周期',
    prop: 'logisticsCycle',
    name: 'logisticsCycle',
    placeholder: '请输入物流周期',
    colNum: 24,
    rule: [
      {
        required: true,
        message: requireFun('物流周期')
      },
      {
        validator: isInteger
      }
    ]
  },
  {
    label: '物流类型',
    prop: 'isCustomsDeclare',
    name: 'isCustomsDeclare',
    colNum: 24,
    placeholder: '请输入物流类型',
    slotName: 'isCustomsDeclareSlot',
    rule: [
      {
        required: true,
        message: requireFun('物流类型')
      }
    ]
  }
]

//编辑顶级图库类型
export const reditFedexFiled = [
  {
    label: '物流名称',
    prop: 'companyName',
    name: 'companyName',

    placeholder: '请输入物流名称',
    colNum: 24,
    // slotName: 'nameSlot',
    rule: [
      {
        required: true,
        message: requireFun('物流名称')
      }
    ]
  },
  {
    label: '物流周期',
    prop: 'logisticsCycle',
    name: 'logisticsCycle',
    placeholder: '请输入物流周期',
    colNum: 24,
    rule: [
      {
        required: true,
        message: requireFun('物流周期')
      },
      {
        validator: isInteger
      }
    ]
  },
  {
    label: '物流类型',
    prop: 'isCustomsDeclare',
    name: 'isCustomsDeclare',
    colNum: 24,
    placeholder: '请输入物流类型',
    slotName: 'isCustomsDeclareSlot',
    rule: [
      {
        required: true,
        message: requireFun('物流类型')
      }
    ]
  }
]
