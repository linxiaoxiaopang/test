import Vue from 'vue'

console.log('Vuex', Vuex)
// import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

const modulesFiles = require.context('./modules', true, /\.js$/)

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

console.log('modules', modules)
console.log('getters', getters)

const store = new Vuex.Store({
  devtools: false,
  modules,
  getters
})

export default store
