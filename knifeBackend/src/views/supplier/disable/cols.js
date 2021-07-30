export default [
  {
    prop: 'company',
    label: '公司名称',
    align: 'center'
  },
  {
    prop: 'nick_name',
    label: '用户昵称',
    width: '80',
    align: 'left'
  },
  {
    prop: 'tele',
    label: '用户昵称',
    align: 'center'
  },
  {
    prop: 'email',
    label: '登录账号',
    align: 'center'
  },
  {
    prop: 'create_time',
    label: '时间',
    align: 'center',
    slotName: 'create_timeSlot',
    minWidth: 100,
    sortable: true
  },
  {
    prop: 'is_active',
    label: '激活状态',
    slotName: 'is_activeName',
    align: 'center'
  },
  {
    prop: 'disable_reason',
    label: '禁用备注',
    align: 'center',
    minWidth: 100
  }
]
