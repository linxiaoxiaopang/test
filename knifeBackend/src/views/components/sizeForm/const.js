import {isCommonCharactersAndPoint, requireFun} from '@/utils'

export const structField = [
  {
    label: '款式编码',
    prop: 'structure',
    name: 'structure',
    colNum: 8,
    placeholder: '请输入款式编码',
    rule: [
      {
        required: true,
        message: requireFun('名称')
      },
      { validator: isCommonCharactersAndPoint }
    ]
  },
  {
    label: '简称',
    prop: 'abbr',
    name: 'abbr',
    colNum: 8,
    placeholder: '请输入简称',
    rule: [
      {
        required: true,
        message: requireFun('简称')
      }
    ]
  },
  {
    label: '色域值',
    prop: 'prim_color',
    name: 'prim_color',
    colNum: 8,
    placeholder: '请输入色域值',
    slotName: 'prim_colorSlot',
    rule: [
      {
        required: true,
        message: requireFun('色域值')
      }
    ]
  },
  {
    label: '展示图',
    prop: 'figures',
    name: 'figures',
    colNum: 24,
    placeholder: '请输入展示图',
    slotName: 'figuresSlot',
    rule: [
      {
        required: true,
        message: requireFun('展示图')
      }
    ]
  }
  // {
  //   label: "详情",
  //   prop: "detail",
  //   name: "detail",
  //   colNum: 24,
  //   placeholder: "请输入详情",
  //   slotName: "detailSlot",
  //   rule: [
  //     {
  //       required: true,
  //       message: requireFun("详情"),
  //     },
  //   ],
  // },
]