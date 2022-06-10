<template>
  <div>
    <VnodeSlot :key="key" ref="vnode">
      <div class="a" @click="clickHandler">{{ list }}</div>
      <div class="b">b</div>
      <div class="c">c</div>
      <Slot1 :list="list" />
      <template #list>
      <Slot1 :list="list" />

      </template>
    </VnodeSlot>
  </div>
</template>

<script>
import VnodeSlot from "./vnodeSlot.vue";
import Slot1 from "./slot1.vue";

export default {
  components: {
    VnodeSlot,
    Slot1,
  },

  data() {
    return {
      key: "1",
      list: [1, 2, 3],
    };
  },

  methods: {
    clickHandler() {
      this.list.push(4);
    },
  },

  updated() {
    console.log(7777777777);
  },
};
</script>

<style>
</style>