import { formatDate } from '@/utils'
let currentDate = formatDate(new Date())
let importTime = [currentDate, currentDate]
export const tableOption = {
  selection: true,
  selectable: (row, index) => {
    return index % 2 == 1
  },
  editBtn: false,
  delBtn: false,
  column: [
    {
      label: '产品信息',
      prop: 'productInfo',
      slot: true,
      overHidden: true,
      minWidth: 188
    },
    {
      label: 'SKU',
      prop: 'productInternalSkuCode',
      minWidth: 200
    },
    {
      label: '导入用户',
      prop: 'userName',
      searchSpan: 7
    },
    {
      label: '面单附件上传',
      prop: 'expressWaybillIsUploaded',
      type: 'select'
    },
    {
      label: '状态',
      prop: 'factoryStatus'
    },
    {
      label: '时间',
      prop: 'importTime',
      slot: true,
      valueFormat: 'yyyy-MM-dd',
      search: true,
      type: 'daterange',
      searchSpan: 8,
      searchValue: importTime,
      width: 180
    },
    {
      label: '款式',
      prop: 'structName',
      search: true,
      hide: true
    },
    {
      label: '状态',
      prop: 'orderStatus',
      hide: true,
      search: true,
      minWidth: 120,
      type: 'select',
      dicData: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '已发货',
          value: 70
        },
        {
          label: '生产中',
          value: 42
        },
        {
          label: '已过期',
          value: 29
        }
      ]
    }
  ]
}
