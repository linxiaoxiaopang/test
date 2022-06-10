<template>
  <div>
    Hello
    {{ a }}
    <helloConstructor />
    <Msg />
    child
    <MsgboxChild />
  </div>
</template>

<script>
import Hello from "./hello.js";
import Msg from "./msg.js";
import MsgboxChild from "./msgboxChild";

export default {
  components: {
    Msg,
    MsgboxChild,
  },

  data() {
    return {
      a: 100,
    };
  },
  created() {
    const msg = this.$msg({ hi: "hello", loading: true });
    setTimeout(() => {
      msg.loading = false;
    }, 2000);
  },
};
</script>

<style>
</style>