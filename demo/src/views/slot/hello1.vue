<template>
  <div>
    hello 1
    <ul>
      <li v-for="(item, index) in list" :key="index">{{ item }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    list: Array
  },
};
</script>

<style>
</style>