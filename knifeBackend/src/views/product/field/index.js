export * from './productFields'

import { requireFun } from '@/utils'
import { isInteger, isMoney, isCommonCharactersAndPoint, isCommonCharacters, validatAlphabets } from '@/utils/validate'
//新增顶级图库类型
export const imageTypeFiled = [
  {
    label: '图库名称',
    prop: 'name',
    name: 'name',
    colNum: 24,
    placeholder: '请输入图库名称',
    rule: [
      {
        required: true,
        message: requireFun('图库名称')
      }
    ]
  }
]

//新增非顶级图库类型
export const childImageTypeFiled = [
  {
    label: '父类图库',
    prop: 'parentName',
    name: 'parentName',
    colNum: 24,
    slotName: 'parentNameSlot'
  },
  {
    label: '图库名称',
    prop: 'name',
    name: 'name',
    colNum: 24,
    placeholder: '请输入图库名称',
    rule: [
      {
        required: true,
        message: requireFun('图库名称')
      }
    ]
  }
]

export const imgUploadFiled = [
  {
    label: '图片',
    prop: 'path',
    name: 'path',
    colNum: 24,
    slotName: 'pathSlot',
    rule: [
      {
        required: true,
        message: requireFun('图片')
      }
    ]
  },
  {
    label: '类型',
    prop: 'type',
    name: 'type',
    colNum: 12,
    slotName: 'typeSlot'
  },
  {
    label: '状态',
    prop: 'isShare',
    name: 'isShare',
    colNum: 24,
    slotName: 'isShareSlot'
  }
]

//编辑图片
export const reditPicField = [
  {
    label: '名称',
    prop: 'title',
    name: 'title',
    colNum: 24,
    slotName: 'titleSlot'
  },
  {
    label: '类型',
    prop: 'category',
    name: 'category',
    colNum: 24,
    slotName: 'categorySlot'
  },

  {
    label: '状态',
    prop: 'isShare',
    name: 'isShare',
    colNum: 24,
    slotName: 'isShareSlot'
  }
]

//编辑标签
export const reditTagField = [
  {
    label: '名称',
    prop: 'title',
    name: 'title',
    colNum: 24,
    slotName: 'titleSlot'
  },
  {
    label: '标签',
    prop: 'tags',
    name: 'tags',
    colNum: 24,
    slotName: 'tagsSlot'
  }
]

//isshare的批量操作
export const batchIsshareField = [
  {
    label: '状态',
    prop: 'isShare',
    name: 'isShare',
    colNum: 24,
    slotName: 'isShareSlot'
  }
]

export const originChangeField = [
  {
    label: '图片名称',
    prop: 'title',
    name: 'title',
    colNum: 24,
    slotName: 'titleSlot'
  },
  {
    label: '所属分类',
    prop: 'category_name',
    name: 'category_name',
    colNum: 24,
    slotName: 'category_nameSlot'
  },
  {
    label: '原图',
    prop: 'path',
    name: 'path',
    colNum: 24,
    slotName: 'pathSlot',
    rule: [
      {
        required: true,
        message: requireFun('原图')
      }
    ]
  }
]
//tags的批量操作
export const batchTagsField = [
  {
    label: '状态',
    prop: 'tags',
    name: 'tags',
    colNum: 24,
    slotName: 'tagsSlot'
  }
]

//tags_set的批量操作
export const batchTagsSetField = [
  {
    label: '状态',
    prop: 'tags_set',
    name: 'tags_set',
    colNum: 24,
    slotName: 'tags_setSlot'
  }
]

//titles的批量操作
export const batchTitlesField = [
  {
    label: '名称',
    prop: 'titles',
    name: 'titles',
    colNum: 24,
    placeholder: '请输入批量图片名称'
  }
]

//isShares的批量操作
export const batchIsSharesField = [
  {
    label: '状态',
    prop: 'isShares',
    name: 'isShares',
    colNum: 24,
    slotName: 'isSharesSlot'
  }
]

//types的批量操作
export const batchTypesField = [
  {
    label: '名称',
    prop: 'types',
    name: 'types',
    colNum: 24,
    slotName: 'typesSlot'
  }
]

