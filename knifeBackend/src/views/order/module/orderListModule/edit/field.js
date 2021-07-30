/* eslint-disable */
import { requireFun } from '@/utils'
import { isInteger } from '@/utils/validate'
import {
  WAIT_RELATION,
  WAIT_GENERATE_WAYBILL
} from '@/utils/constant'

export const fedexField = [
  {
    label: '物流方式',
    prop: 'expressCompanyId',
    name: 'expressCompanyId',
    placeholder: '请选择物流方式',
    slotName: 'expressCompanyIdSlot',
    colNum: 12,
    rule: [
      {
        required: true,
        message: requireFun('物流方式')
      }
    ]
  },
  {
    prop: 'expressWaybillCode',
    name: 'expressWaybillCode',
    label: '运单号',
    placeholder: '请输入运单号',
    colNum: 12,
    rule: [
      {
        required: true,
        message: requireFun('运单号')
      }
    ]
  }
]

export const noNeedFedexCodeField =[
  {
    label: '物流方式',
    prop: 'expressCompanyId',
    name: 'expressCompanyId',
    placeholder: '请选择物流方式',
    slotName: 'expressCompanyIdSlot',
    colNum: 12,
    rule: [
      {
        required: true,
        message: requireFun('物流方式')
      }
    ]
  },
  {
    prop: 'expressWaybillCode',
    name: 'expressWaybillCode',
    label: '运单号',
    placeholder: '请输入运单号',
    colNum: 12
  }
]

export const noNeedFedexField = [
  {
    label: '物流方式',
    prop: 'expressCompanyId',
    name: 'expressCompanyId',
    placeholder: '请选择物流方式',
    slotName: 'expressCompanyIdSlot',
    colNum: 12
  },
  {
    prop: 'expressWaybillCode',
    name: 'expressWaybillCode',
    label: '运单号',
    placeholder: '请输入运单号',
    colNum: 12
  }
]

export function getFedexField(orderStatus) {
  if (['2', WAIT_RELATION, WAIT_GENERATE_WAYBILL].includes(orderStatus)) {
    return noNeedFedexField
  }
  if (['1'].includes(orderStatus)) {
    return noNeedFedexCodeField
  }
  return fedexField
}

export const consigneeField = [
  {
    prop: 'consigneeName',
    name: 'consigneeName',
    label: '收货人',
    placeholder: '请输入收货人',
    colNum: 12,
    rule: [
      {
        required: true,
        message: requireFun('收货人')
      }
    ]
  },
  {
    prop: 'consigneeCountryCode',
    name: 'consigneeCountryCode',
    label: '国家',
    placeholder: '请输入国家',
    colNum: 12,
    rule: [
      {
        required: true,
        message: requireFun('国家')
      }
    ]
  },
  {
    prop: 'consigneeContactPhone',
    name: 'consigneeContactPhone',
    label: '收货人电话',
    placeholder: '请输入收货人电话',
    colNum: 12
  },
  {
    prop: 'consigneeContactMobilePhone',
    name: 'consigneeContactMobilePhone',
    label: '收货人手机号码',
    placeholder: '请输入收货人手机号码',
    colNum: 12
  },
  {
    prop: 'consigneeProvince',
    name: 'consigneeProvince',
    label: '州/省',
    placeholder: '请输入州/省',
    colNum: 12,
    rule: [
      {
        required: true,
        message: requireFun('州/省')
      }
    ]
  },
  {
    prop: 'consigneeCity',
    name: 'consigneeCity',
    label: '城市',
    placeholder: '请输入城市',
    colNum: 12,
    rule: [
      {
        required: true,
        message: requireFun('城市')
      }
    ]
  },
  {
    prop: 'consigneeDetailAddress',
    name: 'consigneeDetailAddress',
    label: '地址',
    placeholder: '请输入地址',
    colNum: 12,
    rule: [
      {
        required: true,
        message: requireFun('地址')
      }
    ]
  },
  {
    prop: 'consigneePostcode',
    name: 'consigneePostcode',
    label: '邮编',
    placeholder: '请输入邮编',
    colNum: 12,
    rule: [
      {
        required: true,
        message: requireFun('邮编')
      }
    ]
  }
]

export const productField = [
  {
    prop: 'productExternalSkuCode',
    name: 'productExternalSkuCode',
    slotName: 'productExternalSkuCodeSlot',
    label: 'SKU',
    placeholder: '请输入SKU',
    colNum: 10,
    rule: [
      {
        required: true,
        message: requireFun('SKU')
      }
    ]
  },
  {
    prop: 'productCount',
    name: 'productCount',
    label: '数量',
    placeholder: '请输入数量',
    colNum: 10,
    rule: [
      {
        required: true,
        message: requireFun('数量')
      },
      {
        validator: isInteger
      }
    ]
  },
  {
    prop: 'done',
    name: 'done',
    label: '',
    placeholder: '',
    colNum: 2,
    slotName: 'doneSlot'
  }
]
