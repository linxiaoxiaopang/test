import { requireFun } from '@/utils'
// import { checkLocalTxt } from "@/utils/validate";

export const orderNumFiled = [
  {
    label: '订单号',
    prop: '订单号',
    name: 'isShare',
    colNum: 24
  }
]

export const memberFiled = [
  {
    label: '成员',
    prop: 'user_list',
    name: 'user_list',
    colNum: 24,
    slotName: 'user_listSlot',
    rule: [
      {
        required: true,
        message: requireFun('成员')
      }
    ]
  },
  {
    label: '产品',
    prop: 'prod_list',
    name: 'prod_list',
    colNum: 24,
    slotName: 'prod_listSlot'
  }
]

export const excelGroupFiled = [
  {
    label: '订单组名称',
    prop: 'groupName',
    name: 'groupName',
    colNum: 24,
    slotName: 'groupNameSlot',
    rule: [
      {
        required: true,
        message: requireFun('订单组名称')
      }
    ]
  }
]

export const enclosureFiled = [
  {
    label: '附件',
    prop: 'attachment',
    name: 'attachment',
    colNum: 24,
    slotName: 'attachmentSlot',
    rule: [
      {
        required: true,
        message: requireFun('附件')
      }
    ]
  }
]

export const factoryKnifeFiled = [
  {
    label: '本地刀版图名称列表',
    prop: 'kl_path',
    name: 'kl_path',
    colNum: 24,
    slotName: 'kl_pathSlot',
    rule: [
      {
        // validator: checkLocalTxt
      }
    ]
  },
  {
    label: '本地文件下载',
    prop: 'localLink',
    name: 'localLink',
    colNum: 24,
    slotName: 'localLinkSlot'
  }
]

export const factoryCateFiled = [
  {
    label: '分类名称',
    prop: 'name',
    name: 'name',
    colNum: 24,
    rule: [
      {
        required: true,
        message: requireFun('分类名称')
      }
    ]
  }
]
 

