<template>
  <div>
    home
    <Hello />
    <Hello1 />
  </div>
</template>

<script>
import { Hello, Hello1 } from "../examples";

import a from "../examples";
console.log('a', a)

export default {
  components: {
    Hello,
    Hello1
  },
};
</script>

<style>
</style>