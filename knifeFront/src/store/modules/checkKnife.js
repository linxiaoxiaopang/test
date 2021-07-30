const checkKnife = {
  state: {
    knifePsds: [],
    knifeStandardStatus: true
  },
  mutations: {
    SET_KNIFE_PSDS(state, knifePsds) {
      state.knifePsds = knifePsds
    },
    SET_KNIFE_STANDARD_STATUS(state, knifeStandardStatus) {
      state.knifeStandardStatus = knifeStandardStatus
    }
  },
  actions: {}
}

export default checkKnife
