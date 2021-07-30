export const tableOption = {
  selection: true,
  editBtn: false,
  delBtn: false,
  column: [
    {
      label: '产品名称',
      prop: 'name',
      minWidth: 180,
      search: true
    },
    {
      label: '款式名称',
      prop: 'struct_name',
      search: true,
      hide: true
    },
    {
      label: '款式',
      prop: 'design',
      minWidth: 200,
      slot: true
    },
    {
      label: '工厂分类',
      prop: 'factory_name',
      minWidth: 100
      // slot: true,
    },
    {
      label: '同步时间',
      prop: 'create_time',
      width: 180
      // slot: true,
    }
    /*{
         label: '坐标图下载状态',
         prop: 'coordinate',
      },
      {
         label: '白板图下载状态',
         prop: 'whiteboard',
      },*/
  ]
}
