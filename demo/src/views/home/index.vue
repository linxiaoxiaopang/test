<template>
  <div>
    home
    <div @click="clickHandler">click</div>
  </div>
</template>

<script>
import { a } from "@/utils";
import a1 from "@/utils/index_1";
// const  a1 = require('@/utils/index_1')
console.log("utils", a);
console.log("utils_1", a1);


export default {


  methods: {
    clickHandler() {
      console.log('a11', a1)
    },
  },
};
</script>

<style>
</style>