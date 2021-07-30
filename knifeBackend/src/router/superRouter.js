const superRouter = [
  {
    name: '后台端-首页',
    id: 's-53',
    pid: null,
    sort: 0,
    path: '/home',
    icon: 'index',
    component: 'Layout',
    redirect: '/home/index',
    meta: { title: '首页', icon: 'index' },
    children: [
      {
        name: '后台端-系统首页',
        id: 's-54',
        pid: 's-53',
        sort: 1,
        icon: 'home',
        path: 'index',
        component: 'home',
        meta: { title: '系统首页', icon: 'icon' },
        children: []
      }
    ]
  },
  {
    name: '后台端-原型管理',
    id: 's-23',
    pid: null,
    sort: 1,
    path: '/product',
    icon: 'index',
    component: 'Layout',
    redirect: '/product/shelves',
    meta: { title: '原型管理', icon: 'ic_commodity' },
    children: [
      {
        name: '后台端-已上架原型',
        id: 's-24',
        pid: 's-23',
        sort: 2,
        icon: 'index',
        path: 'shelves',
        component: 'product/shelves',
        meta: { title: '已上架原型', icon: '' },
        children: []
      },
      {
        name: '后台端-待上架原型',
        id: 's-25',
        pid: 's-23',
        sort: 3,
        icon: 'index',
        path: 'waitShelves',
        component: 'product/waitShelves',
        meta: { title: '待上架原型', icon: '' },
        children: []
      },
      {
        name: '后台端-已下架原型',
        id: 's-26',
        pid: 's-23',
        sort: 4,
        icon: 'index',
        path: 'unShelves',
        component: 'product/unShelves',
        meta: { title: '已下架原型', icon: '' },
        children: []
      },
      {
        name: '后台端-原型维护',
        id: 's-27',
        pid: 's-23',
        sort: 5,
        icon: 'index',
        path: 'maintain',
        component: 'product/maintain',
        redirect: '/product/maintain/basicsMange',
        meta: { title: '原型维护', icon: '' },
        children: [
          {
            name: '后台端-原型基础信息',
            id: 's-29',
            pid: 's-27',
            sort: 2,
            icon: 'index',
            path: 'basicsMange',
            component: 'product/maintain/basicsMange',
            meta: { title: '原型基础信息', icon: '' },
            children: []
          },
          {
            name: '后台端-价格管理',
            id: 's-58',
            pid: 's-27',
            sort: 2,
            icon: 'index',
            path: 'priceManage',
            component: 'product/maintain/priceManage',
            meta: { title: '价格管理', icon: '' },
            children: []
          },
          {
            name: '后台端-刀版图管理',
            id: 's-30',
            pid: 's-27',
            sort: 2,
            icon: 'index',
            path: 'knifeMange',
            component: 'product/maintain/knifeMange',
            meta: { title: '刀版图管理', icon: '' },
            children: []
          },
          {
            name: '后台端-参考尺码管理',
            id: 's-64',
            pid: 's-27',
            sort: 5,
            icon: 'index',
            path: 'sizeMange',
            component: 'product/maintain/sizeMange',
            meta: { title: '参考尺码管理', icon: '' },
            children: []
          },

          {
            name: '后台端-原型基础信息编辑',
            id: 's-67',
            pid: 's-27',
            sort: 2,
            icon: 'index',
            path: 'basicsEdit',
            hidden: true,
            component: 'product/maintain/basicsEdit',
            meta: { title: '原型基础信息编辑', icon: '' },
            children: []
          },

          {
            name: '后台端-参考尺码',
            id: 's-65',
            pid: 's-27',
            sort: 6,
            icon: 'index',
            path: 'referenceSize',
            hidden: true,
            component: 'product/maintain/sizeMange/referenceSize',
            meta: { title: '参考尺码', icon: '' },
            children: []
          },

          {
            name: '后台端-位置参考尺码',
            id: 's-65',
            pid: 's-27',
            sort: 6,
            icon: 'index',
            path: 'posReferenceSize',
            hidden: true,
            component: 'product/maintain/sizeMange/posReferenceSize',
            meta: { title: '位置参考尺码', icon: '' },
            children: []
          },

          {
            name: '后台端-效果图管理',
            id: 's-31',
            pid: 's-27',
            sort: 2,
            icon: 'index',
            path: 'proShowMange',
            component: 'product/maintain/proShowMange',
            meta: { title: '效果图管理', icon: '' },
            children: []
          },
          {
            name: '后台端-添加',
            id: 's-32',
            pid: 's-27',
            sort: 3,
            icon: 'index',
            path: 'createInfo',
            hidden: true,
            component: 'product/maintain/createInfo',
            meta: { title: '添加', icon: 'index' },
            children: []
          },
          {
            name: '后台端-坐标效果图',
            id: 's-33',
            pid: 's-27',
            sort: 3,
            icon: 'knife',
            path: 'createCoordPic',
            hidden: true,
            component: 'product/maintain/createCoordPic',
            meta: { title: '坐标效果图', icon: 'index' },
            children: []
          },
          {
            name: '后台端-上传效果图',
            id: 's-34',
            pid: 's-27',
            sort: 4,
            icon: 'knife',
            path: 'uploadProShow',
            hidden: true,
            component: 'product/uploadProShow',
            meta: { title: '上传效果图', icon: 'index' },
            children: []
          },
          {
            name: '后台端-校验组件',
            id: 's-52',
            pid: 's-27',
            sort: 0,
            icon: 'index',
            path: 'verifyComponent',
            hidden: true,
            component: 'product/maintain/verifyComponent',
            meta: { title: '校验组件', icon: 'index' },
            children: []
          },
          {
            name: '后台端-生成参考图',
            id: 's-61',
            pid: 's-27',
            sort: 2,
            icon: 'index',
            path: 'createReference',
            hidden: true,
            component: 'product/maintain/knifeMange/module/createReference',
            meta: {
              title: '生成参考图',
              icon: 'index',

              name: 'createReference'
            },
            children: []
          },
          {
            name: '后台端-校验刀版图1',
            id: 's-62',
            pid: 's-27',
            sort: 2,
            icon: 'index',
            path: 'checkReference',
            hidden: true,
            component: 'product/maintain/knifeMange/module/checkReference',
            meta: {
              title: '校验刀版图',
              icon: 'index',

              name: 'checkReference'
            },
            children: []
          },
          {
            name: '后台端-校验效果图',
            id: 's-63',
            pid: 's-27',
            sort: 2,
            icon: 'index',
            path: 'checkProShow',
            hidden: true,
            component: 'product/maintain/proShowMange/module/checkReference',
            meta: {
              title: '校验效果图',
              icon: 'index',

              name: 'checkReference'
            },
            children: []
          }
        ]
      },
      {
        name: '后台端-分类管理',
        id: 's-28',
        pid: 's-23',
        sort: 6,
        icon: 'index',
        path: 'category',
        component: 'product/category',
        meta: { title: '分类管理', icon: '' },
        children: []
      },
      {
        name: '后台端-编辑档位',
        id: 's-59',
        pid: 's-23',
        sort: 6,
        icon: 'index',
        path: 'editGears',
        component: 'product/editGears',
        meta: { title: '档位管理', icon: '' },
        children: []
      },
      {
        name: '后台端-档位管理',
        id: 's-60',
        pid: 's-23',
        sort: 7,
        icon: 'index',
        path: 'gearsManage/:id',
        component: 'product/gearsManage',
        hidden: true,
        meta: { title: '档位管理', icon: '' },
        children: []
      }
    ]
  },
  {
    name: '后台端-公共图库',
    id: 's-4',
    pid: null,
    sort: 1,
    path: '/picture',
    icon: 'index',
    component: 'Layout',
    redirect: '/picture/picManage',
    meta: { title: '公共图库', icon: 'ic_pic' },
    children: [
      {
        name: '后台端-公共图片',
        id: 's-36',
        pid: 's-4',
        sort: 1,
        icon: 'knife',
        path: 'publicGallery',
        component: 'picture/publicGallery',
        meta: { title: '公共图片', icon: '' },
        children: []
      },
      {
        name: '后台端-图片分类',
        id: 's-5',
        pid: 's-4',
        sort: 2,
        icon: 'knife',
        path: 'category',
        component: 'picture/category',
        meta: { title: '图片分类', icon: '' },
        children: []
      }
    ]
  },
  {
    name: '后台端-分销商管理',
    id: 's-37',
    pid: null,
    sort: 2,
    icon: 'index',
    path: '/user',
    component: 'Layout',
    redirect: '/user/list',
    meta: { title: '分销商管理', icon: 'ic_peoples' },
    children: [
      {
        name: '后台端-分销商列表',
        id: 's-38',
        pid: 's-37',
        sort: 8,
        icon: 'index',
        path: 'list',
        component: 'user',
        meta: { title: '分销商列表', icon: '' },
        children: []
      },
      {
        name: '后台端-分销商信息',
        id: 's-69',
        pid: 's-37',
        sort: 8,
        icon: 'index',
        path: 'resellerPage',
        component: 'user/resellerPage',
        hidden: true,
        meta: { title: '分销商信息', icon: '' },
        children: []
      },
      {
        name: '后台端-图片管理',
        id: 's-6',
        pid: 's-37',
        sort: 8,
        icon: 'knife',
        path: 'picManage',
        component: 'picture/picManage',
        meta: { title: '图片管理', icon: '' },
        children: []
      },
      {
        name: '后台端-订单管理',
        id: 's-20',
        pid: 's-37',
        sort: 8,
        path: '/orderManage',
        icon: 'index',
        redirect: '/orderList',
        component: 'order',
        meta: { title: '订单管理' },
        children: [
          {
            name: '后台端-排单中',
            id: 's-41',
            pid: 's-20',
            sort: 2,
            icon: 'index',
            path: 'inDispatch',
            component: 'order/inDispatch',
            meta: { title: '排单中', icon: '' },
            children: []
          },
          {
            name: '后台端-导出批次',
            id: 's-56',
            pid: 's-20',
            sort: 2,
            icon: 'index',
            path: 'sendToFactoryBatch',
            component: 'order/sendToFactoryBatch',
            meta: { title: '导出批次', icon: '' },
            children: []
          },
          {
            name: '后台端-全部订单',
            id: 's-21',
            pid: 's-20',
            sort: 2,
            icon: 'index',
            path: 'orderList',
            component: 'order/orderList',
            meta: { title: '全部订单', icon: '' },
            children: []
          },
          {
            name: '后台端-报关清单',
            id: 's-22',
            pid: 's-20',
            sort: 2,
            icon: 'index',
            path: 'order/customsDeclarationList',
            component: 'order/customsDeclarationList',
            meta: { title: '报关清单', icon: '' },
            children: []
          },
          {
            name: '后台端-查看详情',
            id: 's-57',
            pid: 's-56',
            sort: 2,
            icon: '',
            path: 'sendToFactoryBatch/viewDetails',
            component: 'order/sendToFactoryBatch/viewDetails',
            hidden: true,
            meta: { title: '查看详情', icon: '' },
            children: []
          }
        ]
      },
      {
        name: '后台端-定制产品管理',
        id: 's-41',
        pid: 's-37',
        sort: 8,
        icon: 'knife',
        path: 'designedProductManage',
        component: 'designedProductManage',
        meta: { title: '定制产品管理', icon: '' },
        children: []
      },
      {
        name: '后台端-添加用户',
        id: 's-39',
        pid: 's-37',
        sort: 8,
        icon: 'role',
        path: 'addUser',
        component: 'user/addUser',
        hidden: true,
        meta: { title: '添加用户', icon: 'role' },
        children: []
      },
      {
        name: '后台端-编辑用户',
        id: 's-40',
        pid: 's-37',
        sort: 9,
        icon: 'role',
        path: 'editUser',
        component: 'user/editUser',
        meta: { title: '编辑子账号', icon: 'role' },
        hidden: true,
        children: []
      }
    ]
  },
  {
    name: '后台端-供应商管理',
    id: 's-46',
    pid: null,
    sort: 2,
    icon: 'index',
    path: '/supplier',
    component: 'Layout',
    redirect: '/supplier/list',
    meta: { title: '供应商管理', icon: 'ic_city' },
    children: [
      {
        name: '后台端-供应商列表',
        id: 's-55',
        pid: 's-46',
        sort: 8,
        icon: 'index',
        path: 'list',
        component: 'supplier/list',
        meta: { title: '供应商列表', icon: '' },
        children: []
      },
      {
        name: '后台端-供应商账号',
        id: 's-47',
        pid: 's-46',
        sort: 8,
        icon: 'index',
        path: 'account',
        component: 'supplier/account',
        meta: { title: '供应商账号', icon: '' },
        children: []
      },
      {
        name: '后台端-供应商禁用列表',
        id: 's-48',
        pid: 's-46',
        sort: 8,
        icon: 'index',
        path: 'disable',
        component: 'supplier/disable',
        hidden: true,
        meta: { title: '禁用列表', icon: '' },
        children: []
      },
      {
        name: '后台端-添加供应商',
        id: 's-49',
        pid: 's-46',
        sort: 8,
        icon: 'role',
        path: 'list/addSupplier',
        component: 'supplier/list/module/addSupplier',
        hidden: true,
        meta: { title: '添加供应商', icon: 'role' },
        children: []
      },
      {
        name: '后台端-编辑供应商',
        id: 's-50',
        pid: 's-46',
        sort: 9,
        icon: 'role',
        path: 'list/editSupplier',
        component: 'supplier/list/module/editSupplier',
        meta: { title: '编辑供应商', icon: 'role' },
        hidden: true,
        children: []
      },
      {
        name: '后台端-添加供应商账号',
        id: 's-49',
        pid: 's-46',
        sort: 8,
        icon: 'role',
        path: 'addSupplier',
        component: 'supplier/account/module/addSupplier',
        hidden: true,
        meta: { title: '添加供应商账号', icon: 'role' },
        children: []
      },
      {
        name: '后台端-编辑供应商账号',
        id: 's-50',
        pid: 's-46',
        sort: 9,
        icon: 'role',
        path: 'editSupplier',
        component: 'supplier/account/module/editSupplier',
        meta: { title: '编辑供应商账号', icon: 'role' },
        hidden: true,
        children: []
      }
    ]
  },
  {
    name: '后台端-商品管理',
    id: 's-1',
    pid: null,
    sort: 1,
    path: '/knife',
    icon: 'index',
    component: 'Layout',
    redirect: 'noredirect',
    meta: { title: '商品管理', icon: 'index' },
    children: [
      {
        name: '后台端-创建商品',
        id: 's-2',
        pid: 's-1',
        sort: 2,
        icon: 'knife',
        path: 'psd',
        hidden: true,
        component: 'knife',
        meta: { title: '创建商品', icon: 'index' },
        children: []
      },
      {
        name: '后台端-校验刀版图',
        id: 's-3',
        pid: 's-1',
        sort: 3,
        icon: 'knife',
        path: 'check',
        component: 'knife/check',
        meta: { title: '校验刀版图', icon: 'index' },
        hidden: true,
        children: []
      },
      {
        name: '后台端-设置尺码',
        id: 's-60',
        pid: 's-1',
        sort: 3,
        icon: 'knife',
        path: 'size',
        component: 'knife/size',
        meta: { title: '设置尺码', icon: 'index' },
        hidden: true,
        children: []
      },
      {
        name: '后台端-设置尺码校验',
        id: 's-61',
        pid: 's-1',
        sort: 3,
        icon: 'knife',
        path: 'size/check',
        component: 'knife/size/check',
        meta: { title: '设置尺码校验', icon: 'index' },
        hidden: true,
        children: []
      },
      {
        name: '后台端-上传封面',
        id: 's-62',
        pid: 's-1',
        sort: 3,
        icon: 'knife',
        path: 'cover',
        component: 'knife/cover',
        meta: { title: '上传封面', icon: 'index' },
        hidden: true,
        children: []
      }
    ]
  },
  {
    name: '后台端-物流管理',
    id: 's-42',
    pid: null,
    sort: 1,
    path: '/fedex',
    icon: 'yunshu',
    component: 'Layout',
    redirect: '/fedex/had',
    meta: { title: '物流管理', icon: 'yunshu' },
    children: [
      {
        name: '后台端-已对接物流',
        id: 's-60',
        pid: 's-42',
        sort: 2,
        path: 'had',
        component: 'fedex/hadFedex',
        meta: { title: '已对接物流', icon: '' },
        children: []
      },
      {
        name: '后台端-未对接物流',
        id: 's-43',
        pid: 's-42',
        sort: 3,
        path: 'list',
        component: 'fedex',
        meta: { title: '未对接物流', icon: '' },
        children: []
      },
      {
        name: '后台端-启用物流',
        id: 's-65',
        pid: 's-42',
        sort: 4,
        path: 'startLogistics',
        component: 'fedex/hadFedex/module/startLogistics',
        meta: { title: '启用物流', icon: '' },
        children: [],
        hidden: true
      },
      {
        name: '后台端-运费模板',
        id: 's-67',
        pid: 's-42',
        sort: 3,
        path: 'formwork',
        component: 'fedex/formwork',
        meta: { title: '运费模板' },
        children: []
      },
      {
        name: '后台端-设置模板',
        id: 's-68',
        pid: 's-67',
        sort: 4,
        hidden: true,
        path: 'formwork/settings',
        component: 'fedex/formwork/settings',
        meta: { title: '设置模板', icon: 'yunshu' },
        children: []
      },
      {
        name: '后台端-国家/地区管理',
        id: 's-66',
        pid: 's-42',
        sort: 3,
        path: 'country',
        component: 'fedex/country',
        meta: { title: '国家/地区管理' },
        children: []
      },
      {
        name: '后台端-递四方授权',
        id: 's-70',
        pid: 's-42',
        sort: 5,
        path: 'disifang',
        component: 'fedex/hadFedex/module/disifang',
        meta: { title: '递四方授权' },
        children: []
      }
    ]
  },
  {
    name: '后台端-系统管理',
    id: 's-13',
    pid: null,
    sort: 1,
    icon: 'system',
    path: '/system',
    component: 'Layout',
    redirect: '/system/user',
    meta: { title: '系统管理', icon: 'ic_setting' },
    children: [
      {
        name: '后台端-管理员管理',
        id: 's-14',
        pid: 's-13',
        sort: 2,
        path: 'user',
        component: 'system/user',
        icon: 'user',
        permission: ['ad'],
        meta: { title: '管理员管理', icon: '' },
        children: []
      },
      {
        name: '后台端-管理员添加用户',
        id: 's-44',
        pid: 's-13',
        sort: 8,
        icon: 'role',
        path: 'user/addUser',
        component: 'system/user/addUser',
        hidden: true,
        meta: { title: '添加用户', icon: 'role' },
        children: []
      },
      {
        name: '后台端-管理员编辑用户',
        id: 's-45',
        pid: 's-13',
        sort: 9,
        icon: 'role',
        path: 'user/editUser',
        component: 'system/user/editUser',
        meta: { title: '编辑子账号', icon: 'role' },
        hidden: true,
        children: []
      },
      {
        name: '后台端-多端菜单管理',
        id: 's-51',
        pid: null,
        sort: 3,
        path: 'allMenus',
        icon: 'caidan',
        component: 'system/allMenu',
        meta: { title: '多端菜单管理', icon: '' }
      },
      {
        name: '后台端-权限管理',
        id: 's-16',
        pid: 's-13',
        sort: 4,
        path: 'permissions',
        icon: 'permission',
        component: 'system/allPermission/index',
        meta: { title: '权限管理', icon: '' }
      },
      {
        name: '后台端-角色管理',
        path: 'roles',
        id: 's-17',
        pid: 's-13',
        sort: 5,
        icon: 'role',
        component: 'system/role/index',
        meta: { title: '角色管理', icon: '' }
      }
    ]
  },
  {
    name: '后台端-菜单管理',
    id: 's-15',
    pid: null,
    sort: 3,
    path: '/menus',
    icon: 'caidan',
    component: 'system/menu',
    meta: { title: '后台端菜单管理', icon: 'caidan' }
  }
]
export default superRouter
