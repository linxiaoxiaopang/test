
export const tableData = [
  {
    orderId: 'ikowli_2266wgw',
    channel: '云途',
    Waybill: '233465452699',
    salesman: '邓伦',
    expire: '2天',
    daoState: '已生成',
    ImportTime: '2021-01-04  17:31:04',
    deliverGoods: '2021-01-10  08:22:11',
    state: '待排单',
    shoujian: '小雪雪',
    address: '四川省成都市青羊区125号',
    kuaidi: '运输中',
    shouji: '13546513545',
    wuliu: [{
      content: '活动按期开始',
      timestamp: '2018-04-15'
    }, {
      content: '通过审核',
      timestamp: '2018-04-13'
    }, {
      content: '创建成功',
      timestamp: '2018-04-11'
    }],
    erzima: '11122',
    mail: '12223',
    sheng: '福建',
    city: '泉州',
    dianhua: '1234567899',
    sku: '15djsyds',
    number: '52'
  }
]

export const tableOption = {
  searchText: '发货',
  editBtn: false,
  delBtn: false,
  column: [
    {
      label: '订单号',
      prop: 'orderCode',
      width: 180
    },
    {
      label: '运单号',
      prop: 'expressWaybillCode',
      width: 180,
      search:true,
      searchSpan: 7
    },
    {
      label: '物流方式',
      prop: 'expressCompanyId',
      type: 'select'
    },
    {
      label: '物流到期时间',
      prop: 'expressExpireTime'
    },
    {
      label: '导入用户',
      prop: 'importUserName'
    },
    {
      label: '面单附件上传',
      prop: 'expressWaybillIsUploaded',
      type: 'select'
    },
    {
      label: '导入时间',
      prop: 'importTime',
      width: 180
    },
    {
      label: '状态',
      prop: 'orderStatus',
      type: 'select'
    }
  ]
}