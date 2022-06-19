<template>
  <div @click="setTest">
    hello world
    {{ testObj && testObj.hello }}
    <el-input></el-input>
    <el-input v-prdOff type="password"></el-input>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import {prdOff} from "v-prd-off";

console.log('prdOff', prdOff)
export default {
  data() {
    return {
      data: 1111,
    };
  },
  directives: {
    prdOff
  },

  computed: {
    ...mapState(["testObj"]),
  },

  created() {
    count++
  },

  destroyed() {
    this.SET_TEST(null);
  },

  methods: {
    ...mapMutations(["SET_TEST"]),
    setTest() {
      const hello = { hello: "hello world" };

      //   this.$store.commit("test/SET_TEST", hello);
      this.SET_TEST(hello);
      w1.set(hello, `testObj_${count}`);
    },
  },
};
</script>

<style>
</style>