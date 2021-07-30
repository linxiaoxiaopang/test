const superRouter = [
  {
    name: '工厂端-系统',
    id: 'f-1',
    pid: null,
    sort: 1,
    path: '/homePage',
    icon: 'index',
    component: 'Layout',
    redirect: '/homePage/home',
    children: [
      {
        name: '工厂端-系统首页',
        id: 'f-2',
        pid: 'f-1',
        sort: 1,
        icon: 'index',
        path: 'home',
        component: 'home',
        meta: { title: '系统首页', icon: 'fac-factoryHome' },
        children: []
      }
    ]
  },
  {
    name: '工厂端-工厂分类',
    id: 'f-21',
    pid: null,
    sort: 1,
    path: '/factorySort',
    icon: 'index',
    component: 'Layout',
    redirect: '/factorySort/factoryCate',
    meta: { title: '工厂分类', icon: 'index' },
    children: [
      {
        name: '工厂端-分类管理',
        id: 'f-22',
        pid: 'f-21',
        sort: 2,
        icon: 'liebiao',
        path: 'factoryCate',
        component: 'factoryCate',
        meta: { title: '分类管理', icon: 'fac-classifiedManagement', noCache: true },
        children: []
      }
    ]
  },
  {
    name: '工厂端-坐标图',
    id: 'f-31',
    pid: null,
    sort: 1,
    path: '/coordinate',
    icon: 'index',
    component: 'Layout',
    redirect: '/coordinate/sortManage',
    meta: { title: '坐标图下载', icon: 'index' },
    children: [
      {
        name: '工厂端-坐标图下载',
        id: 'f-32',
        pid: 'f-31',
        sort: 1,
        icon: 'index',
        path: 'sortManage',
        component: 'coordinate/coordinate/index',
        meta: { title: '坐标图下载', icon: 'fac-mapDownload' },
        children: []
      }
    ]
  },
  {
    name: '工厂端-订单管理',
    id: 'f-12',
    pid: null,
    sort: 1,
    path: '/order',
    icon: 'index',
    component: 'Layout',
    redirect: '/order/inProductionExport',
    meta: { title: '订单管理', icon: 'fac-orderManagement' },
    children: [
      {
        name: '工厂端-生产中-未导出',
        id: 'f-13',
        pid: 'f-12',
        sort: 1,
        icon: 'index',
        path: 'inProductionExport',
        component: 'order/inProductionExport/index',
        meta: { title: '生产中-未导出', icon: '' },
        children: []
      },
      {
        name: '工厂端-生产中-已导出',
        id: 'f-14',
        pid: 'f-12',
        sort: 2,
        icon: 'index',
        path: 'inProductionExported',
        component: 'order/inProductionExported/index',
        meta: { title: '生产中-已导出', icon: '' },
        children: []
      },
      {
        name: '工厂端-查看详情',
        id: 'f-17',
        pid: 'f-12',
        sort: 3,
        icon: 'index',
        path: 'inProductionExported/showDetail',
        component: 'order/inProductionExport/index',
        hidden: true,
        meta: {
          title: '查看详情',
          icon: 'index',
          sort: 1,
          ptitle: '生产中-已导出',
          activeMenu: '/order/inProductionExported'
        }
      },
      {
        name: '工厂端-扫描查询',
        id: 'f-19',
        pid: 'f-12',
        sort: 4,
        path: 'orderSearch',
        icon: 'liebiao',
        component: 'scan/orderDetail',
        meta: { title: '扫描查询', icon: '', noCache: true },
        children: []
      },
      {
        name: '工厂端-扫描出库',
        id: 'f-20',
        pid: 'f-12',
        sort: 5,
        path: 'orderScan',
        icon: 'liebiao',
        component: 'scan/orderDetail',
        meta: { title: '扫描出库', icon: '', noCache: true, type: 1 },
        children: []
      },
      {
        name: '工厂端-发货查询',
        id: 'f-48',
        pid: 'f-12',
        sort: 1,
        icon: 'index',
        path: 'invoiceQueries',
        component: 'order/invoiceQueries/index',
        meta: { title: '发货查询', icon: '' },
        children: []
      },
      {
        name: '工厂端-查看明细',
        id: 'f-49',
        pid: 'f-12',
        sort: 3,
        icon: 'index',
        path: 'inProductionExported/viewDetails',
        component: 'order/viewDetails',
        hidden: true,
        meta: {
          title: '查看明细',
          icon: 'index',
          sort: 1,
          ptitle: '生产中-已导出',
          activeMenu: '/order/inProductionExported'
        }
      }
    ]
  },
  {
    name: '工厂端-系统管理',
    id: 'f-40',
    pid: null,
    sort: 1,
    path: '/system',
    icon: 'index',
    component: 'Layout',
    redirect: '/system/user',
    meta: { title: '系统管理', icon: 'fac-settingManagement' },
    children: [
      {
        name: '工厂端-用户管理',
        id: 'f-41',
        pid: 'f-40',
        sort: 1,
        icon: 'index',
        path: 'user',
        component: 'system/newUser',
        meta: { title: '用户管理', icon: '' },
        children: []
      },
      {
        name: '工厂端-角色管理',
        id: 'f-42',
        pid: 'f-40',
        sort: 2,
        icon: 'index',
        path: 'role',
        component: 'system/newRole',
        meta: { title: '角色管理', icon: '' },
        children: []
      },
      {
        name: '工厂端-操作记录',
        id: 'f-43',
        pid: 'f-40',
        sort: 3,
        icon: 'index',
        path: 'history',
        component: 'system/history',
        meta: { title: '操作记录', icon: '' },
        children: []
      },
      {
        name: '工厂端-添加管理员',
        id: 'f-44',
        pid: 'f-40',
        icon: 'index',
        sort: 4,
        path: 'user/addUser',
        component: 'system/newUser/addUser',
        hidden: true,
        meta: { title: '添加管理员', icon: 'index', ptitle: '管理员管理' }
      },
      {
        name: '工厂端-编辑管理员',
        id: 'f-45',
        pid: 'f-40',
        sort: 5,
        icon: 'index',
        path: 'user/editUser',
        component: 'system/newUser/editUser',
        hidden: true,
        meta: { title: '编辑管理员', icon: 'index', ptitle: '管理员管理' }
      },
      {
        name: '工厂端-添加角色',
        id: 'f-42',
        pid: 'f-40',
        sort: 6,
        icon: 'index',
        path: 'role/addRole',
        component: 'system/newRole/addRole',
        hidden: true,
        meta: { title: '添加角色', icon: 'index', ptitle: '角色管理' }
      },
      {
        name: '工厂端-编辑角色',
        id: 'f-46',
        pid: 'f-40',
        sort: 7,
        icon: 'index',
        path: 'role/editRole',
        component: 'system/newRole/editRole',
        hidden: true,
        meta: { title: '编辑角色', icon: 'index', ptitle: '角色管理' }
      }
    ]
  },
  {
    name: '工厂端-菜单管理',
    id: 'f-47',
    pid: null,
    sort: 1,
    path: '/menus',
    icon: 'caidan',
    component: 'system/menu',
    meta: { title: '菜单管理', icon: 'caidan' }
  }
]

export default superRouter
