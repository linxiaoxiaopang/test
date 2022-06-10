// hello.js
import Vue from "vue";
import HelloTemplate from "./hello.vue";
console.log('HelloTemplate',  HelloTemplate)
// 使用extend方法创建vue的子类
const HelloConstructor = Vue.extend({
  ...HelloTemplate,
  data() {
    return {
      c: 100,
    };
  },
  props: {
    msg: {
      type: String,
      default: "hello world",
    },
  },

  render(h) {
    return h("div", [h("span", this.msg), h("span", this.c)]);
  },
});

console.log("HelloConstructor", HelloConstructor);
Vue.component('helloConstructor', HelloConstructor)
// export default HelloConstructor;
