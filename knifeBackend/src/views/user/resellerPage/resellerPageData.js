export const radioGroupBtn = [
  { label: '子账号管理' },
  { label: '分销商图片管理' },
  { label: '分销商订单管理' },
  { label: '分销商定制产品管理' }
]
// account
export const accountForm = [
  { label: '账号名称', placeholder: '输入子账号名称', prop: 'nick_name' },
  { label: '创建时间', placeholder: '请选择时间', prop: 'date_joined' },
  { label: '账号', placeholder: '输入账号', prop: 'username' },
  { prop: 'search' }
]
export const accountTable = [
  { label: '账号名称', prop: 'nick_name' },
  { label: '创建时间', prop: 'date_joined' },
  { label: '账号', prop: 'username' },
  { label: '操作', prop: 'operation1' }
]
export const accountFormData = {
  nick_name: '',
  username: '',
  date_joined: ''
}
// pro
export const proForm = [
  { label: '定制产品名称', placeholder: '输入定制产品名称', prop: 'chinese_name' },
  { label: '原型名称', placeholder: '输入原型名称', prop: 'name' },
  { label: '定制时间', placeholder: '请选择时间', prop: 'create_time' },
  { label: '款式', placeholder: '输入款式', prop: 'struct_name' },
  { prop: 'search' }
]
export const proFormData = {
  name: '',
  chinese_name: '',
  create_time: '',
  struct_name: ''
}
export const proTable = [
  { label: '定制产品名称', prop: 'chinese_name' },
  { label: '定制产品英文名', prop: 'english_name' },
  { label: '原型名称', prop: 'name' },
  { label: '定制原图', prop: 'images_path' },
  { label: '款式', prop: 'struct_name' },
  { label: '尺码', prop: 'size_name' },
  { label: '分销商', prop: 'create_by_name' },
  { label: '刀版图状态', prop: 'spec_prods_path' },
  { label: '定制时间', prop: 'create_time1' },
  { label: '操作', prop: 'operation4' }
]
//photo
export const photoForm = [
  { label: '图片名称', placeholder: '输入图片名称', prop: 'title' },
  { label: '图片分类', placeholder: '请选择分类', prop: 'category_name' },
  { label: '上传时间', placeholder: '请选择时间', prop: 'create_time' },
  { prop: 'search' }
]

export const photoFormData = {
  category_name: '',
  title: '',
  create_time: ''
}

export const phoTable = [
  { label: '图片名称', prop: 'title' },
  { label: '图片分类', prop: 'category_name' },
  { label: '图片', prop: 'thumbnail_path' },
  { label: '格式', prop: 'path' },
  { label: '尺寸', prop: 'height' },
  { label: '上传时间', prop: 'create_time' },
  { label: '状态', prop: 'disable' },
  { label: '操作', prop: 'operation2' }
]

// order
export const orderForm = [
  { label: '订单号', placeholder: '输入订单号', prop: 'orderCode' },
  { label: '运单号', placeholder: '输入运单号', prop: 'expressWaybillCode' },
  { label: '物流方式', placeholder: '选择物流方式', prop: 'expressShippingMethodId' },
  { label: '订单状态', placeholder: '选择订单状态', prop: 'orderStatus' },
  { label: '导入时间', placeholder: '请选择时间', prop: 'importTime' },
  { prop: 'search' }
]
export const orderFormData = {
  orderCode: '',
  expressWaybillCode: '',
  expressShippingMethodId: '',
  orderStatus: '',
  importTime: ''
}

export const orderTable = [
  { label: '订单号', prop: 'orderCode' },
  { label: '物流方式', prop: 'expressShippingMethodCnName' },
  { label: '运单号', prop: 'expressWaybillCode' },
  { label: '物流到期时间', prop: 'expressExpireTime' },
  { label: '刀版图状态', prop: 'isKnifeLayoutCreated' },
  { label: '导入时间', prop: 'importTime' },
  { label: '订单状态', prop: 'orderStatus' },
  { label: '操作', prop: 'operation3' }
]
export const orderStatusData = [
  { label: '待关联', value: 11 },
  { label: '待生成运单', value: 20 },
  { label: '已过期', value: 29 },
  { label: '待排单', value: 40 },
  { label: '排单中', value: 41 },
  { label: '生产中', value: 42 },
  { label: '已发货', value: 70 },
  { label: '退货中', value: 72 },
  { label: '已取消', value: 80 },
  { label: '待关联', value: 90 }
]
