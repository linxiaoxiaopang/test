// export { galleryField } from "./filterFields";
import { requireFun } from '@/utils'
//新增顶级图库类型
export const imageTypeFiled = [
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
      }
    ]
  }
]

//新增非顶级图库类型
export const childImageTypeFiled = [
  {
    label: '父分类名称',
    prop: 'parentName',
    name: 'parentName',
    placeholder: '请输入父分类名称',
    colNum: 24,
    slotName: 'parentNameSlot'
  },
  {
    label: '子分类名称',
    prop: 'name',
    name: 'name',
    colNum: 24,
    placeholder: '请输入子分类名称',
    rule: [
      {
        required: true,
        message: requireFun('子分类名称')
      }
    ]
  }
]

export const editImageTypeFiled = [
  {
    label: '所属分类',
    prop: 'parent',
    name: 'parent',
    colNum: 24,
    placeholder: '请输入图库名称',
    slotName: 'parentSlot'
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

//新增非顶级图库类型
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
