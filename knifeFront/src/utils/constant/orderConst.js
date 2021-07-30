import {
  isInteger,
  isMoney,
  isTele,
  isContactPhone,
  isNumberAndLetter
} from '@/utils'
import {validatenull} from '@/components/avue/utils/validate'

// 表格 - 订单字段
export const ORDER_KEYS = {
  sku: 'SKU',
  consigneeCountryCode: '国家',
  consigneeDetailAddress: ['地址1', '收货人地址'],
  consigneeCity: '收货人城市',
  consigneeName: '收货人',
  productCount: '产品数量',
  expressCompanyName: '物流方式',
  // expressCompanyId: '物流公司id',
  consigneeContactPhone: '收货人电话',
  consigneeContactMobilePhone: '收货人手机号码',
  consigneeProvince: '收货人州/省',
  orderCode: '订单号',
  expressWaybillCode: '运单号',
  consigneePostcode: '邮编',
  salesman: '业务员',
  dept: '部门',
  totalPrice: '销售金额',
  externalFreight: '运费'
}
// 服务器 - 订单字段
export const ORDER_IMPORT_SYS_KEYS = Object.keys(ORDER_KEYS)

// 订单非必填字段
export const ORDER_IMPORT_UNNEEDED_KEYS = [
  'expressWaybillCode',
  'expressCompanyName',
  'totalPrice',
  'externalFreight',
  'consigneeContactMobilePhone',
  'consigneeContactPhone'
]
// 订单必填字段
export const ORDER_IMPORT_NEED_KEYS = ORDER_IMPORT_SYS_KEYS.filter(key => !ORDER_IMPORT_UNNEEDED_KEYS.includes(key))

// 订单 - 全局唯一字段
export const ORDER_IMPORT_UNIQUE_KEYS = ['expressWaybillCode']

// 对订单号非唯一字段
export const ORDER_CODE_NON_UNIQUE_KEYS = ['sku', 'productCount']
// 对订单号唯一字段
export const ORDER_CODE_UNIQUE_KEYS = ORDER_IMPORT_SYS_KEYS.filter(key => !ORDER_CODE_NON_UNIQUE_KEYS.includes(key))

// 国家二字码
export const COUNTRY_CODE = [
  'AD',
  'AE',
  'AF',
  'AG',
  'AI',
  'AL',
  'AM',
  'AN',
  'AO',
  'AR',
  'AS',
  'AT',
  'AU',
  'AW',
  'AZ',
  'BA',
  'BB',
  'BD',
  'BE',
  'BF',
  'BG',
  'BH',
  'BI',
  'BJ',
  'BM',
  'BN',
  'BO',
  'BR',
  'BS',
  'BT',
  'BV',
  'BW',
  'BY',
  'BZ',
  'CA',
  'CC',
  'CD',
  'CF',
  'CG',
  'CH',
  'CI',
  'CK',
  'CL',
  'CM',
  'CN',
  'CO',
  'CR',
  'CU',
  'CV',
  'CX',
  'CY',
  'CZ',
  'DE',
  'DJ',
  'DK',
  'DM',
  'DO',
  'DZ',
  'EC',
  'EE',
  'EG',
  'EH',
  'ER',
  'ES',
  'ET',
  'FI',
  'FJ',
  'FK',
  'FM',
  'FO',
  'FR',
  'FX',
  'GA',
  'GB',
  'GD',
  'GE',
  'GF',
  'GG',
  'GH',
  'GI',
  'GL',
  'GM',
  'GN',
  'GP',
  'GQ',
  'GR',
  'GS',
  'GT',
  'GU',
  'GW',
  'GY',
  'HK',
  'HM',
  'HN',
  'HR',
  'HT',
  'HU',
  'IC',
  'ID',
  'IE',
  'IL',
  'IN',
  'IO',
  'IQ',
  'IR',
  'IS',
  'IT',
  'JE',
  'JM',
  'JO',
  'JP',
  'JU',
  'KE',
  'KG',
  'KH',
  'KI',
  'KM',
  'KN',
  'KP',
  'KR',
  'KV',
  'KW',
  'KY',
  'KZ',
  'LA',
  'LB',
  'LC',
  'LI',
  'LK',
  'LR',
  'LS',
  'LT',
  'LU',
  'LV',
  'LY',
  'MA',
  'MC',
  'MD',
  'ME',
  'MG',
  'MH',
  'MK',
  'ML',
  'MM',
  'MN',
  'MO',
  'MP',
  'MQ',
  'MR',
  'MS',
  'MT',
  'MU',
  'MV',
  'MW',
  'MX',
  'MY',
  'MZ',
  'NA',
  'NC',
  'NE',
  'NF',
  'NG',
  'NI',
  'NL',
  'NO',
  'NP',
  'NR',
  'NU',
  'NZ',
  'OM',
  'PA',
  'PE',
  'PF',
  'PG',
  'PH',
  'PK',
  'PL',
  'PM',
  'PN',
  'PR',
  'PT',
  'PW',
  'PY',
  'QA',
  'RE',
  'RO',
  'RS',
  'RU',
  'RW',
  'SA',
  'SB',
  'SC',
  'SD',
  'SE',
  'SG',
  'SH',
  'SI',
  'SJ',
  'SK',
  'SL',
  'SM',
  'SN',
  'SO',
  'SR',
  'SS',
  'ST',
  'SV',
  'SY',
  'SZ',
  'TA',
  'TC',
  'TD',
  'TF',
  'TG',
  'TH',
  'TJ',
  'TK',
  'TL',
  'TM',
  'TN',
  'TO',
  'TR',
  'TT',
  'TV',
  'TW',
  'TZ',
  'UA',
  'UG',
  'UM',
  'US',
  'UY',
  'UZ',
  'VA',
  'VC',
  'VE',
  'VG',
  'VI',
  'VN',
  'VU',
  'WF',
  'WS',
  'XB',
  'XC',
  'XD',
  'XE',
  'XG',
  'XH',
  'XI',
  'XJ',
  'XK',
  'XM',
  'XN',
  'XS',
  'XY',
  'YE',
  'YT',
  'ZA',
  'ZM',
  'ZR',
  'ZW',
  'AA'
]

