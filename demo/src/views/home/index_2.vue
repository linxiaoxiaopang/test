<template>
  <div>
    home
    <Hello />
    <Hello1 />
  </div>
</template>

<script>

export default {
  components: {
    Hello: () => import('../examples/hello.vue'),
    Hello1: () => import('../examples/hello1.vue')
  },
};
</script>

<style>
</style>