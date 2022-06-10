<template>
  <div id="app">
    <router-link :to="path" :key="index" v-for="({ path }, index) in routes"
      >{{path}}</router-link
    >
    <router-view />
  </div>
</template>

<script>
import { routes } from "@/router";
export default {
  name: "App",

  computed: {
    routes() {
      return routes;
    },
  },
};
</script>
<style scoped>
a {
  margin-right: 10px;
}
</style>