import { requireFun } from '@/utils'

export const enclosureFiled = [
  {
    label: '附件',
    prop: 'attachmentFilePath',
    name: 'attachmentFilePath',
    colNum: 24,
    slotName: 'attachmentFilePathSlot',
    rule: [
      {
        required: true,
        message: requireFun('附件')
      }
    ]
  }
]