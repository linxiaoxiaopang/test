const checkKnife = {
  state: {
    knifePsds: [],
    isGoBack: false,
    knifeStandardStatus: true
  },
  mutations: {
    SET_KNIFE_PSDS(state, knifePsds) {
      state.knifePsds = knifePsds
    },
    SET_KNIFE_STANDARD_STATUS(state, knifeStandardStatus) {
      state.knifeStandardStatus = knifeStandardStatus
    },
    SET_IS_GO_BACK(state, isGoBack) {
      state.isGoBack = isGoBack
    }
  },
  actions: {}
}

export default checkKnife
