import { requireFun } from '@/utils'

export const changeWaybillFiled = [
  {
    label: '选择物流',
    prop: 'expressCompanyId',
    name: 'expressCompanyId',
    placeholder: '请输入物流',
    colNum: 24,
    slotName: 'expressCompanyIdSlot',
    rule: [
      {
        required: true,
        message: requireFun('物流')
      }
    ]
  },
  {
    label: '换单单号',
    prop: 'expressWaybillCode',
    name: 'expressWaybillCode',
    placeholder: '输入换单单号',
    colNum: 24,
    rule: [
      {
        required: true,
        message: requireFun('换单单号'),
        trigger: 'blur'
      }
    ]
  },
  {
    label: '上传面单',
    prop: 'expressWaybillFilePath',
    name: 'expressWaybillFilePath',
    colNum: 24,
    slotName: 'expressWaybillFilePathSlot',
    rule: [
      {
        required: true,
        message: requireFun('面单')
      }
    ]
  }
]