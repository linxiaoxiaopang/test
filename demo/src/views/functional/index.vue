<template>
  <div>
    functional
    <hello1 msg="你好，世界！1111"/>
    <Functional :type="type" haha="哈哈" @click="clickHandler" />
    <Functional1 :vnode="vnode" haha="哈哈" @click="clickHandler" />
    <Functional2>
      <div>Functional2</div>
      <template #hello>
        <span>hello</span>
      </template>
    </Functional2>
  </div>
</template>

<script>
import hello from "vue-lin-hello";
import Functional from "./functional";
import Functional1 from "./functional1";
import Functional2 from "./functional2";
export default {
  components: {
    Functional,
    Functional1,
    Functional2,
    hello1: hello
  },

  data() {
    return {
      type: "info",
      vnode: this.$createElement("div", "hello wrold"),
    };
  },

  methods: {
    clickHandler() {
      this.type = "primary";
      console.log("哈哈");
    },
  },
};
</script>

<style>
</style>