// 订单各个字段验证规则
export const ORDER_RULES = {
  totalPrice: [
    {
      validator: isMoney,
      message: '销售金额不是正确的金额格式'
    }
  ],
  externalFreight: [
    {
      validator: isMoney,
      message: '运费不是正确的金额格式'
    }
  ],
  productCount: [
    {
      validator: isInteger,
      message: '产品数量必须为正整数'
    }
  ],
  /*consigneeCountryCode: [
    {
      validator(rules, value, callback) {
        value = value.toUpperCase()
        if (!COUNTRY_CODE.includes(value)) {
          callback('请输入两位合法的国家简码')
        }
      }
    }
  ],*/
  consigneeContactPhone: [
    {
      validateForm(rules, form, callback) {
        if (
          validatenull(form.consigneeContactMobilePhone) &&
          validatenull(form.consigneeContactPhone)
        ) {
          callback('收货人电话和收货人手机号码其中一个必须有值')
        }
      }
    }
  ],
  consigneeContactMobilePhone: [
    {
      validateForm(rules, form, callback) {
        if (
          validatenull(form.consigneeContactMobilePhone) &&
          validatenull(form.consigneeContactPhone)
        ) {
          callback('收货人电话和收货人手机号码其中一个必须有值')
        }
      }
    }
  ],
  expressCompanyName: [
    {
      validateForm(rules, form, callback) {
        if (validatenull(form.expressCompanyName) !== validatenull(form.expressWaybillCode)) {
          callback('运单号和物流方式应同时存在或都不存在')
        }
      }
    }
  ],
  expressWaybillCode: [
    {
      validator: isNumberAndLetter,
      message: '请输入正确的运单号'
    },
    {
      validateForm(rules, form, callback) {
        if (validatenull(form.expressCompanyName) !== validatenull(form.expressWaybillCode)) {
          callback('运单号和物流方式应同时存在或都不存在')
        }
      }
    }
  ]
}
// 补充必填字段验证规则
ORDER_IMPORT_NEED_KEYS.map(key => {
  let rules = ORDER_RULES[key] || []
  rules.unshift({
    required: true,
    message: '除销售金额、运费、运单号和物流方式外所有值都不能为空'
  })
  ORDER_RULES[key] = rules
})