<template>
  <div>
    <HelloSlot>
      <Hello1 :list="list" />
      <div v-if="show">2</div>
      <div>3</div>
      <div>4</div>
      <template #test1>
        <span>test1</span>
      </template>
      <template #test>
        <span>test</span>
      </template>
      <span @click="show = !show">toggleShow</span>
    </HelloSlot>
  </div>
</template>

<script>
import Hello1 from "./hello1.vue";
import HelloSlot from "./helloSlot.vue";
import HelloSlot1 from "./helloSlot1.vue";
export default {
  components: {
    Hello1,
    HelloSlot,
    HelloSlot1,
  },

  data() {
    return {
      show: true,
      list: [1, 2, 3],
    };
  },
};
</script>

<style>
</style>