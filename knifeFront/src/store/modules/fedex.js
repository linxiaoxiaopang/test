import { list as fedexList } from '@/api/order/fedexApi'

const user = {
  state: {
    fedexFinish: false,
    fedexData: []
  },

  mutations: {
    SET_FEXDEX_STATUS(state, finish) {
      state.fedexFinish = finish
    },
    SET_FEXDEX_DATA(state, fedexData) {
      state.fedexData = fedexData || []
    }
  },

  actions: {
    PushFedexData({ commit }) {
      return new Promise((resolve, reject) => {
        fedexList()
          .then((res) => {
            const { code, detail } = res
            if ($SUC({ code })) {
              commit('SET_FEXDEX_DATA', detail)
              commit('SET_FEXDEX_STATUS', true)
              resolve(res)
            }
            reject(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  }
}

export default user
