<template>
  <div>
    <div @click="promiesFunc">promise</div>
    <div @click="promiesFunc1">promise1</div>
  </div>
</template>

<script>
export default {
  created() {},

  methods: {
    async promiesFunc() {
      const p = Promise.resolve;
      await p;
      //   await new Promise((resolve) => {
      //     this.resolve = resolve;
      //   });
      console.log(3333);
    },

    async promiesFunc1() {
      this.resolve(true);
    },
  },
};
</script>

<style>
</style>