//types的批量操作
export const batchCateField = [
  {
    label: '名称',
    prop: 'category',
    name: 'category',
    colNum: 24,
    slotName: 'categorySlot'
  }
]

//新增顶级原型类型
export const protoCateFiled = [
  {
    label: '分类名称',
    prop: 'name',
    name: 'name',
    colNum: 24,
    placeholder: '请输入分类名称',
    rule: [
      {
        required: true,
        message: requireFun('分类名称')
      },
      {
        max: 8,
        message: '字符长度最多为8'
      }
    ]
  }
]

//新增非顶级原型分类
export const childProtoCateFiled = [
  {
    label: '所属分类',
    prop: 'parentName',
    name: 'parentName',
    colNum: 24,
    slotName: 'parentNameSlot'
  },
  {
    label: '分类名称',
    prop: 'name',
    name: 'name',
    colNum: 24,
    placeholder: '请输入分类名称',
    rule: [
      {
        required: true,
        message: requireFun('分类名称')
      },
      {
        max: 8,
        message: '字符长度最多为8'
      }
    ]
  }
]

export const editProtoCateFiled = [
  {
    label: '所属分类',
    prop: 'parent',
    name: 'parent',
    colNum: 24,
    placeholder: '请输入所属分类',
    slotName: 'parentSlot'
  },
  {
    label: '分类名称',
    prop: 'name',
    name: 'name',
    colNum: 24,
    placeholder: '请输入分类名称',
    rule: [
      {
        required: true,
        message: requireFun('分类名称')
      },
      {
        max: 8,
        message: '字符长度最多为8'
      }
    ]
  }
]

//编辑原型图
export const figureEditField = [
  {
    label: '款式',
    prop: 'structure',
    name: 'structure',
    colNum: 24,
    slotName: 'structureSlot'
  },
  {
    label: '原型图',
    prop: 'path',
    name: 'path',
    colNum: 24,
    slotName: 'pathSlot',
    rule: [
      {
        required: true,
        message: requireFun('原型图')
      }
    ]
  }
]

//基础信息
export const protoBasisField = [
  {
    label: '原型名称',
    prop: 'name',
    name: 'name',
    colNum: 24,
    placeholder: '请输入原型名称',
    rule: [
      {
        required: true,
        message: requireFun('原型名称')
      }
    ]
  },
  {
    label: '中文名称',
    prop: 'chinese_name',
    name: 'chinese_name',
    colNum: 24,
    placeholder: '请输入中文名称',
    rule: []
  },
  {
    label: '英文名称',
    prop: 'english_name',
    name: 'english_name',
    colNum: 24,
    placeholder: '请输入英文名称',
    slotName: 'english_nameSlot',
    rule: [
      {
        validator: validatAlphabets
      }
    ]
  },
  {
    label: '海关编号',
    prop: 'customs_code',
    name: 'customs_code',
    colNum: 24,
    placeholder: '请输入海关编号',
    rule: [{ validator: isCommonCharacters }]
  },
  {
    label: '原型分类',
    prop: 'category',
    name: 'category',
    colNum: 24,
    slotName: 'categorySlot',
    placeholder: '请选择原型分类',
    rule: [
      {
        required: true,
        message: requireFun('原型分类')
      }
    ]
  },
  {
    label: '适用人群',
    prop: 'sex',
    name: 'sex',
    colNum: 24,
    slotName: 'sexSlot',
    rule: []
  },
  {
    label: '适用季节',
    prop: 'season',
    name: 'season',
    colNum: 24,
    slotName: 'seasonSlot',
    rule: []
  },
  {
    label: '生产周期',
    prop: 'prod_period',
    name: 'prod_period',
    colNum: 24,
    placeholder: '请输入生产周期',
    rule: [
      {
        validator: isInteger
      }
    ]
  },
  {
    label: '原型详情',
    prop: 'detail',
    name: 'detail',
    colNum: 24,
    slotName: 'detailSlot',
    rule: []
  }
]

