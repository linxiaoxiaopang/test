const getters = {
  testObj: (state) => state.test.testObj,
  filterTestData: (state) => (num) => {
    console.log('state', state)
    return state.test.testData.filter(val => val >= num)
  }

};

export default getters;
