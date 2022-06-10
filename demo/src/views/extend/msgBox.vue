<template>
  <div v-loading="loading">
    {{ hi }}
  </div>
</template>

<script>
export default {
  props: {
    hi: {
      type: String,
      default: "hi",
    },
  },

  data() {
    return {
      loading: false,
    };
  },
};
</script>

<style>
</style>