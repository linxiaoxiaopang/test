
const bus = {
  state: {},
  mutations: {
    SET_BUS(state, data) {
      Object.assign(state, data)
    }
  }
}

export default bus
