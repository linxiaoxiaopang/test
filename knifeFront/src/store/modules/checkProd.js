import cloneDeep from 'lodash/cloneDeep'
const checkImage = {
  namespaced: true,
  state: {
    checkImage: []
  },
  mutations: {
    SET_CHECK_IMAGE(state, data) {
      if (data.length && data.length > 0) {
        data.forEach((item) => {
          if (item.is_right) {
            item.groups.forEach((item) => {
              item.is_right = 1
            })
          }
        })
      }
      state.checkImage = data
    },
    SET_CHECK_IMAGE_GROUP(state, { id, index, is_right }) {
      const idx = state.checkImage.findIndex((item) => item.id === id)
      const checkImage = cloneDeep(state.checkImage)
      checkImage[idx].groups[index].is_right = is_right
      if (!is_right && checkImage[idx].is_right) {
        checkImage[idx].is_right = 0
      }
      state.checkImage = checkImage
    }
  },
  actions: {}
}

export default checkImage
