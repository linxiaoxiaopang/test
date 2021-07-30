
export const tableData = [
  {
    design: [
      {
        name: 'D001',
        id: 0
      },
      {
        name: 'D002',
        id: 1
      },
      {
        name: 'D003',
        id: 2
      },
      {
        name: 'D004',
        id: 3
      },
      {
        name: 'D005',
        id: 4
      },
      {
        name: 'D001',
        id: 0
      },
      {
        name: 'D002',
        id: 1
      },
      {
        name: 'D003',
        id: 2
      },
      {
        name: 'D004',
        id: 3
      },
      {
        name: 'D005',
        id: 4
      },
      {
        name: 'D001',
        id: 0
      },
      {
        name: 'D002',
        id: 1
      },
      {
        name: 'D003',
        id: 2
      },
      {
        name: 'D004',
        id: 3
      },
      {
        name: 'D005',
        id: 4
      }
    ],
    sortName: '包',
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
  editBtn: false,
  delBtn: false,
  column: [
    {
      label: '分类名称',
      prop: 'name',
      width: 300,
      search: true
    },
    {
      label: '款式名称',
      prop: 'designName',
      hide: true,
      search: true
    },
    {
      label: '款式',
      prop: 'design',
      slot: true
    }
  ]
}

// 添加/编辑分类 表单配置
export const sortOption = {
  column: [
    {
      label: '分类名称',
      prop: 'name',
      labelWidth: 100,
      rules: {
        required: true,
        message: '请输入分类名称'
      }
    }
  ]
}