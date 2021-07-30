import { login, getInfo, logoutting } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { parseTime } from '@/utils'
import { getChildUser } from '@/api/user'

const user = {
  state: {
    token: getToken(),
    id: '',
    name: '',
    email: '',
    avatar: '',
    createTime: '',
    roles: [],
    is_super: false,
    type: undefined,
    childUser: []
  },

  mutations: {
    SET_TOKEN: (state, { token, rememberMe, expires = 7 }) => {
      state.token = token
      setToken(token, rememberMe, expires)
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_CREATE_TIME: (state, createTime) => {
      state.createTime = createTime
    },
    SET_EMAIL: (state, email) => {
      state.email = email
    },
    //设置超级管理员
    SET_IS_SUPER: (state, is_super) => {
      state.is_super = is_super
    },
    SET_TYPE: (state, type) => {
      state.type = type
    },
    SET_CHILD_USER: (state, userList) => {
      state.childUser = userList
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username
      const password = userInfo.password
      const rememberMe = userInfo.rememberMe
      return new Promise((resolve, reject) => {
        login({ username, password })
          .then((res) => {
            const { code, detail } = res
            if (code >= 200 && code < 300) {
              const { token } = detail || {}
              commit('SET_TOKEN', { token, rememberMe })
              resolve(res)
            }
            reject(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res) => {
            const {
              detail: {
                createTime,
                email,
                id,
                roles,
                is_super,
                type = 2,
                username
              } = {}
            } = res || {}
            commit('SET_ID', id)
            commit('SET_NAME', username)
            commit('SET_EMAIL', email)
            commit('SET_CREATE_TIME', parseTime(createTime))
            commit('SET_IS_SUPER', is_super)
            commit('SET_TYPE', type)
            if (is_super) {
              commit('SET_ROLES', ['admin'])
            } else {
              commit('SET_ROLES', roles || [])
            }
            dispatch('GetChildUser', id)
            resolve(res)
          })
          .catch((err) => {
            console.log(err)
          })
      })
    },

    // 获取用户子账号
    async GetChildUser({ commit }, id) {
      let { detail } = await getChildUser({
        parent_id: id
      })
      commit('SET_CHILD_USER', detail)
    },
    
    // 刷新Token
    refreshToken({ commit }) {
    
    },

    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logoutting()
          .then((res) => {
            const { code } = res
            if ($SUC({ code })) {
              removeToken()
              resolve(true)
            }
          })
          .catch((err) => {
            removeToken()
            resolve(false)
          })
          .finally(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
      })
    }
  }
}

export default user
