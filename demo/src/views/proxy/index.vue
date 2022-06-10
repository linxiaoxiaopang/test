<template>
  <div>
    <div @click="createProxy">createProxy</div>

    <div @click="defineProperty">defineProperty</div>
  </div>
</template>

<script>
import { createProxy, defineProperty } from "@/utils";
const obj = createProxy({ count: 0 });
const b = defineProperty();

export default {
  data() {
    return {
      num: 0,
    };
  },

  methods: {
    createProxy() {
      ++obj.count
    },

    defineProperty() {
      b.a = ++this.num;
    },
  },
};
</script>

<style>
</style>