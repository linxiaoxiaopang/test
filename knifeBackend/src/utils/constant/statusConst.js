export const UP_STATUS = {
  0: {
    value: '0',
    label: '上传前',
    type: 'info'
  },
  1: {
    value: '1',
    label: '上传中',
    type: 'primary'
  },
  2: {
    value: '2',
    label: '处理中',
    type: 'warning'
  },
  3: {
    value: '3',
    label: '处理成功',
    type: 'success'
  },
  4: {
    value: '4',
    label: '处理失败',
    type: 'danger'
  }
}

export const COLOR_STATUS = [
  'warning',
  'primary',
  'success',
  'info',
  'danger',
  'warning'
]

export const SYS_NO = 0
export const SYS_YES = 1

// 物流公司是否授权
export const EXPRESS_DOCK_API_DIC = [
  {
    label: '未授权',
    value: SYS_NO
  },
  {
    label: '已授权',
    value: SYS_YES
  }
]

export const EXPRESS_ACCOUNT_AUTH_DIC = [
  {
    label: '未授权',
    value: SYS_NO
  },
  {
    label: '已授权',
    value: SYS_YES
  }
]

export const EXPRESS_CHANNEL_ENABLED_DIC = [
  {
    label: '未授权',
    value: SYS_NO
  },
  {
    label: '已授权',
    value: SYS_YES
  }
]
