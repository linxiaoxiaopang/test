
export const formOption = {
  labelWidth: 120,
  span: 24,
  submitText: '保存',
  column: [
    {
      label: '管理员名称',
      prop: 'username',
      rules: {
        required: true,
        message: '请输入管理员名称'
      }
    },
    {
      label: '管理员账号',
      prop: 'userAccount',
      rules: {
        required: true,
        message: '请输入管理员账号'
      }
    },
    {
      label: '登录密码',
      prop: 'password',
      type: 'password',
      rules: {
        required: true,
        message: '请输入登录密码'
      }
    },
    {
      label: '密码确认',
      prop: 'confirmPsw',
      type: 'password',
      rules: {
        required: true
      }
    },
    {
      label: '所属角色',
      prop: 'role',
      rules: {
        required: true,
        message: '请输入所属角色'
      },
      type: 'select',
      dicData: [
        {
          label: '订单管理员',
          value: '0'
        }
      ]
    }
  ]
}