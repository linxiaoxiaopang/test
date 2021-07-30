
export const formOption = {
  labelWidth: 120,
  span: 24,
  submitText: '保存',
  column: [
    {
      label: '角色名称',
      prop: 'roleName',
      rules: {
        required: true,
        message: '请输入管理员名称'
      }
    },
    {
      label: '描述',
      prop: 'roleDescription',
      type: 'textarea'
    },
    {
      label: '角色权限',
      prop: 'roleRight',
      formslot: true,
      rules: {
        required: true,
        trigger: 'none'
      }
    }
  ]
}