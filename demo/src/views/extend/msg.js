import Vue from "vue";
import msgBox from "./msgBox";
import merge from "element-ui/src/utils/merge";
console.log("msgBox", msgBox);

const Msg = Vue.extend({
  ...msgBox,
});

const vm = new Msg({
  el: document.createElement("div"),
  props: {
    hi: {
      type: String,
      default: "hi vm",
    },
  },
  render(h) {
    return h("span", "你好世界");
  },
});
console.log("el", vm.$el);
// vm.$mount('#app')
console.log("vm", vm);
document.body.appendChild(vm.$el)


Vue.prototype.$msg = function (options) {
  const msg = new Msg({
    el: document.createElement("div"),
    props: {
      h2: {
        type: String,
        default: "h2",
      },
    },
  });
  merge(msg, options);
  const el = msg.$el;
  document.body.appendChild(el);
  return msg;
};

export default Msg;
