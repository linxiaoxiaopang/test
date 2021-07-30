const personProp = [
  {
    prop: '个人信息',
    url: '/personalCenter/account/personalInfo'
  },
  {
    prop: '我的收藏',
    url: '/personalCenter/account/myCollect'
  },
  {
    prop: '我的图片',
    url: '/personalCenter/account/myPicture'
  },
  {
    prop: '操作日志',
    url: '/personalCenter/account/faker4'
  },
  {
    prop: '角色权限',
    url: '/personalCenter/permission/system/role'
  },
  {
    prop: '子账号管理',
    url: '/personalCenter/permission/user'
  }
]

const menuGroups = {
  '/order': {
    allOrder: 0,
    pending: 1,
    waybillRequest: 1,
    inOrder: 1,
    inProduction: 2,
    delivered: 2,
    expired: 3,
    cancelled: 3,
    returnGoods: 3,
    changeOrder: 3
  }
}

export {
  personProp,
  menuGroups
}