import Vue from "vue";
import router from "@/router";
import store from "./store";
// console.log('router', router)
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Avue from "@smallwei/avue";
import axios from "axios";
import "@smallwei/avue/lib/index.css";



// Vue.config.debug = false
// Vue.config.devtools = false
// Vue.config.productionTip = false

window.w1 = new WeakMap()
window.count = 0
window.count1 = 0
// setInterval(() => {
//     console.log('window.w1', window.w1)
// }, 2000)


Vue.config.productionTip = false;

Vue.use(ElementUI).use(Avue, {axios});

// Vue.mixin({beforeCreate: vuexInit})


function vuexInit() {
    setTimeout(() => {
        const options = this.$options

        if (options.test) {
            this.test = options.test
        } else if (options.parent && options.parent.test) {
            this.test = options.parent.test
        }
        // console.log('this', this)
        console.log('testtesttesttesttesttest', this.test)
    })


    // const options = this.$options
    // // store injection
    // if (options.store) {
    //     this.$store = typeof options.store === 'function' ? options.store() : options.store
    // } else if (options.parent && options.parent.$store) {
    //     this.$store = options.parent.$store
    // }
}

const test = {
    hello: 'hello'
}

new Vue({
    test, router, store, render: (h) => h(App),
}).$mount("#app");
