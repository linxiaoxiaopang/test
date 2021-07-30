import request from '@/service/request'
import { MENU_TYPE } from '@/utils/constant'

//登录
export function login(data) {
  return request({
    url: '/api/login/',
    method: 'post',
    data
  })
}

//刷新token
export function refreshToken(data) {
  return request({
    url: '/api/refresh/',
    method: 'post',
    data
  })
}

//检查token是否有效
export function verifyToken(data) {
  return request({
    url: '/api/verify/',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/info/',
    method: 'get'
  })
}

export function buildMenus() {
  return request({
    url: '/api/build/menus/',
    method: 'get',
    params: {
      menu_type: MENU_TYPE
    }
  })
}

// 退出登录调用接口
export function logoutting() {
  return request({
    url: '/api/logout',
    method: 'post'
  })
}