//规格信息
export const protoSpecificationsField = [
  {
    label: '规格设置',
    prop: 'setting',
    name: 'setting',
    colNum: 24,
    placeholder: '请输入规格设置',
    slotName: 'settingSlot'
  },
  {
    label: '规格信息',
    prop: 'info',
    name: 'info',
    colNum: 24,
    slotName: 'infoSlot',
    placeholder: '请选择规格信息'
  }
]

//设置信息
export const settingField = [
  {
    label: '款式',
    prop: 'structs',
    name: 'structs',
    colNum: 24,
    placeholder: '请输入款式，如：颜色。',
    slotName: 'structsSlot',
    rule: [
      {
        required: true,
        message: requireFun('款式')
      }
    ]
  }
]

//款式信息
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

//编辑原型尺码
export const sizesEditField = [
  {
    label: '尺码名称',
    prop: 'size_name',
    name: 'size_name',
    placeholder: '请输入尺码名称',
    colNum: 12,
    rule: [
      {
        required: true,
        message: requireFun('尺码名称')
      },
      { validator: isCommonCharactersAndPoint }
    ]
  },
  {
    label: '重量',
    prop: 'weight',
    name: 'weight',
    placeholder: '请输入重量',
    colNum: 12,
    rule: [
      // {
      //   required: true,
      //   message: requireFun("重量"),
      // },
      { validator: isInteger }
    ]
  },
  {
    label: '长度',
    prop: 'length',
    name: 'length',
    placeholder: '请输入长度',
    colNum: 12,
    rule: [
      // {
      //   required: true,
      //   message: requireFun("长度"),
      // },
      { validator: isInteger }
    ]
  },
  {
    label: '宽度',
    prop: 'width',
    name: 'width',
    placeholder: '请输入宽度',
    colNum: 12,
    rule: [
      // {
      //   required: true,
      //   message: requireFun("宽度"),
      // },
      { validator: isInteger }
    ]
  },
  {
    label: '高度',
    prop: 'height',
    name: 'height',
    placeholder: '请输入高度',
    colNum: 12,
    rule: [
      // {
      //   required: true,
      //   message: requireFun("高度"),
      // },
      { validator: isInteger }
    ]
  }
  // {
  //   label: "标准尺码",
  //   prop: "standard",
  //   name: "standard",
  //   colNum: 12,
  //   slotName: "standardSlot",
  //   rule: [
  //     {
  //       required: true,
  //       message: requireFun("标准尺码")
  //     }
  //   ]
  // }
]

//编辑原型款式
export const structsEditField = [
  {
    label: '款式名称',
    prop: 'structure',
    name: 'structure',
    placeholder: '请输入款式名称',
    colNum: 12,
    rule: [
      {
        required: true,
        message: requireFun('款式名称')
      }
    ]
  },
  {
    label: '款式介绍',
    prop: 'detail',
    name: 'detail',
    placeholder: '请输入款式介绍',
    colNum: 12,
    type: 'textarea',
    rule: [
      {
        required: true,
        message: requireFun('款式介绍')
      }
    ]
  }
]

//规格信息
export const uploadProShowField = [
  {
    label: '坐标图',
    prop: 'coord_show',
    name: 'coord_show',
    colNum: 6,
    placeholder: '请上传坐标图',
    slotName: 'coord_showSlot',
    rule: [
      {
        required: true,
        message: requireFun('坐标图')
      }
    ]
  },
  {
    label: '背景图',
    prop: 'white_show',
    name: 'white_show',
    colNum: 6,
    placeholder: '请上传背景图',
    slotName: 'white_showSlot',
    rule: [
      {
        required: true,
        message: requireFun('背景图')
      }
    ]
  },
  {
    label: '效果图',
    prop: 'shadow_show',
    name: 'shadow_show',
    colNum: 6,
    placeholder: '请上传效果图',
    slotName: 'shadow_showSlot',
    rule: [
      {
        required: true,
        message: requireFun('效果图')
      }
    ]
  },
  {
    label: 'json数据',
    prop: 'show_masks',
    name: 'show_masks',
    colNum: 24,
    placeholder: '请输入json数据',
    slotName: 'show_masksSlot',
    rule: [
      {
        required: true,
        message: requireFun('json数据')
      }
    ]
  }
]
