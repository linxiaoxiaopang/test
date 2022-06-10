<template>
  <div>
    helloSlot1
    <ul>
      <li v-for="(item, index) in slotList" :key="index">{{ item }}</li>
    </ul>
    <slot name="name" :user="{ userName: 'userName' }"></slot>
  </div>
</template>

<script>
export default {
  computed: {
    slotList() {
      console.log(this.$slots);
      console.log(this.$scopedSlots);
      console.log(this.$scopedSlots.name());
      return [1, 2, 3];
    },
  },

  created() {
    const name = this.digui({
      child: {
        name: "child",
        child: {
          name: "grandChild",
        },
      },
      name: "parent",
    });

    console.log("name", name);
  },

  methods: {
    digui(obj) {
      let str = obj.name;
      if (obj.child) {
       str+= this.digui(obj.child);
      }
      return str
    },
  },
};
</script>

<style>
</style>