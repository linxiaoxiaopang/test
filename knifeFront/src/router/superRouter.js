import { PERSONAL_CENTER_NAME, MENUS_NAME, NAV_DESIGN_NAME } from '@/utils/constant'

const superRouter = [
  {
    name: '业务端-首页',
    id: 'b-1',
    pid: null,
    sort: 1,
    path: '/homePage',
    icon: 'index',
    component: 'Layout',
    hidden: true,
    redirect: '/homePages/index',
    meta: { title: '首页', icon: 'index' },
    children: [
      /*{
        name: '业务端-为我推荐',
        id: 'b-2',
        pid: 'b-1',
        sort: 2,
        icon: 'index',
        path: 'index',
        component: 'homePage',
        meta: { title: '为我推荐', icon: 'index' },
        children: []
      },
      {
        name: '业务端-我的收藏',
        id: 'b-3',
        pid: 'b-1',
        sort: 3,
        icon: 'index',
        path: 'collect',
        component: 'homePage/collect',
        meta: { title: '我的收藏', icon: 'index' },
        children: []
      },
      {
        name: '业务端-上传图片',
        id: 'b-4',
        pid: 'b-1',
        sort: 4,
        icon: 'index',
        path: 'faker2',
        component: 'faker',
        meta: { title: '上传图片', icon: 'index' },
        children: []
      },
      {
        name: '业务端-查看报表',
        id: 'b-5',
        pid: 'b-1',
        sort: 5,
        icon: 'index',
        path: 'faker3',
        component: 'faker',
        meta: { title: '查看报表', icon: 'index' },
        children: []
      },
      {
        name: '业务端-常用功能',
        id: 'b-6',
        pid: 'b-1',
        sort: 6,
        icon: 'index',
        path: 'faker4',
        component: 'faker',
        meta: { title: '常用功能', icon: 'index' },
        children: []
      }*/
    ]
  },
  {
    name: '业务端-在线定制',
    id: 'b-7',
    pid: null,
    sort: 1,
    path: '/design',
    icon: 'index',
    component: 'Layout',
    redirect: '/design/index',
    meta: { title: '在线定制', icon: 'index' },
    children: [
      {
        name: '业务端-原型列表',
        id: 'b-8',
        pid: 'b-7',
        sort: 2,
        icon: 'index',
        path: 'index',
        component: 'design',
        meta: { title: '原型列表', icon: 'index' },
        children: []
      },
      {
        name: '业务端-原型详情',
        id: 'b-25',
        pid: 'b-7',
        sort: 3,
        icon: 'index',
        path: 'detail',
        hidden: true,
        component: 'design/detail',
        meta: { title: '原型详情', icon: 'index' },
        children: []
      }
    ]
  },
  {
    name: NAV_DESIGN_NAME,
    id: 'b-26',
    pid: null,
    sort: 1,
    path: '/design/designContainer',
    icon: 'index',
    hidden: true,
    component: 'design/designContainer',
    meta: { title: '定制器', icon: 'index' },
    children: []
  },
  {
    name: '业务端-我的产品',
    id: 'b-9',
    pid: null,
    sort: 1,
    path: '/product',
    icon: 'index',
    component: 'Layout',
    redirect: '/product/private',
    meta: { title: '我的产品', icon: 'index' },
    children: [
      {
        name: '业务端-产品列表',
        id: 'b-10',
        pid: 'b-9',
        sort: 2,
        icon: 'index',
        path: 'private',
        component: 'product/private',
        meta: { title: '我的产品', icon: 'ic_commodity' },
        children: []
      },
      {
        name: '业务端-已关联产品',
        id: 'b-11',
        pid: 'b-9',
        sort: 3,
        icon: 'index',
        path: 'public',
        component: 'product/public',
        meta: { title: '已关联产品', icon: 'ic_link_two' },
        children: []
      },
      {
        name: '业务端-成本计算器',
        id: 'b-57',
        pid: 'b-9',
        sort: 3,
        icon: 'index',
        path: 'calculator',
        component: 'product/calculator',
        meta: { title: '成本计算器', icon: 'cost-calculator' },
        children: []
      },
      {
        name: '业务端-产品详情',
        id: 'b-12',
        pid: 'b-9',
        sort: 3,
        icon: 'index',
        path: 'detail',
        hidden: true,
        component: 'product/detail',
        meta: { title: '产品详情', icon: 'index' },
        children: []
      }
    ]
  },
  {
    name: '业务端-订单管理',
    id: 'b-12',
    pid: null,
    sort: 1,
    path: '/order',
    icon: 'index',
    component: 'Layout',
    redirect: '/order/pending',
    meta: { title: '订单管理', icon: 'index' },
    children: [
      {
        name: '业务端-全部订单',
        id: 'b-54',
        pid: 'b-12',
        sort: 2,
        icon: 'index',
        path: 'allOrder',
        component: 'order/allOrder',
        meta: { title: '全部订单', icon: 'ic_view' },
        children: []
      },
      {
        name: '业务端-待处理',
        id: 'b-55',
        pid: 'b-12',
        sort: 3,
        icon: 'index',
        path: 'pending',
        component: 'order/pending',
        meta: { title: '待处理', icon: 'ic_view' },
        children: []
      },
      {
        name: '业务端-运单申请',
        id: 'b-56',
        pid: 'b-12',
        sort: 4,
        icon: 'index',
        path: 'waybillRequest',
        component: 'order/waybillRequest',
        meta: { title: '运单申请', icon: 'ic_view' },
        children: []
      },
      {
        name: '业务端-排单中',
        id: 'b-29',
        pid: 'b-12',
        sort: 5,
        icon: 'index',
        path: 'inOrder',
        component: 'order/inOrderDetail',
        meta: { title: '排单中', icon: 'ic_loading' },
        children: []
      },
      {
        name: '业务端-生产中',
        id: 'b-30',
        pid: 'b-12',
        sort: 6,
        icon: 'index',
        path: 'inProduction',
        component: 'order/inProductDetail',
        meta: { title: '生产中', icon: 'ic_devices' },
        children: []
      },
      {
        name: '业务端-已发货',
        id: 'b-31',
        pid: 'b-12',
        sort: 7,
        icon: 'index',
        path: 'delivered',
        component: 'order/delivered',
        meta: { title: '已发货', icon: 'ic_truck' },
        children: []
      },
      {
        name: '业务端-运单已过期',
        id: 'b-32',
        pid: 'b-12',
        sort: 8,
        icon: 'index',
        path: 'expired',
        component: 'order/expired',
        meta: { title: '运单已过期', icon: 'ic_aogo' },
        children: []
      },
      {
        name: '业务端-已取消',
        id: 'b-33',
        pid: 'b-12',
        sort: 9,
        icon: 'index',
        path: 'cancelled',
        component: 'order/cancelled',
        meta: { title: '已取消', icon: 'ic_reduce' },
        children: []
      },
      {
        name: '业务端-退货中',
        id: 'b-34',
        pid: 'b-12',
        sort: 10,
        icon: 'index',
        path: 'returnGoods',
        component: 'order/returnGoods',
        meta: { title: '退货中', icon: 'ic_reject' },
        children: []
      },
      {
        name: '业务端-订单换单',
        id: 'b-35',
        pid: 'b-12',
        sort: 11,
        icon: 'index',
        path: 'changeOrder',
        component: 'order/changeOrder',
        meta: { title: '订单换单', icon: 'ic_exchan' },
        children: []
      },
      {
        name: '业务端-订单导入',
        id: 'b-13',
        pid: 'b-12',
        sort: 2,
        icon: 'index',
        path: 'orderImport',
        hidden: true,
        component: 'order/orderImoprt',
        meta: { title: '订单导入', icon: 'ic_export' },
        children: []
      }
    ]
  },
  {
    name: PERSONAL_CENTER_NAME,
    id: 'b-16',
    pid: null,
    sort: 1,
    path: '/personalCenter',
    icon: 'index',
    component: 'Layout',
    redirect: '/personalCenter/account/personalInfo',
    meta: { title: '个人中心', icon: 'index' },
    children: [
      {
        name: '业务端-账户管理',
        id: 'b-17',
        pid: 'b-16',
        sort: 2,
        icon: 'index',
        path: 'account',
        component: 'personal',
        meta: { title: '账户管理', icon: 'icon' },
        children: [
          {
            name: '业务端-个人信息',
            id: 'b-18',
            pid: 'b-17',
            sort: 2,
            icon: 'index',
            path: 'personalInfo',
            component: 'personal/personalInfo',
            meta: { title: '个人信息', icon: 'ic_user' },
            children: []
          },
          {
            name: '业务端-个人中心-我的收藏',
            id: 'b-19',
            pid: 'b-17',
            sort: 4,
            icon: 'index',
            path: 'myCollect',
            component: 'personal/myCollect',
            meta: { title: '我的收藏', icon: 'ic_star-un' },
            children: []
          },
          {
            name: '业务端-我的图片',
            id: 'b-20',
            pid: 'b-17',
            sort: 5,
            icon: 'index',
            path: 'myPicture',
            component: 'personal/myPicture',
            meta: { title: '我的图片', icon: 'ic_pic' },
            children: []
          },
          {
            name: '业务端-操作日志',
            id: 'b-21',
            pid: 'b-17',
            sort: 6,
            icon: 'index',
            path: 'faker4',
            component: 'faker',
            meta: { title: '操作日志', icon: 'ic_log' },
            children: []
          }
        ]
      },
      {
        name: '业务端-权限管理',
        id: 'b-22',
        pid: 'b-16',
        sort: 2,
        icon: 'index',
        path: 'permission',
        component: 'system/permissionMange',
        redirect: 'system/role',
        meta: { title: '权限管理', icon: 'icon' },
        children: [
          {
            name: '业务端-角色权限',
            path: 'system/role',
            id: 'b-23',
            pid: 'b-22',
            sort: 8,
            icon: 'role',
            component: 'system/role',
            meta: { title: '角色权限', icon: 'ic_qunx' },
            children: []
          },
          {
            name: '业务端-子账号管理',
            id: 'b-46',
            pid: 'b-22',
            sort: 8,
            icon: 'index',
            path: 'user',
            component: 'system/user',
            meta: { title: '子账号管理', icon: 'ic_ziw' },
            children: []
          },
          {
            name: '业务端-添加角色',
            path: 'system/role/addRole',
            id: 'b-47',
            pid: 'b-22',
            sort: 8,
            icon: 'role',
            component: 'system/role/addRole',
            meta: { title: '添加角色', icon: 'role' },
            hidden: true,
            children: []
          },
          {
            name: '业务端-编辑角色',
            path: 'system/role/editRole',
            id: 'b-48',
            pid: 'b-22',
            sort: 9,
            icon: 'role',
            component: 'system/role/editRole',
            meta: { title: '编辑角色', icon: 'role' },
            hidden: true,
            children: []
          },
          {
            name: '业务端-添加子账号',
            path: 'system/user/addUser',
            id: 'b-49',
            pid: 'b-22',
            sort: 8,
            icon: 'role',
            component: 'system/user/addUser',
            meta: { title: '添加子账号', icon: 'role' },
            hidden: true,
            children: []
          },
          {
            name: '业务端-编辑子账号',
            path: 'system/user/editUser',
            id: 'b-50',
            pid: 'b-22',
            sort: 9,
            icon: 'role',
            component: 'system/user/editUser',
            meta: { title: '编辑子账号', icon: 'role' },
            hidden: true,
            children: []
          }
        ]
      }
    ]
  },
  {
    name: MENUS_NAME,
    id: 'b-51',
    pid: null,
    sort: 3,
    path: '/menus',
    icon: 'caidan',
    hidden: true,
    component: 'system/menu',
    meta: { title: '菜单管理', icon: 'caidan' }
  }
]
export default superRouter
