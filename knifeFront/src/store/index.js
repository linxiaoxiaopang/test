import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import api from './modules/api'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import product from './modules/product'
import design from './modules/design'
import dic from './modules/dic'
import bus from './modules/bus'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    api,
    user,
    tagsView,
    permission,
    product,
    design,
    dic,
    bus
  },
  getters
})

export default store
