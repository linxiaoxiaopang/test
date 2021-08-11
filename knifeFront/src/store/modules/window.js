import { list as fedexList } from '@/api/order/fedexApi'

const user = {
  state: {
    windowData: {},
  },

  mutations: {
    SET_WINDOW_DATA(state, windowData) {
        state.windowData = windowData
    },
 
  },

  actions: {
   
  }
}

export default user
