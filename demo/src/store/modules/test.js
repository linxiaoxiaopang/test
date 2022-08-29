const test = {
  state: {
    testObj: {},
    testData: [1, 2, 3, 4, 5, 6]
  },
  mutations: {
    SET_TEST(state, testObj) {
      state.testObj = testObj;
      // testObj = null
    },
  },
  actions: {},
};

export default test;
