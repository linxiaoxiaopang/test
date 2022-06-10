<template>
  <div>
    home
    <Hello />
    <Hello1 />
    <div @click="clickHandler">click</div>
  </div>
</template>

<script>
import { Hello, Hello1 } from "../examples";
import * as examples from "../examples";
import examples1 from "../examples";
import { a } from "@/utils";
import a1 from "@/utils/index_1";
// const  a1 = require('@/utils/index_1')
console.log("utils", a);
console.log("utils_1", a1);
console.log("examples", examples);
console.log("examples1", examples1);

export default {
  components: {
    Hello,
    Hello1,
  },

  methods: {
    clickHandler() {
      console.log('a11', a1)
    },
  },
};
</script>

<style>
</style>