//已经上传的订单列表
export const orderListCols = [
  {
    prop: 'order_code',
    label: '订单号',
    align: 'center'
  },
  {
    prop: 'waybill',
    label: '运单号',
    align: 'center',
    width: 180,
    slotName: 'waybillSlot'
  },
  {
    prop: 'order_status',
    label: '订单状态',
    align: 'center',
    slotName: 'order_statusSlot'
  },
  {
    prop: 'weight',
    label: '重量（克）',
    align: 'center',
    width: 250,
    slotName: 'weightSlot'
  },
  {
    prop: 'sale_date',
    label: '下单日期',
    align: 'center',
    slotName: 'sale_dateSlot'
  },
  {
    prop: 'fedex',
    label: '快递',
    align: 'center',
    slotName: 'fedexSlot'
  },
  {
    prop: 'salesman',
    label: '业务员',
    align: 'center'
  },

  {
    prop: 'expiration_time',
    label: '快递到期时间',
    align: 'center',
    slotName: 'expiration_timeSlot'
  },
  {
    prop: 'remarks',
    label: '备注',
    align: 'center',
    slotName: 'remarksSlot'
  },

  {
    prop: 'delivery_time',
    label: '发货时间',
    align: 'center',
    slotName: 'delivery_timeSlot'
  }
  // {
  //   prop: "product",
  //   label: "产品信息",
  //   align: "center",
  //   children: [
  //     {
  //       prop: "SKU",
  //       label: "货号",
  //       align: "center"
  //     },
  //     {
  //       prop: "cover",
  //       label: "效果图",
  //       align: "center",
  //       width: 100
  //     },
  //     {
  //       prop: "count",
  //       label: "数量",
  //       width: 80,
  //       align: "center"
  //     }
  //   ]
  // }
]

export const productListCols = [
  {
    prop: 'cover',
    label: '图片',
    align: 'center',
    slotName: 'cover'
  },
  {
    prop: 'SKU',
    label: '货号',
    align: 'center'
  },

  {
    prop: 'count',
    label: '数量',
    align: 'center'
  },
  {
    prop: 'cover1',
    label: '图片',
    align: 'center',
    slotName: 'cover1'
  },
  {
    prop: 'SKU1',
    label: '货号',
    align: 'center'
  },
  {
    prop: 'count1',
    label: '数量',
    align: 'center'
  }
]

export const passOrderListCols = [
  {
    prop: 'order_code',
    label: '订单号',
    align: 'center'
  },
  {
    prop: 'waybill',
    label: '运单号',
    align: 'center'
  },
  {
    prop: 'order_status',
    label: '订单状态',
    align: 'center',
    minWidth: 100,
    slotName: 'order_statusSlot'
  },
  {
    prop: 'weight',
    label: '重量（克）',
    align: 'center',
    minWidth: 130
  },
  {
    prop: 'sale_date',
    label: '下单日期',
    align: 'center',
    slotName: 'sale_dateSlot'
  },
  {
    prop: 'expiration_time',
    label: '快递到期时间',
    align: 'center',
    slotName: 'expiration_timeSlot'
  },
  {
    prop: 'fedex',
    label: '快递',
    align: 'center',
    slotName: 'fedexSlot'
  },
  {
    prop: 'delivery_time',
    label: '发货时间',
    align: 'center',
    slotName: 'delivery_timeSlot'
  },
  {
    prop: 'salesman',
    label: '业务员',
    align: 'center'
  },

  {
    prop: 'product',
    label: '产品信息',
    align: 'center',
    children: [
      {
        prop: 'SKU',
        label: 'SKU',
        align: 'center'
      },
      {
        prop: 'cover',
        label: '封面',
        align: 'center',
        width: 100
      },
      {
        prop: 'count',
        label: '数量',
        minWidth: 200,
        align: 'center'
      }
    ]
  }
]

export const processCols = [
  {
    prop: 'batch_group',
    label: '批次',
    align: 'center',
    slotName: 'batch_groupSlot'
  },
  {
    prop: 'SKU',
    label: 'SKU',
    align: 'center'
  },
  {
    prop: 'department',
    label: '部门',
    align: 'center'
  },
  {
    prop: 'salesman',
    label: '业务员',
    align: 'center'
  },
  {
    prop: 'factory_cate',
    label: '工厂分类',
    align: 'center'
  },
  {
    prop: 'export_time',
    label: '下单日期',
    align: 'center',
    slotName: 'export_timeSlot'
  },
  {
    prop: 'kl_path',
    label: '刀版图',
    align: 'center',
    slotName: 'kl_pathSlot'
  },
  {
    prop: 'count',
    label: '质检情况',
    align: 'center',
    minWidth: 180,
    slotName: 'countSlot'
  },
  {
    prop: 'isPrint',
    label: '打印状态',
    align: 'center',
    slotName: 'isPrintSlot'
  }
]

//刀版图
export const factorySnifeistCols = [
  {
    prop: 'SKU',
    label: 'SKU',
    align: 'center'
  },
  {
    prop: 'kl_path',
    label: '刀版图',
    align: 'center',
    slotName: 'kl_pathSlot'
  },
  {
    prop: 'factory_cate',
    label: '分类',
    align: 'center'
  },

  {
    prop: 'status',
    label: '线上状态',
    align: 'center',
    slotName: 'statusSlot'
  },
  {
    prop: 'on_local',
    label: '工厂状态',
    align: 'center',
    slotName: 'on_localSlot'
  }
]

//工厂分类
export const factoryCateCols = [
  {
    prop: 'name',
    label: '分类名称',
    align: 'center'
  },
  {
    prop: 'structs',
    label: '款式',
    align: 'center',
    slotName: 'structsSlot'
  }
]
