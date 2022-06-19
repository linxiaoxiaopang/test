<template>
  <div>
    <div @click="setTest">
      setTest
    </div>
    <div @click="getFilterTestData">
      filterTestData
    </div>
  </div>

</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      data: 1111,
    };
  },

  computed: {
    ...mapGetters(['testObj', 'filterTestData'])
  },



  destroyed() {
    this.SET_TEST(null);
  },

  methods: {
    ...mapMutations(["SET_TEST"]),

    getFilterTestData() {
      console.log('this.filterTestData', this.filterTestData(3))
    },

    setTest() {
      const hello = { hello: "hello world" };
      //   this.$store.commit("test/SET_TEST", hello);
      this.SET_TEST(hello);
      w1.set(hello, `testObj_${count}`);
    },
  },
};
</script>

<style>
</style>